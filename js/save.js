/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

const SAVE_SLOT_FILES = {
    1: "save_0.save",
    2: "save_1.save",
    3: "save_2.save"
};

const LEGACY_SAVE_SLOT_FILES = {
    1: "save_0.json",
    2: "save_1.json",
    3: "save_2.json"
};

const SAVE_FILE_MAGIC = "MGSV1";
const SAVE_KDF_ITERS = 200000;
// Cambiala una volta sola: se la cambi dopo, i vecchi save cifrati non saranno piu' leggibili.
const SAVE_SECRET = "MazeGame::LocalSaveKey::v1";

const te = new TextEncoder();
const td = new TextDecoder();

function bytesToB64(bytes) {
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
}
function b64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}
async function deriveSaveKey(salt) {
    if (!globalThis.crypto?.subtle) {
        throw new Error("WebCrypto non disponibile");
    }

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        te.encode(SAVE_SECRET),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: SAVE_KDF_ITERS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}
async function encodeSavePayload(plainJson) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveSaveKey(salt);

    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        te.encode(plainJson)
    );

    const cipher = new Uint8Array(cipherBuffer);
    return [
        SAVE_FILE_MAGIC,
        bytesToB64(salt),
        bytesToB64(iv),
        bytesToB64(cipher)
    ].join(".");
}
async function decodeSavePayload(rawText) {
    const text = String(rawText ?? "").trim();

    // Compatibilita' retroattiva: vecchi .json in chiaro
    if (!text.startsWith(`${SAVE_FILE_MAGIC}.`)) {
        return text;
    }

    const parts = text.split(".");
    if (parts.length !== 4) {
        throw new Error("Formato save criptato non valido");
    }

    const salt = b64ToBytes(parts[1]);
    const iv = b64ToBytes(parts[2]);
    const cipher = b64ToBytes(parts[3]);

    const key = await deriveSaveKey(salt);
    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipher
    );

    return td.decode(plainBuffer);
}
async function fileExists(path) {
    try {
        await Neutralino.filesystem.getStats(path);
        return true;
    } catch (_) {
        return false;
    }
}
function getSavedFilename(slotNumber) {
    return SAVE_SLOT_FILES[slotNumber] ?? "save_0.save";
}
function getLegacySavedFilename(slotNumber) {
    return LEGACY_SAVE_SLOT_FILES[slotNumber] ?? "save_0.json";
}
async function resolveSlotFilenameForLoad(slotNumber) {
    const datFile = getSavedFilename(slotNumber);
    if (!isNeutralinoRuntime()) return datFile;

    const datPath = await getSavePath(datFile);
    if (await fileExists(datPath)) return datFile;

    const legacyFile = getLegacySavedFilename(slotNumber);
    const legacyPath = await getSavePath(legacyFile);
    if (await fileExists(legacyPath)) return legacyFile;

    return datFile;
}
async function saveGame(filename = "save_0.save") {
    await saveData(filename);
}
async function saveData(filename) {
    const walls = [];
    const paths = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (maze[r][c] === 1) walls.push({ row: r, col: c });
            else paths.push({ row: r, col: c });
        }
    }

    const score = scoreMod * ((scoreKills * 10) + (keyScore * 3));
    const remainingKeySet = new Set(pickup.map(p => `${p.row},${p.col}`));
    const baseKeys = (initialPickups && initialPickups.length > 0) ? initialPickups : pickup;

    const data = {
        meta: {
            disclaimer: "Do not modify this file. Manual edits can break compatibility and corrupt progress.",
            warning: "Manual editing is not supported.",
            format: "Maze Game Save Data",
            version: SAVE_VERSION
        },

        rows,
        cols,
        start: { row: cellRowRandom, col: cellColRandom },
        goal: { row: goal.row, col: goal.col },
        walls,
        paths,

        controls: {
            wasdonly,
            mousedirection,
            wasddirectionmouseaim,
            movementSelected
        },

        stats: {
            score,
            levels,
            totalKeys,
            totalPickupsCollected,
            keyScore,
            totalEnemiesKilled,
            totalDeads,
            totalShots,
            scoreMod,
            scoreKills,
            perkSpentScore
        },

        combat: {
            magazine,
            bulletsMag,
            laserBattery,
            modeIndex,
            isReloading,
            reloadTime,
            railgun: {
                pickup: railgun.pickup ? { row: railgun.pickup.row, col: railgun.pickup.col } : null,
                activeByPickup: railgun.activeByPickup,
                shotsLeft: railgun.shotsLeft,
                pendingDisable: railgun.pendingDisable,
                nextSpawnLevel: railgun.nextSpawnLevel,
                prevBulletCollisionWall: railgun.prevBulletCollisionWall
            }
        },

        difficulty: {
            diff_speed,
            diff_enemy_num,
            md,
            enemyRespawnDelay,
            reloadTime,
            safe,
            railgun: {
                cooldownLevels: railgun.cooldownLevels,
                maxShots: railgun.maxShots
            },
            perkCost: {
                player: {
                    health: perk.cost.player.health,
                    stamina: perk.cost.player.stamina,
                    speed: perk.cost.player.speed
                },
                bullets: {
                    counter: perk.cost.bullets.counter,
                    damage: perk.cost.bullets.damage,
                    speed: perk.cost.bullets.speed
                }
            }
        },

        pickups: {
            keys: baseKeys.map(k => ({
                row: k.row,
                col: k.col,
                picked: !remainingKeySet.has(`${k.row},${k.col}`)
            })),
            pickupRemaining,
            magazines: magazines.map(m => ({ row: m.row, col: m.col })),
            batteries: batteries.map(b => ({ row: b.row, col: b.col })),
            meds: meds.map(m => ({ row: m.row, col: m.col }))
        },

        enemiesState: {
            count: enemies.length,
            enemyRespawnQueue: Array.isArray(enemyRespawnQueue) ? [...enemyRespawnQueue] : [],
            enemiesActivated,
            enemies: enemies.map(e => ({
                x: e.x,
                y: e.y,
                radius: e.radius,
                speed: e.speed,
                angle: e.angle,
                state: e.state,
                target: e.target ? { row: e.target.row, col: e.target.col } : null,
                wanderTarget: e.wanderTarget ? { row: e.wanderTarget.row, col: e.wanderTarget.col } : null,
                memoryTimer: e.memoryTimer ?? 0,
                memoryDuration: e.memoryDuration ?? md,
                investigateTimer: e.investigateTimer ?? 0,
                scanBaseAngle: e.scanBaseAngle ?? 0,
                scanTime: e.scanTime ?? 0,
                color: e.color ?? "",
                life: e.life ?? 0
            }))
        },

        playerState: {
            x: player.x,
            y: player.y,
            angle: player.angle,
            speed: player.speed,
            hit: player.hit,
            maxHealth: player.maxHealth
        },

        perk: {
            health: perk.stats.player.health,
            stamina: perk.stats.player.stamina,
            speed: perk.stats.player.speed,
            bullets: perk.stats.bullets.counter,
            damage: perk.stats.bullets.damage,
            bulletsSpeed: perk.stats.bullets.speed,
        },

        goalState: {
            active: goalActive
        }
    };

    const plainJson = JSON.stringify(data, null, 2);
    const payload = await encodeSavePayload(plainJson);

    // Neutralino runtime (EXE): salva in Documents\Maze Game\saves
    if (isNeutralinoRuntime()) {
        return await saveDataNeutralino(payload, filename);
    }

    // Browser runtime (debug): download file
    return await saveDataBrowser(payload, filename);
}
function isNeutralinoRuntime() {
    return typeof Neutralino !== "undefined" && Neutralino.filesystem && Neutralino.os;
}
async function saveDataNeutralino(content, filename) {
    const documentsDir = await Neutralino.os.getPath("documents");
    const gameDir = `${documentsDir}\\Maze Game`;
    const saveDir = `${gameDir}\\saves`;

    try { await Neutralino.filesystem.createDirectory(gameDir); } catch (_) { }
    try { await Neutralino.filesystem.createDirectory(saveDir); } catch (_) { }

    const fullPath = `${saveDir}\\${filename}`;
    await Neutralino.filesystem.writeFile(fullPath, content);
    return fullPath;
}
async function saveDataBrowser(content, filename) {
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return filename;
}
async function loadGame(filename = null) {
    let data = null;

    if (filename && isNeutralinoRuntime()) {
        const filePath = await getSavePath(filename);
        data = await loadData(filePath);
    } else {
        data = await loadData();
    }

    if (data) startLoadedGame();
    return data;
}
async function loadData(filePath = null) {
    function pickSaveFileBrowser() {
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".save,.json,application/octet-stream,application/json";
            input.onchange = () => resolve(input.files && input.files[0] ? input.files[0] : null);
            input.click();
        });
    }

    let rawText = "";

    if (typeof Neutralino !== "undefined" && Neutralino.filesystem && Neutralino.os) {
        if (!filePath) {
            const selected = await Neutralino.os.showOpenDialog("Apri save", {
                multiSelections: false,
                filters: [{ name: "Save", extensions: ["save", "json"] }]
            });
            if (!selected || selected.length === 0) return null;
            filePath = selected[0];
        }
        rawText = await Neutralino.filesystem.readFile(filePath);
    } else {
        const file = await pickSaveFileBrowser();
        if (!file) return null;
        rawText = await file.text();
    }

    let data = null;
    try {
        const plainJson = await decodeSavePayload(rawText);
        data = JSON.parse(plainJson);
    } catch (_) {
        alert("Save non valido o corrotto.");
        return null;
    }

    const loadedVersion = data?.meta?.version ?? "unknown";
    if (loadedVersion !== SAVE_VERSION) {
        const proceed = confirm(
            `Warning: saved game version is ${loadedVersion}.\n` +
            `The game is running with ${SAVE_VERSION},\n` +
            `Loading may cause issues.`
        );

        if (!proceed) return null;
    }

    applyData(data);
    return data;
}
function applyData(data) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            maze[r][c] = 1;
        }
    }

    if (Array.isArray(data.paths)) {
        for (const p of data.paths) {
            if (p.row >= 0 && p.row < rows && p.col >= 0 && p.col < cols) {
                maze[p.row][p.col] = 0;
            }
        }
    }

    if (Array.isArray(data.walls)) {
        for (const w of data.walls) {
            if (w.row >= 0 && w.row < rows && w.col >= 0 && w.col < cols) {
                maze[w.row][w.col] = 1;
            }
        }
    }

    if (data.start) {
        cellRowRandom = data.start.row;
        cellColRandom = data.start.col;
        player.x = cellColRandom * cell_size + cell_size / 2;
        player.y = cellRowRandom * cell_size + cell_size / 2;
    }

    if (data.playerState) {
        player.x = data.playerState.x ?? player.x;
        player.y = data.playerState.y ?? player.y;
        player.angle = data.playerState.angle ?? player.angle;
        player.speed = data.playerState.speed ?? player.speed;
        player.hit = data.playerState.hit ?? player.hit;
        player.maxHealth = data.playerState.maxHealth ?? player.maxHealth;
    }

    // Clamp player dentro canvas
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // Fondamentale: riallinea la cella stabile al player appena caricato
    stablePlayerCell = {
        row: Math.floor(player.y / cell_size),
        col: Math.floor(player.x / cell_size)
    };

    if (data.goal) {
        goal.row = data.goal.row;
        goal.col = data.goal.col;
    }

    if (data.controls) {
        wasdonly = !!data.controls.wasdonly;
        mousedirection = !!data.controls.mousedirection;
        wasddirectionmouseaim = !!data.controls.wasddirectionmouseaim;
        movementSelected = !!data.controls.movementSelected;

        if (wasdonly) setMovement("wasdonly");
        else if (mousedirection) setMovement("mousedirection");
        else if (wasddirectionmouseaim) setMovement("wasddirectionmouseaim");
    }

    if (data.stats) {
        levels = data.stats.levels ?? levels;
        totalKeys = data.stats.totalKeys ?? totalKeys;
        totalPickupsCollected = data.stats.totalPickupsCollected ?? totalPickupsCollected;
        keyScore = data.stats.keyScore ?? keyScore;
        totalEnemiesKilled = data.stats.totalEnemiesKilled ?? totalEnemiesKilled;
        totalDeads = data.stats.totalDeads ?? totalDeads;
        totalShots = data.stats.totalShots ?? totalShots;
        scoreMod = data.stats.scoreMod ?? scoreMod;
        scoreKills = data.stats.scoreKills ?? scoreKills;
        perkSpentScore = data.stats.perkSpentScore ?? perkSpentScore;
    }

    if (data.difficulty) {
    diff_speed = data.difficulty.diff_speed ?? diff_speed;
    diff_enemy_num = data.difficulty.diff_enemy_num ?? diff_enemy_num;
    md = data.difficulty.md ?? md;
    enemyRespawnDelay = data.difficulty.enemyRespawnDelay ?? enemyRespawnDelay;
    reloadTime = data.difficulty.reloadTime ?? reloadTime;
    safe = data.difficulty.safe ?? safe;

    if (data.difficulty.railgun) {
        railgun.cooldownLevels =
            data.difficulty.railgun.cooldownLevels ?? railgun.cooldownLevels;
        railgun.maxShots =
            data.difficulty.railgun.maxShots ?? railgun.maxShots;
    }

    if (data.difficulty.perkCost) {
        if (data.difficulty.perkCost.player) {
            perk.cost.player.health =
                data.difficulty.perkCost.player.health ?? perk.cost.player.health;
            perk.cost.player.stamina =
                data.difficulty.perkCost.player.stamina ?? perk.cost.player.stamina;
            perk.cost.player.speed =
                data.difficulty.perkCost.player.speed ?? perk.cost.player.speed;
        }

        if (data.difficulty.perkCost.bullets) {
            perk.cost.bullets.counter =
                data.difficulty.perkCost.bullets.counter ?? perk.cost.bullets.counter;
            perk.cost.bullets.damage =
                data.difficulty.perkCost.bullets.damage ?? perk.cost.bullets.damage;
            perk.cost.bullets.speed =
                data.difficulty.perkCost.bullets.speed ?? perk.cost.bullets.speed;
        }
    }
}

    if (data.perk) {
        perk.stats.player.health = data.perk.health ?? perk.stats.player.health;
        perk.stats.player.stamina = data.perk.stamina ?? perk.stats.player.stamina;
        perk.stats.player.speed = data.perk.speed ?? perk.stats.player.speed;
        perk.stats.bullets.counter = data.perk.bullets ?? perk.stats.bullets.counter;
        perk.stats.bullets.damage = data.perk.damage ?? perk.stats.bullets.damage;
        perk.stats.bullets.speed = data.perk.bulletsSpeed ?? perk.stats.bullets.speed;
    }

    if (data.combat) {
    magazine = data.combat.magazine ?? magazine;
    bulletsMag = data.combat.bulletsMag ?? bulletsMag;
    laserBattery = data.combat.laserBattery ?? laserBattery;
    modeIndex = data.combat.modeIndex ?? modeIndex;

    if (data.combat.railgun) {
        railgun.pickup = data.combat.railgun.pickup
            ? { row: data.combat.railgun.pickup.row, col: data.combat.railgun.pickup.col }
            : null;
        railgun.activeByPickup = data.combat.railgun.activeByPickup ?? railgun.activeByPickup;
        railgun.shotsLeft = data.combat.railgun.shotsLeft ?? railgun.shotsLeft;
        railgun.pendingDisable = data.combat.railgun.pendingDisable ?? railgun.pendingDisable;
        railgun.nextSpawnLevel = data.combat.railgun.nextSpawnLevel ?? railgun.nextSpawnLevel;
        railgun.prevBulletCollisionWall = data.combat.railgun.prevBulletCollisionWall ?? railgun.prevBulletCollisionWall;
    }
}

    if (data.pickups) {
        if (Array.isArray(data.pickups.keys)) {
            initialPickups = data.pickups.keys.map(k => ({ row: k.row, col: k.col }));
            pickup = data.pickups.keys
                .filter(k => !k.picked)
                .map(k => ({ row: k.row, col: k.col }));
        } else {
            pickup = [];
            initialPickups = [];
        }

        pickupRemaining = data.pickups.pickupRemaining ?? pickup.length;
        magazines = Array.isArray(data.pickups.magazines)
            ? data.pickups.magazines.map(m => ({ row: m.row, col: m.col }))
            : [];
        batteries = Array.isArray(data.pickups.batteries)
            ? data.pickups.batteries.map(b => ({ row: b.row, col: b.col }))
            : [];
        meds = Array.isArray(data.pickups.meds)
            ? data.pickups.meds.map(m => ({ row: m.row, col: m.col }))
            : [];
    }

    if (data.enemiesState && Array.isArray(data.enemiesState.enemies)) {
        enemyRespawnQueue = Array.isArray(data.enemiesState.enemyRespawnQueue)
            ? data.enemiesState.enemyRespawnQueue.map(v => Number(v) || 0)
            : [];

        enemiesActivated = !!data.enemiesState.enemiesActivated;

        enemies = data.enemiesState.enemies.map(e => {
            const ex = Number(e.x);
            const ey = Number(e.y);

            // fallback compatibilita' save vecchi con row/col
            const rawX = Number.isFinite(ex) ? ex : ((e.col ?? 1) * cell_size + cell_size / 2);
            const rawY = Number.isFinite(ey) ? ey : ((e.row ?? 1) * cell_size + cell_size / 2);

            const radius = Number(e.radius) || player.radius;

            // clamp dentro canvas
            const clampedX = Math.max(radius, Math.min(canvas.width - radius, rawX));
            const clampedY = Math.max(radius, Math.min(canvas.height - radius, rawY));

            const validTarget =
                e.target &&
                Number.isInteger(e.target.row) &&
                Number.isInteger(e.target.col);

            let state = e.state ?? "wander";
            if ((state === "investigate" || state === "search" || state === "chase") && !validTarget) {
                state = "wander";
            }

            const row = Math.floor(clampedY / cell_size);
            const col = Math.floor(clampedX / cell_size);

            return {
                x: clampedX,
                y: clampedY,
                radius: radius,
                speed: e.speed ?? diff_speed,
                angle: e.angle ?? 0,
                state: state,
                target: validTarget ? { row: e.target.row, col: e.target.col } : null,
                wanderTarget: e.wanderTarget ? { row: e.wanderTarget.row, col: e.wanderTarget.col } : null,
                memoryTimer: e.memoryTimer ?? 0,
                memoryDuration: e.memoryDuration ?? md,
                investigateTimer: e.investigateTimer ?? 0,
                scanBaseAngle: e.scanBaseAngle ?? (e.angle ?? 0),
                scanTime: e.scanTime ?? 0,
                colors: {
                    none: "rgba(0, 0, 0, 0)",
                    yellow: "rgba(255, 255, 0, 1)",
                    orange: "rgba(255, 128, 0, 1)",
                    red: "rgba(255, 0, 0, 1)"
                },
                color: e.color ?? "",
                currentCellTarget: null, // reset cache runtime pathfinding
                cachedDist: null,        // reset cache runtime pathfinding
                lastTarget: null,        // reset cache runtime pathfinding
                lastCell: [row, col],
                life: e.life
            };
        });
        const savedCount = Number(data.enemiesState.count);
        levelEnemyCount = Number.isFinite(savedCount)
            ? Math.max(0, Math.floor(savedCount))
            : enemies.length;
    } else {
        enemyRespawnQueue = [];
        enemiesActivated = false;
        enemies = [];
        levelEnemyCount = 0;
    }

    if (data.goalState) {
        goalActive = !!data.goalState.active;
    }
    if (pickupRemaining > 0) goalActive = false;
    if (pickupRemaining <= 0) goalActive = true;

    // reset runtime transient
    generating = false;
    bullets = [];
    noiseEvent = null;
    noiseOwner = null;

    // HUD
    refreshScore();
    pickupCounterEl.textContent = "Keys: " + totalPickupsCollected + "/" + totalKeys;
    lvl.textContent = "Level: " + levels;

}
async function getSavePath(filename) {
    const documentDir = await Neutralino.os.getPath("documents");
    const gameDir = `${documentDir}\\Maze Game`;
    const saveDir = `${gameDir}\\saves`;
    return `${saveDir}\\${filename}`;
}
async function saveGameInSlot(slotNumber) {
    const filename = getSavedFilename(slotNumber);
    return await saveGame(filename);
}
async function loadSavedGame(slotNumber) {
    const filename = await resolveSlotFilenameForLoad(slotNumber);
    return await loadGame(filename);
}
async function isSlotEmpty(slotNumber) {
    if (!isNeutralinoRuntime()) return true;

    const datPath = await getSavePath(getSavedFilename(slotNumber));
    if (await fileExists(datPath)) return false;

    const legacyPath = await getSavePath(getLegacySavedFilename(slotNumber));
    if (await fileExists(legacyPath)) return false;

    return true;
}
async function deleteSavedGame(slotNumber) {
    if (!isNeutralinoRuntime()) return false;

    const datPath = await getSavePath(getSavedFilename(slotNumber));
    const legacyPath = await getSavePath(getLegacySavedFilename(slotNumber));

    let deleted = false;
    try { await Neutralino.filesystem.remove(datPath); deleted = true; } catch (_) { }
    try { await Neutralino.filesystem.remove(legacyPath); deleted = true; } catch (_) { }

    return deleted;
}