/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

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
function stopNodeSafe(node, when = audioCtxCRK.currentTime) {
    if (!node) return;
    try {
        node.stop(when);
    } catch (_) {
        // ignore repeated stop calls
    }
}
function clearActiveSources() {
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
function playBufferOnce(buffer, when = audioCtxCRK.currentTime, offset = 0) {
    const src = audioCtxCRK.createBufferSource();
    src.buffer = buffer;
    src.connect(masterGain);
    src.start(when, offset);
    return src;
}
function startLooping(buffer, when) {
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
    pressToken += 1;
    const token = pressToken;
    isCracking = true;

    await audioCtxCRK.resume();
    const { start, loop } = await ensureBuffers();
    if (token !== pressToken || !isCracking) return;

    clearActiveSources();

    const now = audioCtxCRK.currentTime;
    activeStart = playBufferOnce(start, now, 0);
    const loopWhen = now + start.duration;
    startLooping(loop, loopWhen);
}
async function onPressEnd() {
    if (!canvas) return;
    pressToken += 1;
    isCracking = false;

    await audioCtxCRK.resume();
    const { end } = await ensureBuffers();

    clearActiveSources();
    playBufferOnce(end, audioCtxCRK.currentTime, 0);
}
async function startLaserSound() {
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
        laserShootSound.play();
    }
}
function stopLaserSound() {
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