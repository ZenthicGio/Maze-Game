/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

gameCanvas.addEventListener("contextmenu", function (e) {
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > gameCanvas.width || y < 0 || y > gameCanvas.height) return;
    e.preventDefault();
});
let isPauseMenu = false;
let isStatsMenu = false;
let isInventoryMenu = false;
document.addEventListener("keydown", e => {

    if (e.repeat) return;
    const isPauseKey = e.code === "KeyP" || e.code === "Escape";
    const cKey = e.code === "KeyC";
    const iKey = e.code === "KeyI";
    if (isConsoleOn) {
        if (e.code === "Escape") {
            resume();
            isConsoleOn = false;
            cmd.hidden = true;
            return;
        }
        if (e.code !== "Enter") return;
    }
    if (iKey && !isMainMenu && !isPauseMenu) {
        if (isInventoryMenu) {
            resume();
            return;
        }

        // Switch Stats -> Inventory
        isStatsMenu = false;
        playerStatsBool = false;

        isInventory = true;
        isInventoryMenu = true;
        isPaused = true;
        playerInventory();
        return;
    }

    if (cKey && !isMainMenu && !isPauseMenu) {
        if (isStatsMenu) {
            resume();
            return;
        }

        // Switch Inventory -> Stats
        isInventory = false;
        isInventoryMenu = false;

        playerStatsBool = true;
        isStatsMenu = true;
        isPaused = true;
        playerStats();
        return;
    }

    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (command.unlimitedStamina || stamina.length > 0.001) isRunning = true;
        else isRunning = false;
    };

    if (isPauseKey && !isConsoleOn) { // Keydown per la pausa del gioco (p, P o Esc)
        if (isStatsMenu) {
            resume();
            return;
        }
        if (isInventoryMenu) {
            resume();
            return;
        }
        if (isMainMenu) {
        } else {
            isPauseMenu = !isPauseMenu;
            isPaused = !isPaused;
            isRunning = false;
            if (isHolding) stopLaserFiring();
            keys[e.code] = false;
            if (isPaused) pauseMenu();
            playerStatsBool = false;
            isInventory = false
            return;
        }
    }

    if (e.code === "Backquote") {
        e.preventDefault();
        if (!isPaused) {
            isPaused = true;
            isConsoleOn = true;
        } else if (isPaused && !isConsoleOn) {
            isConsoleOn = true;
        } else {
            resume();
            isConsoleOn = false;
        }
        if (isConsoleOn) {
            cmd.hidden = false;
            cmd.focus();
        } else cmd.hidden = true;
    }

    if (e.code === "Enter") {
        if (isConsoleOn) {
            resume();
            isConsoleOn = false;
            const psc = { ...command };
            commands();
            for (let i in command) {
                if (command[i] !== psc[i]) {
                }
            }
            cmd.value = "";
            cmd.hidden = true;
        }
    }

    if (wasdonly) {
        if (e.code === "KeyR") {
            if (isHolding) stopLaserFiring();
            if (modeIndex === 0) modeIndex = 1;
            else if (modeIndex === 1) modeIndex = command.railgunMode && railgun.shotsLeft > 0 ? 2 : 0;
            else if (modeIndex === 2) modeIndex = 1;
            syncWeaponProfile();
            return;
        }
    }

    keys[e.code] = true;

    if (e.code === "Space" && canShoot && wasdonly) {
        if (isPaused) canShoot = false;
        else {
            const mode = modes[modeIndex];
            if (mode === "pistol" || mode === "railgun") {
                canShoot = false;
                shoot();
            } else if (mode === "laser") {
                if (laserBattery > 0) {
                    startLaserFiring()
                } else if (laserBattery <= 0) {
                    stopLaserFiring()
                }
            }
        }
    }
});
document.addEventListener("keyup", e => {
    keys[e.code] = false;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        isRunning = !!(keys["ShiftLeft"] || keys["ShiftRight"]);
    }
    if (e.code === "Space" && wasdonly) {
        canShoot = true;
        if (isHolding) stopLaserFiring();
        else isHolding = false;
    }
});
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        isPaused = true;
        isRunning = false;
        if (isHolding) stopLaserFiring();
        keys = {};
        if (!isMainMenu) pauseMenu();
    }
});
gameCanvas.addEventListener("mousedown", e => {
    // Click LMB = 0
    // Click MMB = 1
    // Click RMB = 2
    if (isConsoleOn) return;

    if (e.button === 2) {
        if (wasddirectionmouseaim || mousedirection) {
            if (isHolding) stopLaserFiring();
            if (modeIndex === 0) modeIndex = 1;
            else if (modeIndex === 1) modeIndex = command.railgunMode && railgun.shotsLeft > 0 ? 2 : 0;
            else if (modeIndex === 2) modeIndex = 1;
            syncWeaponProfile();
            return;
        }
    }

    const mode = modes[modeIndex];
    if (e.button === 0 && (wasddirectionmouseaim || mousedirection) && canShoot) { // Click sinistro per sparare
        if (isPaused) canShoot = false;
        else {
            if (mode === "laser") {
                if (laserBattery > 0) {
                    startLaserFiring()
                } else if (laserBattery <= 0 && isHolding) {
                    stopLaserFiring()
                }
            } else {
                canShoot = false;
                shoot();
            }
        }
    }
});
document.addEventListener("mouseup", e => {
    if (isConsoleOn) return;

    if (e.button === 0 && (wasddirectionmouseaim || mousedirection)) {
        canShoot = true;
        if (isHolding) stopLaserFiring();
        else isHolding = false;
    }
});
function commands() {

    const r = command.railgunMode;
    const b = command.bulletCollisionWall;

    switch (cmd.value) {
        case "IAmAGhost":
            command.noClip = !command.noClip;
            break;

        case "IsThereAnyoneHere?":
            enemies = [];
            command.peacefulMode = true;
            break

        case "HuntModeOn":
            if (command.peacefulMode) {
                command.peacefulMode = false;
                spawnEnemies(levelEnemyCount);
            }
            break;

        case "PuffWhoSawIt":
            if (command.railgunMode) {
                disablePickupRailgun();
            } else {
                railgun.prevBulletCollisionWall = command.bulletCollisionWall;
                command.railgunMode = true;
                command.bulletCollisionWall = false;
                railgun.activeByPickup = true;
                railgun.shotsLeft = railgun.maxShots;
                railgun.pendingDisable = false;
                modeIndex = 2;
                syncWeaponProfile();
            }
            break;

        case "GhostBullets":
            command.bulletCollisionWall = !command.bulletCollisionWall;
            break;

        case "YouCantSeeMe":
            command.invisibleMode = !command.invisibleMode;

            if (command.invisibleMode) {
                // reset AI: smettono di inseguire immediatamente
                for (const enemy of enemies) {
                    enemy.state = "wander";
                    enemy.target = null;
                    enemy.currentCellTarget = null;
                    enemy.wanderTarget = null;
                    enemy.memoryTimer = 0;
                    enemy.lastTarget = null;
                    enemy.cachedDist = null;
                    enemy.color = enemy.colors.none;
                    enemy.speed = diff_speed;
                }
                noiseEvent = null;
                noiseOwner = null;
            }
            break;

        case "RunBitchRUN!":
            command.unlimitedStamina = !command.unlimitedStamina;
            break;

        case "NoNoSquare":
            command.immortal = !command.immortal;
            break;

        case "GimmieIt":
            if (bulletsMag <= 0 && magazine <= 0) bulletsMag = 8;
            else if (bulletsMag > 0) magazine++;
            break;

        case "AMMO!AMMO!AMMO!":
            command.infinityBullets = !command.infinityBullets;
            if (command.infinityBullets) bulletsMag = Infinity;
            else bulletsMag = 8;
            break;
        case "ImNotANoob":
            command.noClip = false; // ok
            command.peacefulMode = false; // ok
            command.bulletCollisionWall = true; //ok
            command.invisibleMode = false; // ok
            command.unlimitedStamina = false; //ok
            command.immortal = false; // ok
            command.railgunMode = false; // ok
            command.infinityBullets = false; // ok
            railgun.activeByPickup = false;
            railgun.shotsLeft = 0;
            railgun.pendingDisable = false;
            syncWeaponProfile();
            break;
    }
}
function resetInputState() {
    if (isHolding) stopLaserFiring();
    keys = {};
    isRunning = false;
    canShoot = true;
}
window.addEventListener("blur", resetInputState);