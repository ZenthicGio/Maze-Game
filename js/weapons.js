/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function syncWeaponProfile() {
    const activeRailgun = command.railgunMode && modeIndex === 2;
    bulletColor = activeRailgun ? bulletColorRailgun : bulletColorNormal;
    bs = 4 + (perk.stats.bullets.speed / 2);
    aim = activeRailgun && wasdonly ? 1000 : 120;
}
function disablePickupRailgun() {
    railgun.activeByPickup = false;
    railgun.shotsLeft = 0;
    railgun.pendingDisable = false;
    command.railgunMode = false;
    command.bulletCollisionWall = railgun.prevBulletCollisionWall;
    if (modeIndex === 2) modeIndex = 0;
    syncWeaponProfile();
}
document.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});
let animationId = null;
function shoot() { // Crea un proiettile con auto-aim se un nemico è vicino

    const isRailgunShot = modeIndex === 2;

    if (isRailgunShot) {
        if (!command.railgunMode) return;
        if (railgun.shotsLeft <= 0) {
            railgun.pendingDisable = true;
            return;
        }
    } else {
        if (isReloading) return;

        // Se non ho colpi nel caricatore
        if (bulletsMag <= 0) return;

        bulletsMag--;
        if (bulletsMag <= 0 && magazine > 0) reload();
    }

    totalShots++;

    if (modeIndex === 0) {
        shootSound.currentTime = 0;
        shootSound.volme = 0.5;
        shootSound.playbackRate = 4;
        shootSound.play();
    } else if (modeIndex === 2) {
        railgunShootSound.currentTime = 0;
        railgunShootSound.play();
    }

    let dx, dy;

    if (wasdonly) {
        const AUTO_AIM_RADIUS = aim; // distanza massima auto aim
        let closestEnemy = null;
        let closestDist = AUTO_AIM_RADIUS * AUTO_AIM_RADIUS;

        // cerca nemico pi� vicino
        for (let enemy of enemies) {

            const dX = enemy.x - player.x;
            const dY = enemy.y - player.y;

            const distSq = dX ** 2 + dY ** 2;

            if (distSq < closestDist) { // Tiene agganciato il pi� vicino
                closestDist = distSq;
                closestEnemy = enemy;
            }
        }

        if (closestEnemy) {
            // auto aim attivo
            dx = closestEnemy.x - player.x;
            dy = closestEnemy.y - player.y;

            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        } else {
            // sparo normale
            dx = Math.cos(player.angle);
            dy = Math.sin(player.angle);
        }
    } else if (wasddirectionmouseaim || mousedirection) {
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
    }

    // crea il proiettile
    bullets.push({
        x: player.x,
        y: player.y,
        dx: dx,
        dy: dy,
        speed: isRailgunShot ? 0 : bs,
        isPistol: !isRailgunShot,
        isLaser: false,
        isRailgun: isRailgunShot,
        canDamage: isRailgunShot,
        life: isRailgunShot ? railgunLifetime : Infinity,
        hit: false
    });
    if (isRailgunShot) {
        railgun.shotsLeft--;
        if (railgun.shotsLeft <= 0) {
            railgun.pendingDisable = true;
        }
    }

    // genera evento sonoro
    const playerRow = Math.floor(player.y / cell_size);
    const playerCol = Math.floor(player.x / cell_size);

    noiseEvent = {
        row: playerRow,
        col: playerCol,
        timer: 3.0 // secondi di validit� del rumore
    };
}
function laserShoot() {
    const hasLaser = bullets.some(b => b.isLaser);
    if (hasLaser) return;

    let dx, dy;

    if (wasdonly) {
        dx = Math.cos(player.angle);
        dy = Math.sin(player.angle);
    } else {
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
    }

    bullets.push({
        x: player.x,
        y: player.y,
        dx: dx,
        dy: dy,
        isPistol: false,
        isLaser: true,
        isRailgun: false,
        r1: 1,
        r2: 1
    });
}
function reload() { // Gestisce l'autoricarica dell'arma
    if (isReloading) return;
    if (magazine <= 0) return;
    magPickupSound.currentTime = 0;
    magPickupSound.playbackRate = 1;
    magPickupSound.play();

    magazine--;
    isReloading = true;
    reloadTimer = reloadTime
}