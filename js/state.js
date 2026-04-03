/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

const pickupCounterEl = document.getElementById("pickupCounter"),
    scores = document.getElementById("score"),
    lvl = document.getElementById("lvl"),
    ammo = document.getElementById("ammo"),
    mag = document.getElementById("mag"),
    battery = document.getElementById("battery"),
    batteryContainer = document.getElementById("batteryContainer"),
    batteryContainerSpan = document.getElementById("batteryContainerSpan"),
    gameCanvas = document.getElementById("game-canvas"),
    fogCanvas = document.getElementById("fog-canvas"),
    ctx = gameCanvas.getContext("2d"),
    fogCtx = fogCanvas.getContext("2d"),
    cmd = document.getElementById("console"),
    MAIN_MENU = document.getElementById("main-menu"),
    PAUSE_MENU = document.getElementById("pause-menu"),
    GAME = document.getElementById("game"),
    START_MENU = document.getElementById("start-menu"),
    START_CLICK = document.getElementById("pulsingText"),
    OVERLAY = document.getElementById("overlay"),
    INVENTORY = document.getElementById("inventory");

// Salvataggio
const SAVE_VERSION = "v5.2.2.0"

// Audio
const shootSound = new Audio("SFX/shot.mp3"),
    killSound = new Audio("SFX/kill.mp3"),
    deathSound = new Audio("SFX/kill.mp3"),
    pickupSound = new Audio("SFX/pickup.mp3"),
    goalSounds = Array.from({ length: 6 }, (_, i) => new Audio(`SFX/goal${i + 1}.mp3`)),
    steps = new Audio("SFX/step.mp3"),
    magPickupSound = new Audio("SFX/magpickup.mp3"),
    batteryPickupSound = new Audio("SFX/battery.mp3"),
    railgunShootSound = new Audio("SFX/railgun.mp3"),
    option_hover = new Audio("SFX/option-hover.wav"),
    option_click = new Audio("SFX/option-click.wav"),
    medSound = new Audio("SFX/med.mp3"),
    playerHitSound = new Audio("SFX/player-hit.mp3");
deathSound.preservesPitch = false;          // standard
deathSound.mozPreservesPitch = false;       // Firefox
deathSound.webkitPreservesPitch = false;    // Safari
shootSound.preservesPitch = false;          // standard
shootSound.mozPreservesPitch = false;       // Firefox
shootSound.webkitPreservesPitch = false;    // Safari
killSound.preservesPitch = false;          // standard
killSound.mozPreservesPitch = false;       // Firefox
killSound.webkitPreservesPitch = false;    // Safari
steps.preservesPitch = false;          // standard
steps.mozPreservesPitch = false;       // Firefox
steps.webkitPreservesPitch = false;    // Safari
magPickupSound.preservesPitch = false;          // standard
magPickupSound.mozPreservesPitch = false;       // Firefox
magPickupSound.webkitPreservesPitch = false;    // Safari

// Other
let lastTime = performance.now(),
    isConsoleOn = false,
    mouseX, mouseY,
    muteHoverUntil = 0,
    keys = {};

// Maze
const rows = 33,
    cols = 33,
    cell_size = 20;
gameCanvas.width = cols * cell_size;
gameCanvas.height = rows * cell_size;
fogCanvas.width = gameCanvas.width;
fogCanvas.height = gameCanvas.height;

const cx = gameCanvas.width,
    cy = gameCanvas.height,
    wall_color = "rgb(20,20,30)",
    path_color = "lightgray";

let cellRowRandom,
    cellColRandom;

let maze = Array(rows).fill().map(() => Array(cols).fill(1));

let goal = {
    row: 1,
    col: 1
};
let frontier = [],
    generating = false,
    goalActive = false,
    pickupRemaining = 0,
    totalKeys,
    wpValue = 1;


// Commands
let command = {
    noClip: false, // ok
    peacefulMode: false, // ok
    bulletCollisionWall: true, //ok
    invisibleMode: false, // ok
    unlimitedStamina: false, //ok
    immortal: false, // ok
    railgunMode: false, // ok
    infinityBullets: false // ok
}

// Player
let inventory = new Array(30).fill(null);

let perk = {
    stats: {
        player: {
            health: 0,
            stamina: 0,
            speed: 0,
            fow: 0
        },
        bullets: {
            counter: 0,
            damage: 0,
            speed: 0
        },
        items: {
            mde: 0, // Med Kit Efficiency
            lbe: 0 // Laser Battery Efficiency
        }
    },
    cost: {
        player: {
            health: 100,
            stamina: 100,
            speed: 225,
            fow: 85
        },
        bullets: {
            counter: 175,
            damage: 700,
            speed: 125
        },
        items: {
            mde: 450, // Med Kit Efficiency
            lbe: 200 // Laser Battery Efficiency
        }
    }
};
let fogOfWar = {
    enabled: true,
    radius: 108 + 10.8 * perk.stats.player.fow,
    edgeSoftness: 36,
    color: "rgba(0, 0, 0, 1)"
};
let player = {
    x: cell_size + cell_size / 2,
    radius: 5,
    speed: 1.2 + (perk.stats.player.speed / 10),
    angle: 0,
    y: cell_size + cell_size / 2,
    hit: 0,
    maxHealth: 3 + perk.stats.player.health
};
player.displayH = player.maxHealth;

let trail = [],
    lastFootX = player.x,
    lastFootY = player.y;

const footStepDistance = 12 // Distanza minima tra impronte
let footSide = 1; // Alterna L/R

const runMultiplier = 1.4;
let isRunning = false,
    canShoot = true,
    stablePlayerCell = { row: 1, col: 1 };

let stamina = {
    length: 1,
    alpha: 0,
    drain: 0
};
const magSize = 8;
    magazine = 0,
    perkBulletsMax = 0,
    bulletsMag = magSize,
    laserBattery = 100;
    
let isReloading = false,
    reloadTimer = 0,
    reloadTime = 0.5, // Secondi
    safe = 5;

let spa = false, // Spawn Pulse Active
    sps = 0, // Spawn Pulse Start
    spd = 1, // Spawn Pulse Duration
    spsr = 0; // Spawn Pulse Start Radius

// Pickups
let magazines = [],
    pickup = [],
    batteries = [],
    meds = [];

let initialPickups = [],
    initialBatteries = [],
    initialMagazines = [],
    initialMeds = [];

// Enemy
const minDist = 22; //distanza minima dal player
let diff_enemy_num = 1,
    enemies = [],
    diff_speed = 0.8,
    enemiesActivated = false,
    md = 5.0,
    noiseOwner = null, // Nemico che sta investigando
    noiseEvent = null, // {row, col, timer}
    levelEnemyCount = 0,
    enemyRespawnQueue = [],
    enemyRespawnDelay = 5.0; //secondi

// Entity
let bullets = [],
    railgunLifetime = 2,
    respawnTimer = 0,
    bs = 4 + perk.stats.bullets.speed * 0.5,
    tl = 0,
    bulletSize;
let bulletColorNormal = [
    "rgba(255, 255, 0, 0.3)",
    "rgba(255, 255, 162, 0.3)",
    "rgba(255, 255, 233, 1)",
    "rgba(132, 0, 255, 0.3)",
    "rgba(177, 94, 255, 0.3)",
    "rgb(226, 195, 255)"
];
let bulletColorRailgun = [
    "rgba(0, 128, 255, 0.3)",
    "rgba(0, 255, 255, 0.3)",
    "rgba(192, 255, 255, 1)"
];
let bulletColor = bulletColorNormal;
let aim = 120;

// UI Counters
let levels = 1,
    perkSpentScore = 0,
    isPaused = true,
    isMainMenu = true,
    isInventory = false,
    totalPickupsCollected = 0,
    keyScore = 0,
    totalEnemiesKilled = 0,
    scoreKills = 0,
    scoreMod = 1,
    deads = 0,
    totalDeads = 0,
    score,
    totalShots = 0,
    levelCompleted = 0,
    levelCompleteReward = 100;

// Weapons
const modes = [
    "pistol",
    "laser",
    "railgun"
];

const laserCellBreakMs = 3000,
    laserCrackbackMsPerSecond = 1400,
    laserHitTime = new Map();

let modeIndex = 0;

let railgun = {
    pickup: null,
    activeByPickup: false,
    shotsLeft: 0,
    maxShots: 5,
    cooldownLevels: 4,
    nextSpawnLevel: 4,
    pendingDisable: false,
    prevBulletCollisionWall: true
};
let isHolding = false,
    isCracking = false,
    maxR1, maxR2;

// Laser Audio

const laserShootSound = new Audio("SFX/laser.mp3"),
    wallSmashSound = new Audio("SFX/wallsmash.mp3"),
    CRK_START = "SFX/cracking-start.wav",
    CRK_LOOP = "SFX/cracking-loop.wav",
    CRK_END = "SFX/cracking-end.wav";

const LOOP_START = 0.0,
    LOOP_END_PADDING = 0.0,
    RELEASE_FADE_SECONDS = 0.012,
    CRK_VOLUME = 0.3;

const audioCtxCRK = new AudioContext(),
    masterGain = audioCtxCRK.createGain();
masterGain.gain.value = CRK_VOLUME;
masterGain.connect(audioCtxCRK.destination);

let pressToken = 0,
    buffers = null,
    activeStart = null,
    activeLoop = null,
    activeLoopGain = null;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
laserShootSound.loop = true;

const track = audioCtx.createMediaElementSource(laserShootSound),
    gainNode = audioCtx.createGain();
track.connect(gainNode).connect(audioCtx.destination);

let stopTimer = null;

// Option
let wasdonly = true,
    mousedirection = false,
    wasddirectionmouseaim = false,
    movementSelected = false,
    isKeybinding = false,

    // KEYBIND
    upKeyValue = "",
    downKeyValue = "",
    leftKeyValue = "",
    rightKeyValue = "",
    shootKeyValue = "",
    weaponSwitchKeyValue = "",
    inventoryKeyValue = "",
    perkKeyValue = "",
    runKeyValue = "",

    // TABLE SHOWN
    wValue = "",
    sValue = "",
    aValue = "",
    dValue = "",
    runValue = "",
    perkValue = "",
    inventoryValue= "",
    shootValue = "",
    weaponSwitchValue = "",
    directionControlValue = "",
    playerStatsBool = false;
// Temporary