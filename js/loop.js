/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function updateBullets(deltaTime) { // Aggiorna i proiettili
    const hitKeysThisFrame = new Set();

    const removeEnemyAt = (index) => {
        const enemyToRemove = enemies[index];
        if (!enemyToRemove) return;
        if (noiseOwner === enemyToRemove) noiseOwner = null;
        enemies.splice(index, 1);
    };

    // Loop invertito per salvaguardare elementi con splice
    for (let i = bullets.length - 1; i >= 0; i--) {

        let b = bullets[i];

        // Il laser va gestito con logica dedicata: non deve usare movimento/collisione dei proiettili normali.
        if (b.isLaser) {
            if (updateLaserBullet(i, b, deltaTime, hitKeysThisFrame)) continue;
        }

        // movimento
        if (!b.isRailgun) {
            b.x += b.dx * b.speed * deltaTime * 60;
            b.y += b.dy * b.speed * deltaTime * 60;
        } else {
            b.life -= deltaTime;

            if (b.life <= 0) {
                bullets.splice(i, 1);
                continue;
            }
        }

        if (
            b.x < 0 ||
            b.x > canvas.width ||
            b.y < 0 ||
            b.y > canvas.height
        ) {
            bullets.splice(i, 1);
            continue;
        }

        // Collisione con muro
        if (bulletsCollision(b.x, b.y, 2)) {
            bullets.splice(i, 1);
            continue;
        }

        let rnd = 2 + Math.random() * 2.2;
        // Collisione con nemici
        for (let j = enemies.length - 1; j >= 0; j--) {

            const enemy = enemies[j];

            if (b.isRailgun) {

                if (!b.canDamage) break;

                // vettore laser
                const lx = b.dx,
                    ly = b.dy,

                    // vettore player -> enemy
                    ex = enemy.x - b.x,
                    ey = enemy.y - b.y,

                    // proiezione del nemico sulla linea
                    t = ex * lx + ey * ly;

                if (t < 0) continue; // dietro al player

                const projX = b.x + lx * t,
                    projY = b.y + ly * t,

                    dx = enemy.x - projX,
                    dy = enemy.y - projY;

                const distSq = dx * dx + dy * dy;

                if (distSq < enemy.radius * enemy.radius) {

                    killSound.playbackRate = rnd;
                    killSound.currentTime = 0;
                    killSound.play();

                    removeEnemyAt(j);
                    totalEnemiesKilled++;
                    scoreKills++
                    enemyRespawnQueue.push(enemyRespawnDelay);
                    refreshScore();

                    b.hit = true; // uccide solo uno
                    b.canDamage = false;
                    break;
                }

            } else {

                const dx = enemy.x - b.x;
                const dy = enemy.y - b.y;

                if (dx * dx + dy * dy < enemy.radius * enemy.radius) {

                    enemy.life -= (1 + perk.stats.bullets.damage);

                    if (enemy.life > 0) {
                        killSound.playbackRate = 12;
                        killSound.currentTime = 0;
                        killSound.play();
                        bullets.splice(i, 1);
                        console.log(enemy.life)
                    } else {
                        killSound.playbackRate = rnd;
                        killSound.currentTime = 0;
                        killSound.play();

                        removeEnemyAt(j);
                        totalEnemiesKilled++;
                        scoreKills++;
                        enemyRespawnQueue.push(enemyRespawnDelay);
                        refreshScore();

                        bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }

        if (b.isRailgun && b.canDamage) {
            // Dopo il primo update il beam resta solo visuale (fade-out), senza danno persistente.
            b.canDamage = false;
        }

    }
    finalizeLaserFrame(deltaTime, hitKeysThisFrame);

    if (railgun.pendingDisable) {
        const hasActiveRailgunBeam = bullets.some(b => b.isRailgun);
        if (!hasActiveRailgunBeam) disablePickupRailgun();
    }
}
function updateLaserBullet(i, b, deltaTime, hitKeysThisFrame) {
    if (!isHolding) {
        if (isCracking) onPressEnd();
        bullets.splice(i, 1);
        return true;
    }

    b.x = player.x;
    b.y = player.y;

    if (wasdonly) {
        b.dx = Math.cos(player.angle);
        b.dy = Math.sin(player.angle);
    } else {
        const dX = mouseX - player.x;
        const dY = mouseY - player.y;
        const len = Math.hypot(dX, dY) || 1;
        b.dx = dX / len;
        b.dy = dY / len;
    }

    maxR1 = 20;
    maxR2 = 4.5;
    b.r1 = Math.min(b.r1 + deltaTime * 500, maxR1);
    b.r2 = Math.min(b.r2 + deltaTime * 250, maxR2);

    const lenToHit = raycast(
        player.x,
        player.y,
        b.dx,
        b.dy,
        2000,
        0
    );
    const probeX = player.x + b.dx * lenToHit,
        probeY = player.y + b.dy * lenToHit,
        probeCol = Math.floor(probeX / cell_size),
        probeRow = Math.floor(probeY / cell_size);

    const hitWall =
        probeRow >= 0 && probeRow < rows &&
        probeCol >= 0 && probeCol < cols &&
        maze[probeRow][probeCol] === 1;

    let hitKeys = new Set();

    if (hitWall) {
        const impactLen = Math.max(0, lenToHit - 1),
            hitX = player.x + b.dx * impactLen,
            hitY = player.y + b.dy * impactLen;

        hitKeys = laserImpact(hitX, hitY, b.dx, b.dy);
    }
    const hasWallHit = hitKeys.size > 0;

    if (hasWallHit) {
        if (!isCracking) onPressStart();
    } else if (isCracking) onPressEnd();

    for (const hitKey of hitKeys) {
        hitKeysThisFrame.add(hitKey);
        const elapsedMs = deltaTime * 1000;
        const acc = (laserHitTime.get(hitKey) || 0) + elapsedMs;
        laserHitTime.set(hitKey, acc);

        if (acc >= laserCellBreakMs) {
            const [rowStr, colStr] = hitKey.split(",");
            const hitRow = Number(rowStr);
            const hitCol = Number(colStr);
            maze[hitRow][hitCol] = 0;
            let prob = Math.random();
            if (prob < 0.15) batteries.push({ row: hitRow, col: hitCol }); // 15% batterie
            else if (prob < 0.35) magazines.push({ row: hitRow, col: hitCol }); // +20% caricatori (0.15 → 0.35)
            else if (prob < 0.45) meds.push({ row: hitRow, col: hitCol }); // 10% medkit (0.35 → 0.45)
            else if (prob < 0.85) enemiesPush(hitRow, hitCol); // +50% nemici (0.45 → 0.95)
            else { }; // 5% nulla (0.95 → 1.00)
            wallSmashSound.currentTime = 0;
            wallSmashSound.play();
            laserHitTime.delete(hitKey);
        }
    }

    return true;
}
function update(currentTime) { // Aggiorna movimento del player ed altro

    // Mette in pausa il gioco fermando la funzione
    if (isPaused) {
        lastTime = performance.now(); // Resetta il tempo
        drawMaze();
        requestAnimationFrame(update);
        return;
    } else {
        PAUSE_MENU.style.display = "none";
        PAUSE_MENU.innerHTML = "";
    }
    const deltaTime = (currentTime - lastTime) / 1000; //Trasforma in secondi
    lastTime = currentTime;

    // Timer invulnerabilità dopo respawn
    if (respawnTimer > 0) {
        respawnTimer -= deltaTime;
        if (respawnTimer < 0) {
            respawnTimerBlock(0);
        }
    }

    // Generazione labirinto
    if (generating) {
        for (let i = 0; i < 10; i++) {
            if (generating) stepGeneration();
        }
        drawMaze();
        requestAnimationFrame(update);
        return;
    }

    let lastPosX = player.x;
    let lastPosY = player.y;

    playerMovement(deltaTime);

    let isMoving = (player.x !== lastPosX || player.y !== lastPosY); // Controlla se la posizione del player cambia

    // Controllo della stamina e se la posizione del player non cambia (collisione), allora la stamina non viene consumata.
    if (!command.unlimitedStamina) {
        if (isRunning && isMoving && stamina.length > 0) {
            stamina.length -= ((30 - (perk.stats.player.stamina * 10) / 5) / 100) * deltaTime;
            if (stamina.length <= 0.001) isRunning = false;
        }
        else if (!isRunning) stamina.length += 0.2 * deltaTime;
        stamina.length = Math.max(0, Math.min(1, stamina.length));
    }

    if (stamina.length < 0.999 && isRunning) stamina.alpha += 10 * deltaTime;
    else if (stamina.length >= 0.999 && isRunning === false) stamina.alpha -= 6 * deltaTime;
    stamina.alpha = Math.max(0, Math.min(1, stamina.alpha));

    if (!command.noClip) entitiesCollision(player);

    // Trail
    let R = player.x - lastFootX;
    let L = player.y - lastFootY;
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    let dist = Math.sqrt(R ** 2 + L ** 2);
    let rnd = Math.random() * 1.3 + 1;
    let stepDistance = (footStepDistance * (perk.stats.player.speed / 10 + 1)) * (isRunning ? runMultiplier : 1);
    if (dist > stepDistance) {
        trail.push({
            x: player.x + Math.cos(player.angle + Math.PI / 2) * 3 * footSide,
            y: player.y + Math.sin(player.angle + Math.PI / 2) * 3 * footSide,
            angle: player.angle,
            life: 120,
            side: footSide
        })
        steps.currentTime = 0;
        steps.playbackRate = isRunning ? rnd + 0.8 : rnd;
        steps.volume = 0.3;
        steps.play();

        lastFootX = player.x;
        lastFootY = player.y;

        footSide *= -1; // Alterna lato
    }

    // Posizione player in grid
    let playerRow = Math.floor(player.y / cell_size);
    let playerCol = Math.floor(player.x / cell_size);

    if (playerRow !== stablePlayerCell.row || playerCol !== stablePlayerCell.col) {
        stablePlayerCell.row = playerRow;
        stablePlayerCell.col = playerCol;
    }

    // Attivazione nemici
    if (!enemiesActivated && !(playerRow === cellRowRandom && playerCol === cellColRandom)) enemiesActivated = true;

    // Raccolta pickup
    for (let i = pickup.length - 1; i >= 0; i--) {
        if (pickup[i].row === playerRow && pickup[i].col === playerCol) {
            pickupSound.currentTime = 0;
            pickupSound.play();
            pickup.splice(i, 1);
            pickupRemaining--;
            totalPickupsCollected++;
            keyScore++;
            refreshScore();

            // Se non ci sono pi� chiavi allora attivaa il goal
            if (pickupRemaining <= 0) {
                goalActive = true;
            }
            break;
        }
    }

    // Raccolta caricatori
    for (let i = magazines.length - 1; i >= 0; i--) {
        if (magazines[i].row === playerRow && magazines[i].col === playerCol) {
            magPickupSound.currentTime = 0;
            magPickupSound.playbackRate = 2;
            magPickupSound.play();
            magazines.splice(i, 1);
            magazine++;
            if (bulletsMag <= 0 && !railgun.activeByPickup) reload();
        }
    }

    // Raccolta Batterie
    for (let i = batteries.length - 1; i >= 0; i--) {
        if (batteries[i].row === playerRow && batteries[i].col === playerCol) {
            batteryPickupSound.currentTime = 0;
            batteryPickupSound.playbackRate = 1;
            batteryPickupSound.play();
            batteries.splice(i, 1);
            laserBattery = 100;
        }
    }

    // Raccolta Meds
    for (let i = meds.length - 1; i >= 0; i--) {
        if (meds[i].row === playerRow && meds[i].col === playerCol) {
            medSound.currentTime = 0;
            medSound.playbackRate = 1.5;
            medSound.play();
            meds.splice(i, 1);
            player.hit--;
        }
    }

    // Raccolta railgun
    if (
        railgun.pickup &&
        railgun.pickup.row === playerRow &&
        railgun.pickup.col === playerCol
    ) {
        pickupSound.currentTime = 0;
        pickupSound.playbackRate = 0.9;
        pickupSound.play();
        pickupSound.playbackRate = 1;
        modeIndex = 2;

        railgun.pickup = null;
        railgun.activeByPickup = true;
        railgun.shotsLeft = railgun.maxShots;
        railgun.pendingDisable = false;
        railgun.nextSpawnLevel = levels + railgun.cooldownLevels;
        railgun.prevBulletCollisionWall = command.bulletCollisionWall;

        command.railgunMode = true;
        command.bulletCollisionWall = false;
        syncWeaponProfile();
    }

    // Se player xy su goal allora rigenera il maze
    if (goalActive && playerRow === goal.row && playerCol === goal.col) {
        const s = goalSounds[Math.floor(Math.random() * goalSounds.length)];
        s.currentTime = 0;
        s.play();
        levels++
        generateMaze();
    }

    // Gestione ricarica
    if (isReloading) {
        reloadTimer -= deltaTime;

        if (reloadTimer <= 0) {
            bulletsMag = magSize + perk.stats.bullets.counter;
            isReloading = false;
        }
    }

    // UI counters
    pickupCounterEl.textContent = "Keys: " + totalPickupsCollected + "/" + totalKeys;
    lvl.textContent = "Level: " + levels;
    if (modeIndex === 2) {
        ammo.textContent = "[Ammo: RG " + railgun.shotsLeft + "]";
    } else if (modeIndex === 1) {
        ammo.textContent = "[Laser Mode"
    } else {
        ammo.textContent = "[Ammo: " + bulletsMag;
    }
    if (modeIndex === 2) {
        mag.textContent = "";
        battery.style.display = "none";
        batteryContainer.style.display = "none"
    } else if (modeIndex === 1) {
        mag.textContent = "]";
        batteryContainer.style.display = "flex";
        batteryContainerSpan.textContent = Math.trunc(laserBattery) + "%";
        battery.style.display = "inline-block";
        battery.style.width = `${laserBattery}px`;
    } else {
        battery.style.display = "none";
        batteryContainer.style.display = "none";
        mag.textContent = "Mag: " + magazine + "]";
    }
    if (noiseEvent) {
        noiseEvent.timer -= deltaTime;
        if (noiseEvent.timer <= 0) {
            noiseEvent = null;
        }
    }

    // Gestisce il respawn dei nemici con il timer
    for (let i = enemyRespawnQueue.length - 1; i >= 0; i--) {
        enemyRespawnQueue[i] -= deltaTime;

        if (enemyRespawnQueue[i] <= 0) {
            if (!command.peacefulMode) spawnOneEnemy();
            enemyRespawnQueue.splice(i, 1);
        }
    }

    // Updates
    updateBullets(deltaTime);
    if (isHolding) {
        laserBattery -= 10 * deltaTime;
        if (laserBattery <= 0) {
            laserBattery = 0;
            stopLaserFiring();
        }
    }
    syncPlayerHealth();
    const t = 1 - Math.exp(-14 * deltaTime);
    player.displayH += (player.health - player.displayH) * t;
    if (Math.abs(player.health - player.displayH) < 0.001) player.displayH = player.health;
    updateEnemies(deltaTime);
    drawMaze();

    animationId = requestAnimationFrame(update);
}
requestAnimationFrame(update)