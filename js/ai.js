/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function updateEnemies(deltaTime) { // Aggiornamento dei nemici per frame

    // Converte la posizione reale (pixel) in riga e colonna del labirinto
    const playerRow = stablePlayerCell.row;
    const playerCol = stablePlayerCell.col;

    // Se non sono attivati, non si muovono
    if (!enemiesActivated) return;

    // Ciclo su ogni nemico
    for (let enemy of enemies) {

        if (
            (enemy.state === "investigate" || enemy.state === "search" || enemy.state === "chase") &&
            !enemy.target
        ) {
            enemy.state = "wander";
            enemy.wanderTarget = null;
            enemy.currentCellTarget = null;
        }

        // Enemy pos
        const enemyRow = Math.floor(enemy.y / cell_size);
        const enemyCol = Math.floor(enemy.x / cell_size);

        // INVESTIGATE ha priorità assoluta sul movimento
        if (enemy.state === "investigate" &&
            enemy.target &&
            enemyRow === enemy.target.row &&
            enemyCol === enemy.target.col) {

            const centerX = enemy.target.col * cell_size + cell_size / 2;
            const centerY = enemy.target.row * cell_size + cell_size / 2;

            const dx = centerX - enemy.x;
            const dy = centerY - enemy.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            // FASE 1: Vai verso il centro in modo naturale
            if (dist > 1) {

                const length = dist;

                if (length > 0) {
                    enemy.angle = Math.atan2(dy, dx);

                    enemy.x += (dx / length) * enemy.speed * deltaTime * 60;
                    enemy.y += (dy / length) * enemy.speed * deltaTime * 60;
                }

                entitiesCollision(enemy);
                continue; // NON continuare nel pathfinding
            }

            // FASE 2: Sei al centro → fermo e scansiona

            enemy.scanTime += deltaTime;

            const amplitude = Math.PI / 3; // 60°
            const omega = 2.5;

            enemy.angle =
                enemy.scanBaseAngle +
                amplitude * Math.sin(enemy.scanTime * omega);

            enemy.investigateTimer -= deltaTime;

            // Il primo che arriva consuma il rumore
            if (noiseOwner === null) {
                noiseOwner = enemy;
                noiseEvent = null;

                for (let other of enemies) {
                    if (other !== enemy) {
                        other.state = "wander";
                        other.target = null;
                        other.currentCellTarget = null;
                        other.wanderTarget = null;
                    }
                }
            }

            if (enemy.investigateTimer <= 0) {
                enemy.state = "wander";
                enemy.target = null;
                enemy.currentCellTarget = null;
                noiseOwner = null;
            }

            continue;
        }

        // Memorizza ultima cella
        if (!enemy.lastCell ||
            enemy.lastCell[0] !== enemyRow ||
            enemy.lastCell[1] !== enemyCol) {

            enemy.lastCell = [enemyRow, enemyCol];
        }

        // Se enemy è nella stessa cella del player → inseguimento diretto
        if (!command.invisibleMode && enemyRow === playerRow && enemyCol === playerCol) {

            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const l = Math.sqrt(dx * dx + dy * dy);
            const rb = enemy.radius + player.radius;

            if (!command.invisibleMode && l > rb) {
                enemy.x += (dx / l) * enemy.speed * deltaTime * 60;
                enemy.y += (dy / l) * enemy.speed * deltaTime * 60;
            }


            entitiesCollision(enemy);

            // Collisione
            const dxp = enemy.x - player.x,
                dyp = enemy.y - player.y,
                rr = enemy.radius + player.radius,
                dd = dxp * dxp + dyp * dyp;

            if (dd < rr * rr) {
                const d = Math.sqrt(dd) || 0.0001;
                const ov = rr - d;
                enemy.x += (dxp / d) * ov;
                enemy.y += (dyp / d) * ov;
            }

            if (!command.invisibleMode && respawnTimer <= 0 && dd <= (rr + 0.35) ** 2) {
                if (!command.immortal) {
                    let rnd = 2 + Math.random() * 3.5;
                    playerHitSound.currentTime = 0;
                    playerHitSound.playbackRate = 5;
                    playerHitSound.play();
                    player.hit++;
                    syncPlayerHealth()
                    if (player.hit >= player.maxHealth) {
                        deathSound.playbackRate = rnd;
                        deathSound.play();
                        resetPlayer();
                        deads++;
                        totalDeads = deads;
                    } else {
                        respawnTimerBlock(3);
                    }
                }
            }

            continue;
        }
        // Controllo visione
        const seesPlayer = hasLineOfSight(enemy, player);

        // PRIORITÀ STATI

        if (!command.invisibleMode) {
            if (seesPlayer) {

                enemy.memoryTimer = enemy.memoryDuration;
                enemy.state = "chase";
                enemy.target = { row: playerRow, col: playerCol };
                enemy.color = enemy.colors.red;
            }
            else if (enemy.state === "investigate") {

                // non sovrascrivere finché sta investigando

            }
            else if (noiseEvent && noiseOwner === null) {

                enemy.state = "investigate";
                enemy.target = { row: noiseEvent.row, col: noiseEvent.col };
                enemy.investigateTimer = 2.0;
                enemy.currentCellTarget = null;
                enemy.color = enemy.colors.yellow;
                enemy.scanBaseAngle = enemy.angle;
                enemy.scanTime = 0;
            }
            else if (enemy.memoryTimer > 0) {

                enemy.memoryTimer -= deltaTime;
                enemy.state = "search";
                enemy.target = { row: playerRow, col: playerCol };
                enemy.color = enemy.colors.orange;

            }
            else {

                enemy.state = "wander";
                enemy.target = null;
                enemy.color = enemy.colors.none;

            }
            enemy.speed = diff_speed * ((enemy.state === "chase" || enemy.state === "search" || enemy.state === "investigate") ? 1.5 : 1) // Accelera se il player è spottato
        }

        // Determina target
        let targetRow = null;
        let targetCol = null;

        // CHASE
        if (enemy.state === "chase") {
            targetRow = playerRow;
            targetCol = playerCol;
        }

        // INVESTIGATE
        if (enemy.state === "investigate" && enemy.target) {
            targetRow = enemy.target.row;
            targetCol = enemy.target.col;
        }

        // SEARCH
        else if (enemy.state === "search" && enemy.target) {
            targetRow = enemy.target.row;
            targetCol = enemy.target.col;
        }

        // WANDER
        else if (enemy.state === "wander") {

            if (!enemy.wanderTarget) {

                // usa la BFS già calcolata verso una cella casuale lontana
                const distFromEnemy = bfsDistances(enemyRow, enemyCol);

                let candidates = [];

                if (candidates.length === 0) {
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            if (maze[r][c] !== 0) continue;
                            if (distFromEnemy[r][c] > 0) candidates.push([r, c]);
                        }
                    }
                }

                if (candidates.length > 0) {
                    const pick = candidates[Math.floor(Math.random() * candidates.length)];
                    enemy.wanderTarget = { row: pick[0], col: pick[1] };
                } else {
                    enemy.wanderTarget = { row: enemyRow, col: enemyCol };
                }
            }

            if (enemy.wanderTarget) {
                targetRow = enemy.wanderTarget.row;
                targetCol = enemy.wanderTarget.col;
            }
        }
        if (targetRow == null || targetCol == null) {
            enemy.currentCellTarget = null;
            if (enemy.state === "wander") enemy.wanderTarget = null;
            continue;
        }

        // Ricalcola solo se cambia target
        if (!enemy.lastTarget ||
            enemy.lastTarget.row !== targetRow ||
            enemy.lastTarget.col !== targetCol) {

            enemy.cachedDist = bfsDistances(targetRow, targetCol);
            enemy.lastTarget = { row: targetRow, col: targetCol };
        }

        const dist = enemy.cachedDist

        // Se non ha un target cell, sceglilo
        if (!enemy.currentCellTarget) {

            let best = Infinity; // distanza attuale
            let next = null;

            const neighbors = getNeighborsOpen(enemyRow, enemyCol);

            for (let [nr, nc] of neighbors) {

                // evita backtracking immediato
                if (enemy.lastCell &&
                    nr === enemy.lastCell[0] &&
                    nc === enemy.lastCell[1]) {
                    continue;
                }

                // Vai solo verso celle realmente più vicine
                if (dist[nr][nc] >= 0 && dist[nr][nc] < best) {
                    best = dist[nr][nc];
                    next = [nr, nc];
                }
            }

            if (next) {
                enemy.currentCellTarget = next;
            }
        }

        // Usa sempre la cella target finché non la raggiunge
        let next = enemy.currentCellTarget;

        if (!next) {
            if (enemy.state === "wander") enemy.wanderTarget = null;
            enemy.lastTarget = null; // forza ricalcolo BFS al prossimo frame
            continue;
        }

        if (next) { // Se esiste cella migliore

            let targetX, targetY;

            // ---- targetX/targetY ----
            const manhattan = Math.abs(playerRow - enemyRow) + Math.abs(playerCol - enemyCol);
            const isHunting = !command.invisibleMode && (enemy.state === "chase" || enemy.state === "search" || enemy.state === "investigate");

            if (isHunting && seesPlayer) {
                const px = enemy.x - player.x;
                const py = enemy.y - player.y;
                const pl = Math.sqrt(px * px + py * py) || 0.0001;
                const rb = enemy.radius + player.radius;

                const contactBias = 0.35;
                targetX = player.x + (px / pl) * Math.max(0, rb - contactBias);
                targetY = player.y + (py / pl) * Math.max(0, rb - contactBias);
            } else if (isHunting && manhattan === 1) {
                // player in cella adiacente: punta alle coordinate reali, ma clampate nella sua cella
                const cellLeft = playerCol * cell_size;
                const cellTop = playerRow * cell_size;
                const cellRight = cellLeft + cell_size;
                const cellBottom = cellTop + cell_size;

                const margin = enemy.radius + 0.5; // evita di puntare “dentro” i muri

                targetX = Math.max(cellLeft + margin, Math.min(player.x, cellRight - margin));
                targetY = Math.max(cellTop + margin, Math.min(player.y, cellBottom - margin));
            } else {
                // altrimenti: sempre centro della cella next (pathfinding)
                targetX = next[1] * cell_size + cell_size / 2;
                targetY = next[0] * cell_size + cell_size / 2;
            }

            // Calcola distanza tra Enemy e Target
            const dx = targetX - enemy.x;
            const dy = targetY - enemy.y;

            const length = Math.sqrt(dx * dx + dy * dy);

            // Aggiorna la rotazione
            if (length > 0) {
                const targetAngle = Math.atan2(dy, dx); // Angolo verso il target
                let diff = targetAngle - enemy.angle;
                diff = Math.atan2(Math.sin(diff), Math.cos(diff));
                enemy.angle += diff * 0.15;
            }

            // Movimento
            if (length > 0) {

                if (length <= enemy.speed) {
                    // Se è molto vicino, vai direttamente al target
                    enemy.x = targetX;
                    enemy.y = targetY;
                } else {
                    // Movimento normale
                    enemy.x += (dx / length) * enemy.speed * deltaTime * 60;
                    enemy.y += (dy / length) * enemy.speed * deltaTime * 60;
                }
                entitiesCollision(enemy);
                // Se è entrato nella cella target, sblocca per scegliere la prossima
                if (enemy.currentCellTarget) {
                    const curRow = Math.floor(enemy.y / cell_size);
                    const curCol = Math.floor(enemy.x / cell_size);

                    if (curRow === enemy.currentCellTarget[0] && curCol === enemy.currentCellTarget[1]) {
                        enemy.currentCellTarget = null;
                    }
                }
            }
        }
        enemy.x = Math.max(enemy.radius, Math.min(gameCanvas.width - enemy.radius, enemy.x));
        enemy.y = Math.max(enemy.radius, Math.min(gameCanvas.height - enemy.radius, enemy.y));

        const newRow = Math.floor(enemy.y / cell_size);
        const newCol = Math.floor(enemy.x / cell_size);

        if (enemy.state === "search" &&
            enemy.target &&
            newRow === enemy.target.row &&
            newCol === enemy.target.col) {

            enemy.target = null;
        }

        if (enemy.state === "wander" &&
            enemy.wanderTarget &&
            newRow === enemy.wanderTarget.row &&
            newCol === enemy.wanderTarget.col) {

            enemy.wanderTarget = null;
        }
        // Collisione con player
        const dxp = enemy.x - player.x;
        const dyp = enemy.y - player.y;
        const rr = enemy.radius + player.radius;
        const dd = dxp * dxp + dyp * dyp;
        let rnd = 2 + Math.random() * 3.5;

        if (dd < rr * rr) {
            const d = Math.sqrt(dd) || 0.0001;
            const ov = rr - d;
            enemy.x += (dxp / d) * ov;
            enemy.y += (dyp / d) * ov;
        }

        if (!command.immortal && respawnTimer <= 0) {
            const hitR = rr + 0.35;
            if (dd <= hitR * hitR) {
                playerHitSound.currentTime = 0;
                playerHitSound.playbackRate = 5;
                playerHitSound.play();
                player.hit++
                syncPlayerHealth()
                if (player.hit >= player.maxHealth) {
                    deathSound.playbackRate = rnd;
                    deathSound.play();
                    resetPlayer();
                    deads++;
                    totalDeads = deads;
                } else {
                    respawnTimerBlock(3);
                }
            }
        }
    }
}
function resetPlayer() { // Resetta il player quando ucciso, al cambio di livello o totale rigenerazione del labirinto

    player.x = cell_size + cell_size / 2;
    player.y = cell_size + cell_size / 2;
    syncPlayerHealth();
    startSP();
    player.angle = 0;
    trail = [];

    if (bulletsMag < 4) {
        bulletsMag = 4;
    }

    respawnTimerBlock(safe);
    player.hit = 0;

    noiseEvent = null;
    noiseOwner = null;

    // ripristina pickup
    pickup = initialPickups.map(p => ({ row: p.row, col: p.col }));
    pickupRemaining = pickup.length;
    goalActive = false;
    keyScore = 0;
    scoreKills = 0;
    totalPickupsCollected = 0;
    scores.textContent = "Score: 0";
    enemiesActivated = false;
    enemyRespawnQueue = [];
    if (!command.peacefulMode) spawnEnemies(levelEnemyCount); // reset dei nemici
}
generateMaze();
drawMaze()