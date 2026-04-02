/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function difficulty(type) {// Seleziona la difficoltÃ  modificando la velocitÃ  dei nemici

    keyScore = 0;
    scoreKills = 0;
    perkSpentScore = 0;
    levelCompleted = 0;
    refreshScore();

    if (type === "easy") {
        diff_speed = 0.8;
        diff_enemy_num = 1;
        scoreMod = 1;
        md = 5.0;
        enemyRespawnDelay = 5.0;
        reloadTime = 0.2;
        safe = 5.0;
        railgun.cooldownLevels = 3;
        railgun.maxShots = 6;
        perk.cost.player.health = 100;
        perk.cost.player.stamina = 100;
        perk.cost.player.speed = 225;
        perk.cost.player.fow = 85;
        perk.cost.bullets.counter = 175;
        perk.cost.bullets.damage = 700;
        perk.cost.bullets.speed = 125;
        perk.cost.items.mde = 450;
        perk.cost.items.lbe = 200;
        perk.stats.player.health = 0;
        perk.stats.player.stamina = 0;
        perk.stats.player.speed = 0;
        perk.stats.player.fow = 0;
        perk.stats.bullets.counter = 0;
        perk.stats.bullets.damage = 0;
        perk.stats.bullets.speed = 0;
        perk.stats.items.mde = 0;
        perk.stats.items.lbe = 0;
        fogOfWar.radius = 108;
        levelCompleteReward = 100;
        generateMaze();
    }
    if (type === "normal") {
        diff_speed = 1;
        diff_enemy_num = 4;
        scoreMod = 2;
        md = 7.5;
        enemyRespawnDelay = 3.5;
        reloadTime = 0.5;
        safe = 2.5;
        railgun.cooldownLevels = 4;
        railgun.maxShots = 5;
        perk.cost.player.health = 200;
        perk.cost.player.stamina = 200;
        perk.cost.player.speed = 450;
        perk.cost.player.fow = 170;
        perk.cost.bullets.counter = 350;
        perk.cost.bullets.damage = 1400;
        perk.cost.bullets.speed = 350;
        perk.cost.items.mde = 900;
        perk.cost.items.lbe = 400;
        perk.stats.player.health = 0;
        perk.stats.player.stamina = 0;
        perk.stats.player.speed = 0;
        perk.stats.player.fow = 0;
        perk.stats.bullets.counter = 0;
        perk.stats.bullets.damage = 0;
        perk.stats.bullets.speed = 0;
        perk.stats.items.mde = 0;
        perk.stats.items.lbe = 0;
        fogOfWar.radius = 108;
        levelCompleteReward = 200
        generateMaze();
    }
    if (type === "hard") {
        diff_speed = 1.2;
        diff_enemy_num = 5;
        scoreMod = 4;
        md = 10.0;
        enemyRespawnDelay = 2.0;
        reloadTime = 1.0;
        safe = 1;
        railgun.cooldownLevels = 5;
        railgun.maxShots = 4;
        perk.cost.player.health = 400;
        perk.cost.player.stamina = 400;
        perk.cost.player.speed = 900;
        perk.cost.player.fow = 340;
        perk.cost.bullets.counter = 700;
        perk.cost.bullets.damage = 2400;
        perk.cost.bullets.speed = 700;
        perk.cost.items.mde = 1800;
        perk.cost.items.lbe = 800;
        perk.stats.player.health = 0;
        perk.stats.player.stamina = 0;
        perk.stats.player.speed = 0;
        perk.stats.player.fow = 0;
        perk.stats.bullets.counter = 0;
        perk.stats.bullets.damage = 0;
        perk.stats.bullets.speed = 0;
        perk.stats.items.mde = 0;
        perk.stats.items.lbe = 0;
        fogOfWar.radius = 108;
        levelCompleteReward = 400
        generateMaze();
    }
    if (type === "extreme") {
        diff_speed = 1.5;
        diff_enemy_num = 7;
        scoreMod = 8;
        md = 15.0;
        enemyRespawnDelay = 1.0;
        reloadTime = 1.5;
        safe = 0.5;
        railgun.cooldownLevels = 6;
        railgun.maxShots = 3;
        perk.cost.player.health = 800;
        perk.cost.player.stamina = 800;
        perk.cost.player.speed = 1800;
        perk.cost.player.fow = 680;
        perk.cost.bullets.counter = 1400;
        perk.cost.bullets.damage = 4800;
        perk.cost.bullets.speed = 1400;
        perk.cost.items.mde = 3600;
        perk.cost.items.lbe = 1600;
        perk.stats.player.health = 0;
        perk.stats.player.stamina = 0;
        perk.stats.player.speed = 0;
        perk.stats.player.fow = 0;
        perk.stats.bullets.counter = 0;
        perk.stats.bullets.damage = 0;
        perk.stats.bullets.speed = 0;
        perk.stats.items.mde = 0;
        perk.stats.items.lbe = 0;
        fogOfWar.radius = 108;
        levelCompleteReward = 800
        generateMaze();
    }
    bs = 4 + perk.stats.bullets.speed * 0.5;
    player.speed = 1.2 + (perk.stats.player.speed / 10);
    railgun.nextSpawnLevel = levels + railgun.cooldownLevels;
    for (let enemy of enemies) {
        enemy.speed = diff_speed;
    }
    refreshScore();
}
function wasdOnly(deltaTime) {
    let dirX = 0;
    let dirY = 0;

    if (keys["ArrowUp"]) dirY -= 1;
    if (keys["ArrowDown"]) dirY += 1;
    if (keys["ArrowLeft"]) dirX -= 1;
    if (keys["ArrowRight"]) dirX += 1;

    let length = Math.sqrt(dirX ** 2 + dirY ** 2);
    if (length !== 0) {
        dirX /= length;
        dirY /= length;
    }

    let playerSpeed = isRunning ? player.speed * runMultiplier : player.speed;
    let moveX = dirX * playerSpeed;
    let moveY = dirY * playerSpeed;

    if (moveX !== 0 || moveY !== 0) {
        const targetAngle = Math.atan2(moveY, moveX);

        let diff = targetAngle - player.angle;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        player.angle += diff * 0.2;
    }

    // Separa asse X e Y (movimento player)
    player.x += moveX * deltaTime * 60;
    player.y += moveY * deltaTime * 60;
}
function mouseDirection(deltaTime) {
    // Direzione input
    let moveX = 0;
    let moveY = 0;

    // Controllo direzione del giocatore attraverso la posizione del mouse
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    player.angle = Math.atan2(dy, dx);

    // Input tastiera + controllo direzione con mouse
    if (keys["KeyW"]) {
        moveX += Math.cos(player.angle);
        moveY += Math.sin(player.angle);
    }
    if (keys["KeyS"]) {
        moveX -= Math.cos(player.angle);
        moveY -= Math.sin(player.angle);
    }
    if (keys["KeyA"]) {
        moveX += Math.cos(player.angle - Math.PI / 2);
        moveY += Math.sin(player.angle - Math.PI / 2);
    }
    if (keys["KeyD"]) {
        moveX -= Math.cos(player.angle - Math.PI / 2);
        moveY -= Math.sin(player.angle - Math.PI / 2);
    }

    let length = Math.sqrt(moveX ** 2 + moveY ** 2); // Normalizza per non correre più veloce in diagonale (Teorema di Pitagora)
    if (length !== 0) {
        moveX /= length;
        moveY /= length;
    }

    // Velocità in pixel
    let playerSpeed = isRunning ? player.speed * runMultiplier : player.speed,
        drX = moveX * playerSpeed,
        drY = moveY * playerSpeed;

    // Separa asse X e Y (movimento player)
    player.x += drX * deltaTime * 60;
    player.y += drY * deltaTime * 60;
}
function wasdDirectionMouseAim(deltaTime) {
    let dirX = 0;
    let dirY = 0;

    if (keys["KeyW"]) dirY -= 1;
    if (keys["KeyS"]) dirY += 1;
    if (keys["KeyA"]) dirX -= 1;
    if (keys["KeyD"]) dirX += 1;

    let length = Math.hypot(dirX, dirY);
    if (length !== 0) {
        dirX /= length;
        dirY /= length;
    }

    let playerSpeed = isRunning ? player.speed * runMultiplier : player.speed;
    let moveX = dirX * playerSpeed;
    let moveY = dirY * playerSpeed;

    // Controllo direzione del giocatore attraverso la posizione del mouse
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    player.angle = Math.atan2(dy, dx);

    // Separa asse X e Y (movimento player)
    player.x += moveX * deltaTime * 60;
    player.y += moveY * deltaTime * 60;
}
function setMovement(type) {
    if (type === "wasdonly") {
        wasdonly = true;
        mousedirection = false;
        wasddirectionmouseaim = false;
        wValue = "↑";
        sValue = "↓";
        aValue = "←";
        dValue = "→";
        shootKeyValue = "Space";
        weaponSwitchValue = "R";
        directionControlValue = "Analog";
    } else if (type === "mousedirection") {
        wasdonly = false;
        mousedirection = true;
        wasddirectionmouseaim = false;
        wValue = "W";
        sValue = "S";
        aValue = "A";
        dValue = "D";
        shootKeyValue = "LMB";
        weaponSwitchValue = "RMB";
        directionControlValue = "Mouse";
    } else if (type === "wasddirectionmouseaim") {
        wasdonly = false;
        mousedirection = false;
        wasddirectionmouseaim = true;
        wValue = "W";
        sValue = "S";
        aValue = "A";
        dValue = "D";
        shootKeyValue = "LMB";
        weaponSwitchValue = "RMB";
        directionControlValue = "Mouse";
    }
    movementSelected = true;
}
function playerMovement(deltaTime) {
    if (wasdonly) return wasdOnly(deltaTime);
    if (mousedirection) return mouseDirection(deltaTime);
    if (wasddirectionmouseaim) return wasdDirectionMouseAim(deltaTime);

    wasdonly = true;
    mousedirection = false;
    wasddirectionmouseaim = false;
    return wasdOnly(deltaTime);
}
function resume() {
    isStatsMenu = false;
    playerStatsBool = false;
    isPaused = false;
    isPauseMenu = false;
    isInventory = false;
    isInventoryMenu = false;
    PAUSE_MENU.style.display = "none";
    PAUSE_MENU.innerHTML = "";
    INVENTORY.style.display = "none";
    INVENTORY.innerHTML = "";
}
function keysOption(INDEX) {
    let menuTypeChange = isPaused && !isMainMenu ? "settings(PAUSE_MENU)" : "settings(MAIN_MENU)";
    INDEX.innerHTML = `
    <div class="menu-box">
        <a class="title">Controls</a>
        <div tabindex="-1" class="legenda">
            <div class="menu-option">
                    <a class="option hoverable return" onclick="${menuTypeChange}">← Return</a>
            </div>
            <table class="subLegenda">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Keys</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Up</td>
                        <td id="up"></td>
                    </tr>
                    <tr>
                        <td>Down</td>
                        <td id="down"></td>
                    </tr>
                    <tr>
                        <td>Left</td>
                        <td id="left"></td>
                    </tr>
                    <tr>
                        <td>Right</td>
                        <td id="right"></td>
                    </tr>
                    <tr>
                        <td>Run</td>
                        <td>RShift, LShift</td>
                    </tr>
                    <tr>
                        <td>Pause</td>
                        <td>P, Esc</td>
                    </tr>
                    <tr>
                        <td>Perk Tab</td>
                        <td>C</td>
                    </tr>
                    <tr>
                        <td>Inventory</td>
                        <td>I</td>
                    </tr>
                    <tr>
                        <td>Shoot</td>
                        <td id="shoot"></td>
                    </tr>
                    <tr>
                        <td>Weapon Switch</td>
                        <td id="weaponkey"></td>
                    </tr>
                    <tr>
                        <td>Direction Control</td>
                        <td id=directionControl></td>
                    </tr>
                </tbody>
            </table><br>
            <strong style="color: rgb(200,0,0); font-size: 18px">
                Player movement
                axis is based on
                mouse position
                in case of
                WASD + Mouse Direction
            </strong><br><br>
        </div>
    </div>
    `;
    const w = document.getElementById("up"),
        s = document.getElementById("down"),
        a = document.getElementById("left"),
        d = document.getElementById("right"),
        shootKey = document.getElementById("shoot"),
        weaponSwitch = document.getElementById("weaponkey"),
        directionControl = document.getElementById("directionControl");
    w.textContent = wValue;
    a.textContent = aValue;
    s.textContent = sValue;
    d.textContent = dValue;
    shootKey.textContent = shootKeyValue;
    weaponSwitch.textContent = weaponSwitchValue;
    directionControl.textContent = directionControlValue;
    soundEvent();
}
function howToStart(INDEX) {
    let indexType = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    INDEX.innerHTML = `
        <div class="menu-box">
            <a class="title">How to start</a>
            <div tabindex="-1" class="legenda">
                <div class="menu-option">
                    <a class="option hoverable return" onclick="help(${indexType})">← Return</a>
                </div>
                <p class="subLegenda">
                    As you may have noticed, you can't just press the New Game option and start playing.
                    First, you need to choose control type in Settings → Controls.
                    You can switch the control type at any time you want,
                    either in the Main Menu or in the Pause Menu. <br><br>
                    If you forget controls,
                    you can simply pause the game and click on Settings → Keys from Pause Menu or Main Menu.
                </p>
            </div>
        </div>
    `;
    soundEvent();
}
function objective(INDEX) {
    let indexType = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    INDEX.innerHTML = `
    <div class="menu-box">
            <a class="title">How to start</a>
            <div tabindex="-1" class="legenda">
                <div class="menu-option">
                    <a class="option hoverable return" onclick="help(${indexType})">← Return</a>
                </div>
                <p class="subLegenda">
                    You have to pick<br>
                    up all Keys _ for<img class="img" src="icons/keyicon.png" />
                </p>
                <p class="subLegenda" style="top: -15px">
                    get the End cell.
                    If enimies touch you, you lose one HP.
                    If you lose all your HP, the score will reset and the level restart.
                    Player will be teleported to cell (1, 1).
                </p>
            </div>
        </div>
    `;
    soundEvent()
}
function perks(INDEX) {
    let indexType = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    INDEX.innerHTML = `
        <div class="menu-box-help">
            <a class="title">Perks</a>
            <div class="menu-option">
                <a class="option hoverable return" onclick="help(${indexType})">← Return</a>
            </div>
            <table class="subLegenda">
                <tr>
                    <th>Perks</th>
                    <th>Max Level</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>Health</td>
                    <td>10</td>
                    <td>Increase player health by 1 for each point.</td>
                </tr>
                <tr>
                    <td>Stamina</td>
                    <td>10</td>
                    <td>Decrease stamina drain by 0.2 for each point.</td>
                </tr>
                <tr>
                    <td>Speed</td>
                    <td>5</td>
                    <td>Increase player speed by 0.1 for each point.</td>
                </tr>
                <tr>
                    <td>Bullets</td>
                    <td>10</td>
                    <td>Increase magazine capacitor by 1 for each point.</td>
                </tr>
                <tr>
                    <td>Damage</td>
                    <td>1</td>
                    <td>Bullets remove 2 point from enemies health.</td>
                </tr>
                <tr>
                    <td>Bullets Speed</td>
                    <td>10</td>
                    <td>Increase bullets speed by 0.5 for each point.</td>
                </tr>
            </table>
        </div>
    `;
    soundEvent();
}
function help(INDEX) {
    let menuTypeChange = isPaused && !isMainMenu ? "pauseMenu()" : "mainMenu()";
    let indexType = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    INDEX.innerHTML = `
        <div class="menu-box">
            <a class="title">Help</a>
            <div tabindex="-1" class="legenda">
                <div class="menu-option">
                    <a class="option hoverable return" onclick="${menuTypeChange}">← Return</a>
                    <a class="option hoverable sec ${MAIN_MENU.dataset.hts ? "" : "help-glow-hts"}"
                        onclick="MAIN_MENU.dataset.hts='1'; howToStart(${indexType})">
                        <span class="pulse ${MAIN_MENU.dataset.hts ? "" : "help-pulse-hts"}">How to start</span>
                    </a>
                    <a class="option hoverable sec" onclick="objective(${indexType})">Objective</a>
                    <a class="option hoverable sec" onclick="perks(${indexType})">Perks</a>
                </div>
            </div>
        </div>
    `;
    soundEvent();
}
function stats(INDEX) {
    INDEX.innerHTML = `
        <div class="menu-box">
            <a class="title">Stats</a>
            <div class="menu-option">
                <a class="option hoverable return" onclick="pauseMenu()">← Return</a>
            </div>
            <p class="stat-text">Kills__________<span id="totalKills"></span></p>
            <p class="stat-text">Shots__________<span id="totalShots"></span></p>
            <p class="stat-text">Deads__________<span id="totalDeads"></span></p>
        </div>
    `;
    const Ckills = document.getElementById("totalKills"),
        Cshots = document.getElementById("totalShots"),
        Cdeads = document.getElementById("totalDeads");
    Ckills.textContent = totalEnemiesKilled;
    Cshots.textContent = totalShots;
    Cdeads.textContent = totalDeads;
    soundEvent();
}
function controls(INDEX) {
    let indexType = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    let resumeOrNot = isPaused && !isMainMenu ? "resume()" : "keysOption(MAIN_MENU)";
    INDEX.innerHTML = `
        <div class="menu-box">
            <a class="title">Controls</a>
            <div class="menu-option">
                <a class="option hoverable return" onclick="settings(${indexType})">← Return</a>
                <a class="option hoverable sec" onclick="setMovement('wasdonly'); ${resumeOrNot}">↑←↓→ + Auto Aim</a>
                <a class="option hoverable sec" onclick="setMovement('mousedirection'); ${resumeOrNot}">WASD + Mouse Direction</a>
                <a class="option hoverable sec" onclick="setMovement('wasddirectionmouseaim'); ${resumeOrNot}">WASD Direction + Mouse Aim</a>
            </div>
        </div>
    `;
    soundEvent();
}
function selectDifficulty(INDEX) {
    let innerIndex = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    let indexType = isPaused && !isMainMenu ? "resume()" : "mainMenu()";
    INDEX.innerHTML = `
        <div class="menu-box">
            <a class="title">Difficulty</a>
            <div class="menu-option">
                <a class="option hoverable return" onclick="settings(${innerIndex})">← Return</a>
                <a class="option hoverable sec" onclick="difficulty('easy'); ${indexType}">Easy</a>
                <a class="option hoverable sec" onclick="difficulty('normal'); ${indexType}">Normal</a>
                <a class="option hoverable sec" onclick="difficulty('hard'); ${indexType}">Hard</a>
                <a class="option hoverable sec" onclick="difficulty('extreme'); ${indexType}">Extreme</a>
            </div>
        </div>
    `;
    soundEvent();
}
function settings(INDEX) {
    let innerIndex = isPaused && !isMainMenu ? "PAUSE_MENU" : "MAIN_MENU";
    let indexType = isPaused && !isMainMenu ? "pauseMenu()" : "mainMenu()"
    INDEX.innerHTML = `
        <div class="menu-box">
            <a class="title">Settings</a>
            <div class="menu-option">
                <a class="option hoverable return" onclick="${indexType}">← Return</a>
                <a class="option hoverable sec" onclick="selectDifficulty(${innerIndex})">Difficulty</a>
                <a class="option hoverable sec" onclick="controls(${innerIndex})">Controls</a>
                <a class="option hoverable sec" onclick="keysOption(${innerIndex})">Keys</a>
            </div>
        </div>
        `;
    soundEvent();
}
function playerStats() {
    refreshScore();
    INVENTORY.style.display = "none";
    PAUSE_MENU.style.display = "flex";
    PAUSE_MENU.innerHTML = `
    <div class="menu-box-stats">
        <a class="title">Player Stats</a>
        <div class="menu-option-stats">
            <div class="flex">
                <a class="sec left fit-text">Health</a>
                <a id="health" class="sec right fit-text"></a>
                <a id="healthLVL" class="absolute-right"></a>
                <a id="healthPLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="health-bar">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable healthplus" onclick="increaseMaxHealth()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Stamina</a>
                <a id="stamina" class="sec right fit-text"></a>
                <a id="staminaLVL" class="absolute-right"></a>
                <a id="staminaPLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="stamina-bar">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable staminaplus" onclick="increaseStamina()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Speed</a>
                <a id="speed" class="sec right fit-text"></a>
                <a id="speedLVL" class="absolute-right"></a>
                <a id="speedPLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="speed-bar">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable playerspeedplus" onclick="increasePlayerSpeed()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Bullets</a>
                <a id="bullets" class="sec right fit-text"></a>
                <a id="bulletsLVL" class="absolute-right"></a>
                <a id="bulletsPLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="bullets-bar">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable bulletsplus" onclick="increaseBullets()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Damage</a>
                <a id="damage" class="sec right fit-text"></a>
                <a id="damageLVL" class="absolute-right"></a>
                <a id="damagePLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="damage-bar">
                    <tr>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable damageplus" onclick="increaseDamage()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Bullets Speed</a>
                <a id="bullets-speed" class="sec right fit-text"></a>
                <a id="bspeedLVL" class="absolute-right"></a>
                <a id="bspeedPLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="bulletsspeed-bar">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable bulletsspeedplus" onclick="increaseBulletsSpeed()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Medkit Efficiency</a>
                <a id="mde" class="sec right fit-text"></a>
                <a id="mdeLVL" class="absolute-right"></a>
                <a id="mdePLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="medkit-efficiency">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable mdeplus" onclick="increaseMDE()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">Battery Efficiency</a>
                <a id="lbe" class="sec right fit-text"></a>
                <a id="lbeLVL" class="absolute-right"></a>
                <a id="lbePLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="battery-efficiency">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable lbeplus" onclick="increaseLBE()">
                    <img src="icons/plus.png">
                </a>
            </div>
            <div class="flex">
                <a class="sec left fit-text">View Range</a>
                <a id="fow" class="sec right fit-text"></a>
                <a id="fowLVL" class="absolute-right"></a>
                <a id="fowPLUS" class="absolute-left"></a>
            </div>
            <div class="slot-row">
                <table class="fow">
                    <tr>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                        <td class="bar"></td>
                    </tr>
                </table>
                <a class="upgrade hoverable fowplus" onclick="increaseFOW()">
                    <img src="icons/plus.png">
                </a>
            </div>
        </div>
    </div>
    `;

    paintPerkBar(".health-bar", perk.stats.player.health, "rgb(0,190,25)", "rgb(0,47,6)");
    paintPerkBar(".stamina-bar", perk.stats.player.stamina, "rgb(206,209,122)", "rgb(72,73,43)");
    paintPerkBar(".speed-bar", perk.stats.player.speed, "rgb(122,209,206)", "rgb(43,73,72)");
    paintPerkBar(".bullets-bar", perk.stats.bullets.counter, "rgb(3,0,192)", "rgb(1,0,47)");
    paintPerkBar(".damage-bar", perk.stats.bullets.damage, "rgb(200,0,0)", "rgb(47,0,0)");
    paintPerkBar(".bulletsspeed-bar", perk.stats.bullets.speed, "rgb(200,200,200)", "rgb(47,47,47)");
    paintPerkBar(".medkit-efficiency", perk.stats.items.mde, "rgb(128,200,0)", "rgb(47,74,0)");
    paintPerkBar(".battery-efficiency", perk.stats.items.lbe, "rgb(0, 255, 255)", "rgb(0,68,68)");
    paintPerkBar(".fow", perk.stats.player.fow, "rgb(68, 68, 68)", "rgb(0,0,0)");

    const btnH = document.querySelector(".healthplus"),
        hudHealth = document.getElementById("health"),
        healthLVL = document.getElementById("healthLVL"),
        healthPLUS = document.getElementById("healthPLUS"),
        btnS = document.querySelector(".staminaplus"),
        hudStamina = document.getElementById("stamina"),
        staminaLVL = document.getElementById("staminaLVL"),
        staminaPLUS = document.getElementById("staminaPLUS"),
        btnPS = document.querySelector(".playerspeedplus"),
        hudSpeed = document.getElementById("speed"),
        speedLVL = document.getElementById("speedLVL"),
        speedPLUS = document.getElementById("speedPLUS"),
        btnB = document.querySelector(".bulletsplus"),
        hudBullets = document.getElementById("bullets"),
        bulletsLVL = document.getElementById("bulletsLVL"),
        bulletsPLUS = document.getElementById("bulletsPLUS"),
        btnD = document.querySelector(".damageplus"),
        hudDamage = document.getElementById("damage"),
        damageLVL = document.getElementById("damageLVL"),
        damagePLUS = document.getElementById("damagePLUS"),
        btnBS = document.querySelector(".bulletsspeedplus"),
        hudBulletsSpeed = document.getElementById("bullets-speed"),
        bspeedLVL = document.getElementById("bspeedLVL"),
        bspeedPLUS = document.getElementById("bspeedPLUS"),
        btnMDE = document.querySelector(".mdeplus"),
        hudMDE = document.getElementById("mde"),
        mdeLVL = document.getElementById("mdeLVL"),
        mdePLUS = document.getElementById("mdePLUS"),
        btnLBE = document.querySelector(".lbeplus"),
        hudLBE = document.getElementById("lbe"),
        lbeLVL = document.getElementById("lbeLVL"),
        lbePLUS = document.getElementById("lbePLUS"),
        btnFOW = document.querySelector(".fowplus"),
        hudFOW = document.getElementById("fow"),
        fowLVL = document.getElementById("fowLVL"),
        fowPLUS = document.getElementById("fowPLUS"),
        fit_text = document.querySelectorAll(".fit-text");

    btnH.style.display = (score >= perk.cost.player.health + perk.stats.player.health * 75 && perk.stats.player.health < 10) ? "block" : "none"; //
    hudHealth.style.color = (score >= perk.cost.player.health + perk.stats.player.health * 75 && perk.stats.player.health < 10) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudHealth.textContent = perk.stats.player.health < 10 ? `${score}/${perk.cost.player.health + perk.stats.player.health * 75}` : "MAX";
    healthLVL.textContent = "Lv." + perk.stats.player.health;
    healthPLUS.textContent = "+" + ((((3 + (perk.stats.player.health)) * 100) / 3) - 100).toFixed(1) + "%";

    btnS.style.display = (score >= perk.cost.player.stamina + perk.stats.player.stamina * 75 && perk.stats.player.stamina < 10) ? "block" : "none"; //
    hudStamina.style.color = (score >= perk.cost.player.stamina + perk.stats.player.stamina * 75 && perk.stats.player.stamina < 10) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudStamina.textContent = perk.stats.player.stamina < 10 ? `${score}/${perk.cost.player.stamina + perk.stats.player.stamina * 75}` : "MAX";
    staminaLVL.textContent = "Lv." + perk.stats.player.stamina;
    staminaPLUS.textContent = "-" + stamina.drain + "%";

    btnPS.style.display = (score >= perk.cost.player.speed + perk.stats.player.speed * 90 && perk.stats.player.speed < 5) ? "block" : "none"; // total 7700
    hudSpeed.style.color = (score >= perk.cost.player.speed + perk.stats.player.speed * 90 && perk.stats.player.speed < 5) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudSpeed.textContent = perk.stats.player.speed < 5 ? `${score}/${perk.cost.player.speed + perk.stats.player.speed * 90}` : "MAX";
    speedLVL.textContent = "Lv." + perk.stats.player.speed;
    speedPLUS.textContent = "+" + ((((1.2 + (perk.stats.player.speed / 10)) * 100) / 1.2) - 100).toFixed(1) + "%";

    btnB.style.display = (score >= perk.cost.bullets.counter + perk.stats.bullets.counter * 85 && perk.stats.bullets.counter < 10) ? "block" : "none"; // total 6600
    hudBullets.style.color = (score >= perk.cost.bullets.counter + perk.stats.bullets.counter * 85 && perk.stats.bullets.counter < 10) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudBullets.textContent = perk.stats.bullets.counter < 10 ? `${score}/${perk.cost.bullets.counter + perk.stats.bullets.counter * 85}` : "MAX";
    bulletsLVL.textContent = "Lv." + perk.stats.bullets.counter;
    bulletsPLUS.textContent = "+" + perk.stats.bullets.counter;

    btnD.style.display = (score >= perk.cost.bullets.damage && perk.stats.bullets.damage < 1) ? "block" : "none";
    hudDamage.style.color = (score >= perk.cost.bullets.damage && perk.stats.bullets.damage < 1) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudDamage.textContent = perk.stats.bullets.damage < 1 ? `${score}/${perk.cost.bullets.damage}` : "MAX";
    damageLVL.textContent = "Lv." + perk.stats.bullets.damage;
    damagePLUS.textContent = "x" + perk.stats.bullets.damage * 2;

    btnBS.style.display = (score >= perk.cost.bullets.speed + perk.stats.bullets.speed * 95 && perk.stats.bullets.speed < 10) ? "block" : "none";
    hudBulletsSpeed.style.color = (score >= perk.cost.bullets.speed + perk.stats.bullets.speed * 95 && perk.stats.bullets.speed < 10) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudBulletsSpeed.textContent = perk.stats.bullets.speed < 10 ? `${score}/${perk.cost.bullets.speed + perk.stats.bullets.speed * 95}` : "MAX";
    bspeedLVL.textContent = "Lv." + perk.stats.bullets.speed;
    bspeedPLUS.textContent = "+" + perk.stats.bullets.speed * 12.5 + "%";

    btnMDE.style.display = (score >= perk.cost.items.mde + perk.stats.items.mde * 225 && perk.stats.items.mde < 3) ? "block" : "none";
    hudMDE.style.color = (score >= perk.cost.items.mde + perk.stats.items.mde * 225 && perk.stats.items.mde < 3) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudMDE.textContent = perk.stats.items.mde < 3 ? `${score}/${perk.cost.items.mde + perk.stats.items.mde * 225}` : "MAX";
    mdeLVL.textContent = "Lv." + perk.stats.items.mde;
    mdePLUS.textContent = "+" + (perk.stats.items.mde + 1);

    btnLBE.style.display = (score >= perk.cost.items.lbe + perk.stats.items.lbe * 90 && perk.stats.items.lbe < 10) ? "block" : "none";
    hudLBE.style.color = (score >= perk.cost.items.lbe + perk.stats.items.lbe * 90 && perk.stats.items.lbe < 10) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudLBE.textContent = perk.stats.items.lbe < 10 ? `${score}/${perk.cost.items.lbe + perk.stats.items.lbe * 90}` : "MAX";
    lbeLVL.textContent = "Lv." + perk.stats.items.lbe;
    lbePLUS.textContent = "-" + `${perk.stats.items.lbe * 4.5}` + "%";

    btnFOW.style.display = (score >= perk.cost.player.fow + perk.stats.player.fow * 75 && perk.stats.player.fow < 10) ? "block" : "none";
    hudFOW.style.color = (score >= perk.cost.player.fow + perk.stats.player.fow * 75 && perk.stats.player.fow < 10) ? "rgb(0,255,0)" : "rgb(255,0,0)";
    hudFOW.textContent = perk.stats.player.fow < 10 ? `${score}/${perk.cost.player.fow + perk.stats.player.fow * 75}` : "MAX";
    fowLVL.textContent = "Lv." + perk.stats.player.fow;
    fowPLUS.textContent = "+" + (10.8 * perk.stats.player.fow).toFixed(1) + "%";

    fit_text.forEach(el => {
        fitText(el)
    })
    soundEvent();
}
function playerInventory() {
    PAUSE_MENU.style.display = "none";
    INVENTORY.style.display = "flex";
    INVENTORY.innerHTML = `
    <div class="menu-inventory">
        <a class="title">Inventory</a><br>
        <div class="inventory-option">
            <div class="grid" id="grid"></div>
        </div>
    </div>`;
    const grid = document.getElementById("grid");
    grid.style.width = "600px";
    grid.style.height = "180px";
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(10, 60px)`;

    for (let i = 0; i < 30; i++) {
        const cell = document.createElement("div");
        const slot = inventory[i] ?? null;
        cell.dataset.slot = i;
        cell.classList.add("cell");
        cell.style.width = "60px";
        cell.style.height = "60px";
        if (slot) {
            const itemName = typeof slot.name === "string" ? slot.name.toLowerCase() : "";
            const itemQty = slot.quantity ? slot.quantity : 1;

            const itemIconMap = {
                magazine: "icons/magazine.png",
                battery: "icons/battery.png",
                medkit: "icons/medkit.png"
            };

            const itemIcon = itemIconMap[itemName] || "icons/appIcon.png";

            cell.innerHTML = `
                <img class="cell-icon" src="${itemIcon}">
                <span class="cell-qty">${itemQty}</span>
            `;
        }
        grid.appendChild(cell);
    }
    grid.addEventListener("click", (e) => {
        const cell = e.target.closest(".cell");
        if (!cell || !grid.contains(cell)) return;

        const slotIndex = Number(cell.dataset.slot);
        if (Number.isNaN(slotIndex)) return;

        useInventorySlot(slotIndex);
    })
}
function useInventorySlot(slotIndex) {
    const slot = inventory[slotIndex];
    if (!slot) return;

    const itemName = typeof slot.name === "string" ? slot.name.toLowerCase() : "";
    let used = false;

    if (itemName === "medkit") {
        if (player.hit > 0) {
                if (player.hit >= 1 + perk.stats.items.mde) player.hit = player.hit - (1 + perk.stats.items.mde);
                else player.hit = 0;
            };
        medSound.currentTime = 0;
        medSound.playbackRate = 1.5;
        medSound.play();
        used = true;
    } else if (itemName === "battery") {
        if (laserBattery < 100) {
            laserBattery = 100;
            batteryPickupSound.currentTime = 0;
            batteryPickupSound.playbackRate = 1;
            batteryPickupSound.play();
            used = true;
        }
    } else if (itemName === "magazine") {
        const wasReloading = isReloading;
        reload(); // consuma dallo stack solo se parte davvero il reload
        if (!wasReloading && isReloading) playerInventory();
        return;
    }

    if (!used) return;

    slot.quantity--;
    if (slot.quantity <= 0) inventory[slotIndex] = null;

    playerInventory(); // refresh UI
}
function pauseMenu() {
    INVENTORY.style.display = "none";
    PAUSE_MENU.style.display = "flex";
    PAUSE_MENU.innerHTML = `
        <div class="menu-box" id="resume">
            <a class="title">PAUSE</a>
            <div class="menu-option">
                <a class="option hoverable" onclick="resume()">Resume</a>
                <a class="option hoverable sec" onclick="saveMenu(PAUSE_MENU)">Save</a>
                <a class="option hoverable sec" onclick="loadMenu(PAUSE_MENU)">Load Game</a>
                <a class="option hoverable sec" onclick="settings(PAUSE_MENU)">Settings</a>
                <a class="option hoverable sec" onclick="stats(PAUSE_MENU)">Stats</a>
                <a class="option hoverable sec" onclick="help(PAUSE_MENU)">Help</a>
                <a class="option hoverable sec" onclick="toMainMenu(); generateMaze(); resetPlayer(); resetPlayerStats()">Main Menu</a>
            </div>
        </div>
    `;
    soundEvent();
}
function mainMenu() {
    isPauseMenu = false;
    isStatsMenu = false
    MAIN_MENU.style.display = "flex";
    MAIN_MENU.innerHTML = `
        <div class="menu-box">
            <a class="title">Maze Game</a>
            <div class="menu-option">
                <a class="option hoverable" id="startBtn" onclick="return startGameOption(event)">New Game</a>
                <a class="option hoverable sec" onclick="loadMenu(MAIN_MENU)">Load Game</a>
                <a class="option hoverable sec" onclick="settings(MAIN_MENU)">Settings</a>
                <a class="option hoverable sec ${MAIN_MENU.dataset.hg ? "" : "help-glow-hg"}"
                    onclick="MAIN_MENU.dataset.hg='1'; help(MAIN_MENU)">
                    <span class="pulse ${MAIN_MENU.dataset.hg ? "" : "help-pulse-hg"}">Help</span>
                </a>
                <a class="option hoverable sec exit" onclick="return exitGame()">Exit</a>
            </div>
        </div>
    `;
    updateStartGame();
    soundEvent();
}
function loadMenu(INDEX) {
    void loadSaveMenu(INDEX, "load");
}
function saveMenu(INDEX) {
    void loadSaveMenu(INDEX, "save");
}
async function loadSaveMenu(INDEX, mode = "load") {
    let menuTypeChange = isPaused && !isMainMenu ? "pauseMenu()" : "mainMenu()";
    let title = mode === "load" ? "Load Game" : "Save Game";

    const indexRef = INDEX === PAUSE_MENU ? "PAUSE_MENU" : "MAIN_MENU";

    const empty1 = await isSlotEmpty(1);
    const empty2 = await isSlotEmpty(2);
    const empty3 = await isSlotEmpty(3);

    const slot1 = empty1 ? "{empty}" : "Slot 1";
    const slot2 = empty2 ? "{empty}" : "Slot 2";
    const slot3 = empty3 ? "{empty}" : "Slot 3";

    INDEX.innerHTML = `
    <div class="menu-box">
            <a class="title">${title}</a>
            <div class="menu-option">
                <a class="option hoverable return" onclick="${menuTypeChange}">← Return</a>

                <div class="slot-row">
                    <a class="option hoverable sec" onclick="onSlotClick(1, '${mode}', ${indexRef}); return false;">${slot1}</a>
                    <a class="delete hoverable sec" onclick="onDeleteSlotClick(1, '${mode}', ${indexRef}, event); return false;">
                        <img src="icons/trashcan.png">
                    </a>
                </div>

                <div class="slot-row">
                    <a class="option hoverable sec" onclick="onSlotClick(2, '${mode}', ${indexRef}); return false;">${slot2}</a>
                    <a class="delete hoverable sec" onclick="onDeleteSlotClick(2, '${mode}', ${indexRef}, event); return false;">
                        <img src="icons/trashcan.png">
                    </a>
                </div>

                <div class="slot-row">
                    <a class="option hoverable sec" onclick="onSlotClick(3, '${mode}', ${indexRef}); return false;">${slot3}</a>
                    <a class="delete hoverable sec" onclick="onDeleteSlotClick(3, '${mode}', ${indexRef}, event); return false;">
                        <img src="icons/trashcan.png">
                    </a>
                </div>
            </div>
        </div>
    `;
    soundEvent();
}
function updateStartGame() {
    const btn = document.getElementById("startBtn");
    if (!btn) return;

    if (movementSelected) {
        btn.classList.remove("disable");
        btn.setAttribute("aria-disabled", "false");
    } else {
        btn.classList.add("disabled");
        btn.setAttribute("aria-disabled", "true");
    }
}
function startGameOption(e) {
    if (!movementSelected) {
        if (e) e.preventDefault();
        return false;
    }
    startGame();
    return false;
}
function startGame() {
    if (!movementSelected) return;
    generateMaze();
    respawnTimerBlock(0);
    isMainMenu = false;
    isPaused = false;
    isMainMenu = false;
    isPaused = false;
    GAME.style.display = "block";
    START_MENU.style.display = "none";
}
function toMainMenu() {
    isMainMenu = true;
    isPaused = true;
    GAME.style.display = "none";
    START_MENU.style.display = "flex";
    pickup = [];
    scores.textContent = "Score: 0";
    ammo.textContent = "[Ammo: 0";
    mag.textContent = "Magazine: 0]";
    magazines = [];
    batteries = [];
    pickupRemaining = 0;
    magazine = 0;
    bulletsMag = 8;
    laserBattery = 100;
    mainMenu();
}
function startLoadedGame() {
    GAME.style.display = "block";
    START_MENU.style.display = "none";
    isMainMenu = false;
    isPaused = false;
    isMainMenu = false;
    isPaused = false;
    respawnTimerBlock(0);
}
async function onSlotClick(slotNumber, mode, indexRef) {
    if (mode === "save") {
        await saveGameInSlot(slotNumber);
        await loadSaveMenu(indexRef, "save"); // refresh nomi subito
        return;
    }

    const empty = await isSlotEmpty(slotNumber);
    if (empty) return; // non caricare slot vuoto
    await loadSavedGame(slotNumber);
}
async function onDeleteSlotClick(slotNumber, mode, indexRef, event) {
    if (event) event.stopPropagation();
    await deleteSavedGame(slotNumber);
    await loadSaveMenu(indexRef, mode); // refresh nomi subito
}
function exitGame() {
    const browserFallback = () => {
        try {
            window.close();
        } catch (_) { }
    };

    if (typeof Neutralino === "undefined") {
        browserFallback();
        return false;
    }

    Neutralino.app
        .exit(0)
        .catch(() => Neutralino.app.killProcess())
        .catch(() => browserFallback());

    return false;
}
function soundEvent() {
    function click() {
        muteHoverUntil = performance.now() + 120;
        option_click.currentTime = 0;
        option_click.play();
    }
    function mouseOver() {
        if (performance.now() < muteHoverUntil) return;
        option_hover.currentTime = 0;
        option_hover.volume = 0.5;
        option_hover.play();
    }
    document.querySelectorAll(".hoverable").forEach((e) => {
        if (e.dataset.se) return;
        e.dataset.se = "1";

        e.addEventListener("click", () => {
            if (e.id === "startBtn" && e.classList.contains("disabled")) return;
            click();
        });

        e.addEventListener("mouseover", () => {
            if (e.id === "startBtn" && e.classList.contains("disabled")) return;
            mouseOver();
        });
    });
}