/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function randomOdd(min, max) {
    const count = Math.floor((max - min) / 2) + 1;
    return min + Math.floor(Math.random() * count) * 2;
}
function getNeighborsOpen(r, c) { // Restituisce le celle "path" valore 0 nel maze
    const out = []; // array delle celle path trovate

    // direzioni
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;

        // controlla che sia dentro la griglia e che sia una cella aperta
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] === 0) {
            out.push([nr, nc]);
        }
    }
    return out; // restituisce tutte le celle valide
}
function bfsDistances(startR, startC) { // Calcola la distanza minima da una cella di partenza verso le altre celle usando l'algoritmo BFS (Breadth-First Search)

    // matrice distanze inizializzata a -1 (non visitato)
    const dist = Array.from({ length: rows }, () => Array(cols).fill(-1));

    // coda BFS
    const q = [[startR, startC]];

    // la distanza della partenza è 0
    dist[startR][startC] = 0;

    // ciclo fino a che ci sono celle nella coda
    while (q.length) {
        const [r, c] = q.shift(); // prende la prima cella

        // guarda tutte le celle vicine aperte
        for (const [nr, nc] of getNeighborsOpen(r, c)) {

            // se non è ancora visitata
            if (dist[nr][nc] === -1) {
                dist[nr][nc] = dist[r][c] + 1; // distanza +1
                q.push([nr, nc]); // aggiunge alla coda
            }
        }
    }
    return dist;
}
function getDeadEnds(excludeSet) { // Trova tutti i vicoli ciechi del labirinto (celle aperte con una sola attiva accanto)
    const dead = [];
    for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
            if (maze[r][c] !== 0) continue; // salta muri

            const key = `${r},${c}`;

            // evita celle escluse (es: start e goal)
            if (excludeSet && excludeSet.has(key)) continue;

            // se ha una sola uscita → vicolo cieco
            if (getNeighborsOpen(r, c).length === 1) dead.push([r, c]);
        }
    }
    return dead;
}
function raycast(x, y, dx, dy, maxLen, minLen = 0) {
    let step = 1;
    let len = minLen;

    while (len < maxLen) {
        const px = x + dx * len,
            py = y + dy * len,

            col = Math.floor(px / cell_size),
            row = Math.floor(py / cell_size);

        if (
            row < 0 || col < 0 ||
            row >= maze.length ||
            col >= maze[row].length
        ) {
            return len;
        }

        if (maze[row][col] === 1) {
            return len;
        }

        len += step;
    }
    return maxLen;
}
function hasLineOfSight(enemy, player) {

    const dx = player.x - enemy.x,
        dy = player.y - enemy.y,
        distToPlayer = Math.hypot(dx, dy);

    if (distToPlayer <= 0.0001) return true;

    const angleToPlayer = Math.atan2(dy, dx);
    let angleDiff = angleToPlayer - enemy.angle;
    angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

    const FOV = 145 * Math.PI / 180;
    if (Math.abs(angleDiff) > FOV / 2) return false;

    const dirX = dx / distToPlayer,
        dirY = dy / distToPlayer,
        minLen = enemy.radius * 0.5;

    // Fascio come il laser: centro + 2 laterali
    const sideOffset = 2; // come laserImpact; puoi alzare a 3-4 se vuoi piu' largo
    const samplePoints = [
        [enemy.x, enemy.y],
        [enemy.x + (-dirY * sideOffset), enemy.y + (dirX * sideOffset)],
        [enemy.x - (-dirY * sideOffset), enemy.y - (dirX * sideOffset)]
    ];

    // Conservativo: prende il primo muro incontrato dal fascio
    let wallDist = Infinity;
    for (const [sx, sy] of samplePoints) {
        const d = raycast(sx, sy, dirX, dirY, distToPlayer, minLen);
        if (d < wallDist) wallDist = d;
    }

    return wallDist >= distToPlayer - 1;
}
function bulletsCollision(cx, cy, radius) { // Collisione cerchio contro il muro e spigoli (per proiettili)
    const startRow = Math.floor((cy - radius) / cell_size),
        endRow = Math.floor((cy + radius) / cell_size),
        startCol = Math.floor((cx - radius) / cell_size),
        endCol = Math.floor((cx + radius) / cell_size);

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {

            if (
                command.bulletCollisionWall &&
                row >= 0 && row < rows &&
                col >= 0 && col < cols &&
                maze[row][col] === 1
            ) {
                // Coordinate rettangolo muro
                const rx = col * cell_size,
                    ry = row * cell_size,

                    closestX = Math.max(rx, Math.min(cx, rx + cell_size)),
                    closestY = Math.max(ry, Math.min(cy, ry + cell_size)),

                    dx = cx - closestX,
                    dy = cy - closestY;

                // Se distanza < raggio allora collide
                if (dx ** 2 + dy ** 2 < radius * radius) {
                    return true;
                }
            }
        }
    }
    return false;
}
function entitiesCollision(entity) { // Collisione cerchio contro muro e spigoli per player

    const radius = entity.radius;

    const startRow = Math.floor((entity.y - radius) / cell_size),
        endRow = Math.floor((entity.y + radius) / cell_size),
        startCol = Math.floor((entity.x - radius) / cell_size),
        endCol = Math.floor((entity.x + radius) / cell_size);

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {

            if (
                row >= 0 && row < rows &&
                col >= 0 && col < cols &&
                maze[row][col] === 1
            ) {
                // Coordinate rettangolo muro
                const rx = col * cell_size,
                    ry = row * cell_size,

                    // Punto più vicino del rettangolo al centro del cerchio
                    closestX = Math.max(rx, Math.min(entity.x, rx + cell_size)),
                    closestY = Math.max(ry, Math.min(entity.y, ry + cell_size)),

                    // Vettore
                    dx = entity.x - closestX,
                    dy = entity.y - closestY;

                const distSq = dx ** 2 + dy ** 2;

                // Se distanza < raggio → collisione
                if (distSq < radius * radius) {

                    // Distanza reale (evita di dividere 0 per 0)
                    const dist = Math.sqrt(distSq) || 0.0001;
                    const overlap = radius - dist; // Compenetrazione cerchio muro

                    // Spinta fuori dal muro
                    entity.x += (dx / dist) * overlap;
                    entity.y += (dy / dist) * overlap;
                }
            }
        }
    }
}
function laserImpact(hitX, hitY, dx, dy) {
    const keys = new Set();
    const sideOffset = 2;
    const samplePoints = [
        [hitX, hitY],
        [hitX + (-dy * sideOffset), hitY + (dx * sideOffset)],
        [hitX - (-dy * sideOffset), hitY - (dx * sideOffset)]
    ];

    for (const [sx, sy] of samplePoints) {
        const col = Math.floor(sx / cell_size);
        const row = Math.floor(sy / cell_size);

        if (
            row >= 0 && row < rows &&
            col >= 0 && col < cols &&
            maze[row][col] === 1
        ) {
            keys.add(`${row},${col}`);
        }
    }

    if (keys.size > 0) {
        return keys;
    }

    const baseCol = Math.floor(hitX / cell_size);
    const baseRow = Math.floor(hitY / cell_size);
    let bestKey = null;
    let bestDist = Infinity;

    for (let row = baseRow - 1; row <= baseRow + 1; row++) {
        for (let col = baseCol - 1; col <= baseCol + 1; col++) {
            if (
                row >= 0 && row < rows &&
                col >= 0 && col < cols &&
                maze[row][col] === 1
            ) {
                const centerX = (col + 0.5) * cell_size;
                const centerY = (row + 0.5) * cell_size;
                const distSq = (centerX - hitX) ** 2 + (centerY - hitY) ** 2;
                if (distSq < bestDist) {
                    bestDist = distSq;
                    bestKey = `${row},${col}`;
                }
            }
        }
    }

    if (bestKey) {
        keys.add(bestKey);
    }

    return keys;
}
function applyLaserCrackback(deltaTime, hitKeysThisFrame) {
    const decayMs = laserCrackbackMsPerSecond * deltaTime;

    for (const [key, acc] of laserHitTime.entries()) {
        if (hitKeysThisFrame.has(key)) {
            continue;
        }

        const next = acc - decayMs;
        if (next <= 0) {
            laserHitTime.delete(key);
        } else {
            laserHitTime.set(key, next);
        }
    }
}
function finalizeLaserFrame(deltaTime, hitKeysThisFrame) {
    applyLaserCrackback(deltaTime, hitKeysThisFrame);
}
function removeLaserBulletsAndStopSound() {
    let removed = false;
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].isLaser) {
            bullets.splice(i, 1);
            removed = true;
        }
    }
    if (removed) stopLaserSound();
}
function startLaserFiring() {
    isHolding = true;

    if (laserBattery > 0) {
        startLaserSound();
        laserShoot();
    } else isHolding = false;
}
function stopLaserFiring() {
    isHolding = false;

    removeLaserBulletsAndStopSound();
    if (isCracking) onPressEnd();
}
function increaseMaxHealth() {
    if (score < (perk.cost.player.health + perk.stats.player.health * 75) || perk.stats.player.health >= 10) return;
    perkSpentScore += perk.cost.player.health + perk.stats.player.health * 75;
    
    perk.stats.player.health++;
    playerStats();
    refreshScore();
    drawPlayerHealth();
}
function increaseStamina() {
    if (score < (perk.cost.player.health + perk.stats.player.stamina * 75) || perk.stats.player.stamina >= 10) return;
    perkSpentScore += perk.cost.player.health + perk.stats.player.stamina * 75;
    perk.stats.player.stamina++;
    playerStats();
    refreshScore();
}
function increasePlayerSpeed() {
    if (score < (perk.cost.player.speed + perk.stats.player.speed * 90) || perk.stats.player.speed >= 5) return;
    perkSpentScore += perk.cost.player.speed + perk.stats.player.speed * 90;
    perk.stats.player.speed++;
    player.speed = 1.2 + (perk.stats.player.speed / 10);
    playerStats();
    refreshScore();
}
function increaseBullets() {
    if (score < (perk.cost.bullets.counter + perk.stats.bullets.counter * 85) || perk.stats.bullets.counter >= 10) return;
    perkSpentScore += perk.cost.bullets.counter + perk.stats.bullets.counter * 85;
    perk.stats.bullets.counter++;
    playerStats();
    refreshScore();
}
function increaseDamage() {
    if (score < perk.cost.bullets.damage || perk.stats.bullets.damage >= 1) return;
    perkSpentScore += perk.cost.bullets.damage;
    perk.stats.bullets.damage++;
    playerStats();
    refreshScore();
}
function increaseBulletsSpeed() {
    if (score < (perk.cost.bullets.speed + perk.stats.bullets.speed * 95) || perk.stats.bullets.speed >= 10) return;
    perkSpentScore += perk.cost.bullets.speed + perk.stats.bullets.speed * 95;
    perk.stats.bullets.speed++;
    bs = 4 + (perk.stats.bullets.speed / 2);
    playerStats();
    refreshScore();
}
function refreshScore() {
    const baseScore = scoreMod * ((scoreKills * 10) + (keyScore * 3));
    score = Math.max(0, baseScore - perkSpentScore);
    scores.textContent = "Score: " + score;
    return score;
}
function paintPerkBar(selector, value, color, baseColorValue) {
    const cells = document.querySelectorAll(`${selector} td.bar`);
    cells.forEach((cell, i) => {
        cell.style.background = i < value ? color : baseColorValue;
    });
}
function syncPlayerHealth() {
    player.maxHealth = 3 + perk.stats.player.health;
    player.health = player.maxHealth - player.hit;
}
function respawnTimerBlock(timer, length = timer) {
    respawnTimer = timer;
    tl = length;
}