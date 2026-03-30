/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 *
 */

const laserShootSound = new Audio("SFX/laser.mp3");
const wallSmashSound = new Audio("SFX/wallsmash.mp3");
const CRK_START = "SFX/cracking-start.wav";
const CRK_LOOP = "SFX/cracking-loop.wav";
const CRK_END = "SFX/cracking-end.wav";

const LOOP_START = 0.0;
const LOOP_END_PADDING = 0.0;
const RELEASE_FADE_SECONDS = 0.012;
const CRK_VOLUME = 0.3;

const AudioCtxCtor = window.AudioContext || window.webkitAudioContext;
const audioCtxCRK = AudioCtxCtor ? new AudioCtxCtor() : null;
const masterGain = audioCtxCRK ? audioCtxCRK.createGain() : null;
if (masterGain && audioCtxCRK) {
    masterGain.gain.value = CRK_VOLUME;
    masterGain.connect(audioCtxCRK.destination);
}

let isHolding = false;
let pressToken = 0;
let buffers = null;
let isCracking = false;

let activeStart = null;
let activeLoop = null;
let activeLoopGain = null;

const audioCtx = AudioCtxCtor ? new AudioCtxCtor() : null;
laserShootSound.loop = true;

const track = audioCtx ? audioCtx.createMediaElementSource(laserShootSound) : null;
const gainNode = audioCtx ? audioCtx.createGain() : null;
if (track && gainNode && audioCtx) {
    track.connect(gainNode).connect(audioCtx.destination);
}

let stopTimer = null;
let laserInterval = null;
let laserTime = 0;

function raycast(x, y, dx, dy, maxLen, minLen = 0) {
    let step = 4;
    let len = minLen;

    while (len < maxLen) {
        const px = x + dx * len;
        const py = y + dy * len;

        const col = Math.floor(px / cell_size);
        const row = Math.floor(py / cell_size);

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
function getLaserBreakProgress(row, col) {
    if (maze[row][col] !== 1) return 0;
    const hitKey = `${row},${col}`;
    const hitMs = laserHitTime.get(hitKey) || 0;
    return Math.min(hitMs / laserCellBreakMs, 1);
}
function drawLaserBeam(b) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(Math.atan2(b.dy, b.dx));

    const cLen = Math.hypot(canvas.width, canvas.height);

    const len = raycast(
        player.x,
        player.y,
        b.dx,
        b.dy,
        cLen,
        0
    );

    const flick = Math.floor(Math.random() * 2) + 1;
    ctx.filter = "blur(1px)";

    ctx.fillStyle = "rgba(0, 128, 255, 1)";
    ctx.beginPath();
    ctx.ellipse(len - 5, 0, flick + 3, 5, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.fillRect(0, -0.5, len - 5, flick + 4);
    ctx.fillRect(0, 0.5, len - 5, -(flick + 4));

    ctx.fillStyle = "rgba(128, 160, 255, 1)";
    ctx.beginPath();
    ctx.ellipse(len - 5, 0, flick + 2, 4, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.fillRect(0, -0.5, len - 5, flick + 3);
    ctx.fillRect(0, 0.5, len - 5, -(flick + 3));

    ctx.fillStyle = "rgba(180, 255, 255, 1)";
    ctx.beginPath();
    ctx.ellipse(len - 5, 0, flick + 1, 3, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.fillRect(0, -0.5, len - 5, flick + 2);
    ctx.fillRect(0, 0.5, len - 5, -(flick + 2));

    ctx.restore();
}
function laserShoot() {
    let dx;
    let dy;

    const d_X = mouseX - player.x;
    const d_Y = mouseY - player.y;
    player.angle = Math.atan2(d_Y, d_X);

    const len = Math.sqrt(d_X * d_X + d_Y * d_Y);
    if (len > 0) {
        dx = d_X / len;
        dy = d_Y / len;
    } else {
        dx = Math.cos(player.angle);
        dy = Math.sin(player.angle);
    }

    bullets.push({
        x: player.x,
        y: player.y,
        dx: dx,
        dy: dy,
        speed: 30,
        isPistol: false,
        isLaser: true,
        isRailgun: false,
        r1: 1,
        r2: 1
    });
}
async function loadBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const arr = await res.arrayBuffer();
    return await audioCtxCRK.decodeAudioData(arr);
}
async function ensureBuffers() {
    if (buffers) return buffers;
    const [start, loop, end] = await Promise.all([
        loadBuffer(CRK_START),
        loadBuffer(CRK_LOOP),
        loadBuffer(CRK_END),
    ]);
    buffers = { start, loop, end };
    return buffers;
}
function stopNodeSafe(node, when = null) {
    if (!audioCtxCRK) return;
    const stopWhen = when ?? audioCtxCRK.currentTime;
    if (!node) return;
    try {
        node.stop(stopWhen);
    } catch (_) {
        // ignore repeated stop calls
    }
}
function clearActiveSources() {
    if (!audioCtxCRK) return;
    stopNodeSafe(activeStart);
    activeStart = null;

    if (activeLoop && activeLoopGain) {
        const now = audioCtxCRK.currentTime;
        activeLoopGain.gain.cancelScheduledValues(now);
        activeLoopGain.gain.setValueAtTime(activeLoopGain.gain.value, now);
        activeLoopGain.gain.linearRampToValueAtTime(0, now + RELEASE_FADE_SECONDS);
        stopNodeSafe(activeLoop, now + RELEASE_FADE_SECONDS + 0.002);
    } else {
        stopNodeSafe(activeLoop);
    }

    activeLoop = null;
    activeLoopGain = null;
}
function playBufferOnce(buffer, when = null, offset = 0) {
    if (!audioCtxCRK || !masterGain) return null;
    const startWhen = when ?? audioCtxCRK.currentTime;
    const src = audioCtxCRK.createBufferSource();
    src.buffer = buffer;
    src.connect(masterGain);
    src.start(startWhen, offset);
    return src;
}
function startLooping(buffer, when) {
    if (!audioCtxCRK || !masterGain) return;
    const loopGain = audioCtxCRK.createGain();
    loopGain.gain.setValueAtTime(1, when);
    loopGain.connect(masterGain);

    const src = audioCtxCRK.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.loopStart = LOOP_START;
    src.loopEnd = Math.max(LOOP_START + 0.01, buffer.duration - LOOP_END_PADDING);
    src.connect(loopGain);
    src.start(when, LOOP_START);

    activeLoop = src;
    activeLoopGain = loopGain;
}
async function onPressStart() {
    if (!canvas) return;
    if (!audioCtxCRK) return;
    pressToken += 1;
    const token = pressToken;
    isCracking = true;

    await audioCtxCRK.resume();
    let loaded;
    try {
        loaded = await ensureBuffers();
    } catch (_) {
        return;
    }
    const { start, loop } = loaded;
    if (token !== pressToken || !isCracking) return;

    clearActiveSources();

    const now = audioCtxCRK.currentTime;
    activeStart = playBufferOnce(start, now, 0);
    const loopWhen = now + start.duration;
    startLooping(loop, loopWhen);
}
async function onPressEnd() {
    if (!canvas) return;
    if (!audioCtxCRK) return;
    pressToken += 1;
    isCracking = false;

    await audioCtxCRK.resume();
    let loaded;
    try {
        loaded = await ensureBuffers();
    } catch (_) {
        return;
    }
    const { end } = loaded;

    clearActiveSources();
    playBufferOnce(end, audioCtxCRK.currentTime, 0);
}
async function startLaserSound() {
    if (!audioCtx || !gainNode) return;
    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }

    if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
    }

    const now = audioCtx.currentTime;

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), now);
    gainNode.gain.exponentialRampToValueAtTime(2.0, now + 0.05);

    laserShootSound.currentTime = 0;

    if (laserShootSound.paused) {
        laserShootSound.play().catch(() => { });
    }
}
function stopLaserSound() {
    if (!audioCtx || !gainNode) return;
    const now = audioCtx.currentTime;
    const fadeOutSeconds = 0.5;

    if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
    }

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutSeconds);

    stopTimer = setTimeout(() => {
        laserShootSound.pause();
        laserShootSound.currentTime = 0;
        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        stopTimer = null;
    }, (fadeOutSeconds * 1000) + 30);
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
function stopLaserFiring() {
    isHolding = false;

    if (laserInterval) {
        clearInterval(laserInterval);
        laserInterval = null;
    }

    removeLaserBulletsAndStopSound();
    if (isCracking) onPressEnd();
    laserTime = 0;
}
function startLaserFiring() {
    isHolding = true;
    if (laserInterval || laserTime > 7) return;

    laserInterval = setInterval(() => {
        laserTime++;

        if (laserTime >= 7 || !isHolding) {
            stopLaserFiring();
        }
    }, 1037);

    startLaserSound();
    laserShoot();
}
function resolveLaserImpactKeys(hitX, hitY, dx, dy) {
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
function updateLaserBullet(i, b, deltaTime, hitKeysThisFrame) {
    if (!isHolding) {
        if (isCracking) onPressEnd();
        bullets.splice(i, 1);
        return true;
    }

    b.x = player.x;
    b.y = player.y;

    const dX = mouseX - player.x;
    const dY = mouseY - player.y;
    const len = Math.hypot(dX, dY) || 1;
    b.dx = dX / len;
    b.dy = dY / len;

    const lenToHit = raycast(
        player.x,
        player.y,
        b.dx,
        b.dy,
        2000,
        0
    );
    const impactLen = Math.max(0, lenToHit - 1);
    const hitX = player.x + b.dx * impactLen;
    const hitY = player.y + b.dy * impactLen;

    const hitKeys = resolveLaserImpactKeys(hitX, hitY, b.dx, b.dy);
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
            wallSmashSound.currentTime = 0;
            wallSmashSound.play().catch(() => { });
            laserHitTime.delete(hitKey);
        }
    }

    return true;
}
function finalizeLaserFrame(deltaTime, hitKeysThisFrame) {
    applyLaserCrackback(deltaTime, hitKeysThisFrame);
}