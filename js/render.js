/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */
function drawFogOfWar() {
    if (!fogCtx || !fogCanvas) return;

    fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
    if (!fogOfWar.enabled) return;

    fogCtx.save();
    fogCtx.fillStyle = fogOfWar.color;
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

    fogCtx.globalCompositeOperation = "destination-out";

    const outer = Math.max(player.radius * 2.2, fogOfWar.radius);
    const inner = Math.max(player.radius * 1.1, outer - fogOfWar.edgeSoftness);

    const g = fogCtx.createRadialGradient(player.x, player.y, inner, player.x, player.y, outer);
    g.addColorStop(0, "rgba(0, 0, 0, 1)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");

    fogCtx.fillStyle = g;
    fogCtx.beginPath();
    fogCtx.arc(player.x, player.y, outer, 0, Math.PI * 2);
    fogCtx.fill();
    fogCtx.restore();
}
function drawMagazines() { // Disegna i pickable dei caricatori
    for (const m of magazines) {
        ctx.fillStyle = "rgba(0, 128, 0, 0.5)";
        ctx.fillRect(
            m.col * cell_size + (cell_size - cell_size * 1.2) / 2,
            m.row * cell_size + (cell_size - cell_size * 1.2) / 2,
            cell_size * 1.2,
            cell_size * 1.2
        );
        ctx.fillStyle = "rgba(0, 128, 0, 1)";
        ctx.fillRect(
            m.col * cell_size,
            m.row * cell_size,
            cell_size,
            cell_size
        );

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 192, 0, 1)";
        ctx.ellipse(m.col * cell_size + 4, m.row * cell_size + 7, 1.5, 6, 0, Math.PI / 2, -Math.PI / 2)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 192, 0, 1)";
        ctx.ellipse(m.col * cell_size + 10, m.row * cell_size + 7, 1.5, 6, 0, Math.PI / 2, -Math.PI / 2)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 192, 0, 1)";
        ctx.ellipse(m.col * cell_size + 16, m.row * cell_size + 7, 1.5, 6, 0, Math.PI / 2, -Math.PI / 2)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 128, 0, 1)";
        ctx.ellipse(m.col * cell_size + 4, m.row * cell_size + 7, 1.5, 6, 0, -Math.PI / 2, Math.PI / 2)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 128, 0, 1)";
        ctx.ellipse(m.col * cell_size + 10, m.row * cell_size + 7, 1.5, 6, 0, -Math.PI / 2, Math.PI / 2)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 128, 0, 1)";
        ctx.ellipse(m.col * cell_size + 16, m.row * cell_size + 7, 1.5, 6, 0, -Math.PI / 2, Math.PI / 2)
        ctx.fill();

        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 0, 1)";
        ctx.moveTo(m.col * cell_size + 3, m.row * cell_size + 8);
        ctx.lineTo(m.col * cell_size + 3, m.row * cell_size + 19);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 0, 1)";
        ctx.moveTo(m.col * cell_size + 9, m.row * cell_size + 8);
        ctx.lineTo(m.col * cell_size + 9, m.row * cell_size + 19);
        ctx.lineWidth = 2;
        ctx.stroke(); ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 0, 1)";
        ctx.moveTo(m.col * cell_size + 15, m.row * cell_size + 8);
        ctx.lineTo(m.col * cell_size + 15, m.row * cell_size + 19);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 211, 0, 1)";
        ctx.moveTo(m.col * cell_size + 5, m.row * cell_size + 8);
        ctx.lineTo(m.col * cell_size + 5, m.row * cell_size + 19);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 211, 0, 1)";
        ctx.moveTo(m.col * cell_size + 11, m.row * cell_size + 8);
        ctx.lineTo(m.col * cell_size + 11, m.row * cell_size + 19);
        ctx.lineWidth = 2;
        ctx.stroke(); ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 211, 0, 1)";
        ctx.moveTo(m.col * cell_size + 17, m.row * cell_size + 8);
        ctx.lineTo(m.col * cell_size + 17, m.row * cell_size + 19);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
function drawBatteries() {
    for (const bt of batteries) {
        const x = bt.col * cell_size,
            y = bt.row * cell_size;
        ctx.save();
        ctx.translate(x, y);

        ctx.beginPath();
        ctx.filter = "blur(3px)";
        ctx.fillStyle = "rgba(0,255,255,0.5)";
        ctx.arc(10, 10, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "rgba(40,40,70,1)";
        ctx.fillRect(5, 9, 5, 9);
        ctx.fillStyle = "rgba(20,20,35,1)";
        ctx.fillRect(10, 9, 5, 9);
        ctx.fillStyle = "rgba(180,180,0,1)";
        ctx.fillRect(5, 4, 5, 5);
        ctx.fillStyle = "rgba(150,150,0,1)";
        ctx.fillRect(10, 4, 5, 5);
        ctx.fillStyle = "rgba(180,180,180,1)";
        ctx.fillRect(7, 2, 3, 2);
        ctx.fillStyle = "rgba(170,170,170,1)";
        ctx.fillRect(10, 2, 3, 2);

        ctx.fillStyle = "rgba(255, 255, 0, 1)"
        ctx.beginPath();
        ctx.moveTo(11, 10);
        ctx.lineTo(8, 14);
        ctx.lineTo(10, 14);
        ctx.lineTo(9, 17);
        ctx.lineTo(12, 13);
        ctx.lineTo(10, 13);
        ctx.fill();
        ctx.restore();
    }
}
function startSP() {
    const d1 = Math.hypot(player.x, player.y);
    const d2 = Math.hypot(gameCanvas.width - player.x, player.y);
    const d3 = Math.hypot(player.x, gameCanvas.height - player.y);
    const d4 = Math.hypot(gameCanvas.width - player.x, gameCanvas.height - player.y);

    spsr = Math.max(d1, d2, d3, d4) + 30; // > canvas
    sps = performance.now();
    spa = true;
}
function drawSP() {
    if (!spa) return;

    const t = (performance.now() - sps) / (spd * 1000);
    if (t >= 1) {
        spa = false;
        return;
    }

    const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const r = spsr + (player.radius - spsr) * ease;

    ctx.save();
    ctx.strokeStyle = `rgba(0, 220, 255, ${1 - t})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(player.x, player.y, Math.max(r, player.radius), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}
function drawKeys() { // Disegna le chiavi pickable
    // Disegno dei pickup
    for (const p of pickup) {

        const x = p.col * cell_size,
            y = p.row * cell_size;
        ctx.save();
        ctx.translate(x, y);

        ctx.filter = "blur(1px)";
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 165, 0, 0.4)";
        ctx.arc(cell_size / 2, cell_size / 2, cell_size * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 200, 0, 0.6)";
        ctx.arc(cell_size / 2, cell_size / 2, cell_size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.arc(cell_size / 2, cell_size / 2, cell_size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
function drawRailgunPickup() { // Disegna il pickup della railgun
    if (!railgun.pickup) return;

    const r = railgun.pickup.row;
    const c = railgun.pickup.col;
    const cx = c * cell_size + cell_size / 2;
    const cy = r * cell_size + cell_size / 2;

    ctx.fillStyle = "rgba(0, 170, 255, 0.30)";
    ctx.fillRect(
        c * cell_size + (cell_size - cell_size * 1.3) / 2,
        r * cell_size + (cell_size - cell_size * 1.3) / 2,
        cell_size * 1.3,
        cell_size * 1.3
    );

    ctx.fillStyle = "rgba(0, 220, 255, 0.95)";
    ctx.fillRect(c * cell_size, r * cell_size, cell_size, cell_size);

    ctx.beginPath();
    ctx.fillStyle = "rgba(220, 255, 255, 1)";
    ctx.arc(cx, cy, cell_size * 0.22, 0, Math.PI * 2);
    ctx.fill();
}
function drawMeds() {
    for (const m of meds) {
        const x = m.col * cell_size,
            y = m.row * cell_size;
        ctx.save();
        ctx.translate(x, y);
        ctx.filter = "blur(3px)";
        ctx.fillStyle = "rgba(0,255,0,0.3)";
        ctx.beginPath();
        ctx.arc(10, 10, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = "blur(0px)"
        ctx.fillStyle = "rgb(0,128,0)";
        ctx.fillRect(7, 2, 6, 16);
        ctx.fillRect(2, 7, 16, 6);
        ctx.filter = "blur(2px)";
        ctx.fillStyle = "rgb(0,255,0)";
        ctx.fillRect(9, 4, 2, 12);
        ctx.fillRect(4, 9, 12, 2);
        ctx.restore();

    }
}
function drawTrail() {// Disegna il Trail
    function left() {
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(3, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    function right() {
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(3, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    for (let i = trail.length - 1; i >= 0; i--) { // Loop in riduzione per poter rimuovere con splice
        let t = trail[i]; // Impronta corrente

        ctx.save(); // Salva lo stato corrente del canvas
        ctx.translate(t.x, t.y); // Sposta il sistema di riferimento nella posizione dell'impronta
        ctx.rotate(t.angle + (t.side * 0.25)); // Orienta le impronte nella direzione di movimento


        ctx.fillStyle = `rgba(168, 168, 168, ${t.life / 120})`;
        t.side === 1 ? right() : left();

        ctx.restore(); // Ripristina lo stato

        t.life--; // Riduzione

        if (t.life <= 0) trail.splice(i, 1); // Rimuove l'impronta dall'array
    }
}
function drawMaze() { // Disegna tutto su canvas
    function getLaserBreakProgress(row, col) {
        if (maze[row][col] !== 1) return 0;
        const hitKey = `${row},${col}`;
        const hitMs = laserHitTime.get(hitKey) || 0;
        return Math.min(hitMs / laserCellBreakMs, 1);
    }
    function drawWallCracks(row, col, progress) {
        if (progress <= 0) return;

        const x = col * cell_size;
        const y = row * cell_size;
        const cx = x + cell_size / 2;
        const cy = y + cell_size / 2;

        const alpha = 0.2 + (0.75 * progress);
        const lineW = 0.7 + (2.2 * progress);
        const mainLen = cell_size * (0.15 + 0.38 * progress);
        const branchLen = cell_size * (0.08 + 0.24 * progress);

        const dirs = [
            [0.0, -1.0],
            [0.9, -0.35],
            [1.0, 0.2],
            [0.62, 0.82],
            [-0.3, 1.0],
            [-0.86, 0.44],
            [-1.0, -0.2],
            [-0.62, -0.82]
        ];

        ctx.save();
        ctx.strokeStyle = `rgba(128, 255, 255, ${alpha})`;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < dirs.length; i++) {
            const [dx, dy] = dirs[i];
            const lenMul = 0.72 + (((i * 37) % 29) / 100);

            const ex = cx + dx * mainLen * lenMul;
            const ey = cy + dy * mainLen * lenMul;

            ctx.lineWidth = lineW;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(ex, ey);
            ctx.stroke();

            const bx = cx + dx * mainLen * lenMul * 0.62;
            const by = cy + dy * mainLen * lenMul * 0.62;

            const perpX = -dy;
            const perpY = dx;

            const side = (i % 2 === 0) ? 1 : -1;
            const bdx = (dx * 0.72 + perpX * 0.45 * side);
            const bdy = (dy * 0.72 + perpY * 0.45 * side);

            const blen = branchLen * (0.72 + (((i * 19) % 23) / 100));

            ctx.lineWidth = Math.max(0.6, lineW * 0.78);
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + bdx * blen, by + bdy * blen);
            ctx.stroke();
        }

        ctx.restore();
    }
    // Pulisce il canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Disegna il labirinto
    for (let row = 0; row < rows; row++) { // Ciclo righe
        for (let col = 0; col < cols; col++) { // Ciclo colonne
            ctx.fillStyle = maze[row][col] === 1 ? wall_color : path_color; // Se cella = 1 allora wall, se cella = 0 allora path

            // Se il goal � attivo colora la cella di verde
            if (goalActive && row === goal.row && col === goal.col) {
                ctx.fillStyle = "green";
                ctx.fillRect(
                    col * cell_size,
                    row * cell_size,
                    cell_size,
                    cell_size
                );
            }
            else if (maze[row][col] === 1) drawWallTile(row, col, cell_size) //ctx.fillStyle = wall_color;
            else {
                ctx.fillStyle = path_color;
                ctx.fillRect(
                    col * cell_size,
                    row * cell_size,
                    cell_size,
                    cell_size
                );
            }


            // Disegna il rettangolo della cella
            /*ctx.fillRect(
                col * cell_size,
                row * cell_size,
                cell_size,
                cell_size
            );*/

            // Overlay crepe durante il cracking laser
            if (maze[row][col] === 1) {
                const breakProgress = getLaserBreakProgress(row, col);
                if (breakProgress > 0) {
                    drawWallCracks(row, col, breakProgress);
                }
            }
        }
    }

    drawTrail();
    drawKeys();
    drawMagazines();
    drawBatteries();
    drawMeds()
    drawRailgunPickup();
    drawBullets();
    drawSP();
    drawPlayerHealth();
    drawRespawnTimer(respawnTimer, tl);
    drawPlayer();
    drawEnemies();
    drawEnemyState();
    drawFogOfWar();
}
function drawBullets() { // Disegno proiettili
    for (let b of bullets) { // Railgun

        const angle = Math.atan2(b.dy, b.dx);

        if (b.isRailgun) {

            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(angle);

            ctx.globalAlpha = b.life / railgunLifetime;

            ctx.beginPath();
            ctx.fillStyle = bulletColor[0];
            ctx.ellipse(8, 0, 12, 6, 0, Math.PI / 2, -Math.PI / 2)
            ctx.fill();
            ctx.fillRect(8, -6, 1000, 12);

            ctx.beginPath();
            ctx.fillStyle = bulletColor[1];
            ctx.ellipse(8, 0, 10, 4, 0, Math.PI / 2, -Math.PI / 2)
            ctx.fill();
            ctx.fillRect(8, -4, 1000, 8);

            ctx.beginPath();
            ctx.fillStyle = bulletColor[2];
            ctx.ellipse(8, 0, 8, 2, 0, Math.PI / 2, -Math.PI / 2)
            ctx.fill();
            ctx.fillRect(8, -2, 1000, 4);

            ctx.restore();

        } else if (b.isPistol) { // Normali

            let color1, color2, color3;
            if (perk.stats.bullets.damage >= 1) {
                bulletSize = 0.5
                color1 = bulletColor[3];
                color2 = bulletColor[4];
                color3 = bulletColor[5];
            } else {
                bulletSize = 0;
                color1 = bulletColor[0]
                color2 = bulletColor[1]
                color3 = bulletColor[2]
            }
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.fillStyle = color1;
            ctx.ellipse(0, 0, bulletSize * 6 + 12, bulletSize + 4.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = color2;
            ctx.ellipse(0, 0, bulletSize * 4 + 8, bulletSize + 3, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = color3;
            ctx.ellipse(0, 0, bulletSize * 2 + 4, bulletSize + 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        } else if (b.isLaser) {

            const px = player.x;
            const py = player.y;
            const vector = Math.sqrt((cx - px) ** 2 + (cy - py) ** 2);
            const invVector = Math.sqrt(px ** 2 + py ** 2);
            const P1 = -Math.PI / 4;
            const P2 = Math.PI / 4 * 3;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(player.angle);

            let cLen;

            if (angle > P1 && angle <= P2) cLen = vector;
            else if (angle <= P1 || angle > P2) cLen = invVector;

            const len = raycast(
                px,
                py,
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
    }
}
function drawRespawnTimer(timer, length) {

    if (timer > 0) {
        ctx.save();
        ctx.translate(player.x, player.y);

        const text = String(Math.trunc(timer));

        ctx.globalAlpha;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        const m = ctx.measureText(text);
        const boxWidth = Math.ceil(m.width) + 10;
        const boxHeight = 18;
        const x = -boxWidth / 2;
        const y = -(player.radius + 19) - boxHeight + 4
        ctx.fillRect(x, y, boxWidth, boxHeight)

        ctx.fillStyle = "rgba(128, 255, 255, 1)";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, 0, -(player.radius + 18));

        ctx.strokeStyle = "rgba(128, 255 ,255, 0.5)";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.arc(
            0,
            0,
            player.radius + 12,
            -Math.PI / 2,
            Math.PI + (Math.PI / 2) - ((length - timer) / length) * Math.PI * 2
        )
        ctx.stroke();
        ctx.restore();

        return;
    }
}
function drawPlayerHealth() {
    const r = player.radius + 12;
    const maxH = Math.max(1, Math.trunc(player.maxHealth));
    const start = -Math.PI / 2;
    const full = Math.PI * 2;
    const seg = full / maxH;
    const gap = Math.min(0.08, seg * 0.25);
    const shown = Math.max(0, Math.min(player.displayH, player.maxHealth));

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.lineWidth = 4;
    ctx.lineCap = "butt";

    for (let i = 0; i < maxH; i++) {
        const a0 = start + i * seg + gap / 2;
        const a1 = start + (i + 1) * seg - gap / 2;

        ctx.strokeStyle = "rgba(0,0,255,0.25)";
        ctx.beginPath();
        ctx.arc(0, 0, r, a0, a1);
        ctx.stroke();

        const unit = Math.max(0, Math.min(1, shown - i));
        if (unit > 0) {
            ctx.strokeStyle = "rgba(0,0,255,1)";
            ctx.beginPath();
            ctx.arc(0, 0, r, a0, a0 + (a1 - a0) * unit);
            ctx.stroke();
        }
    }

    ctx.restore();
}
function drawPlayer() { // Disegno del player

    ctx.save(); // Salva stato
    ctx.translate(player.x, player.y); // Sposta il sistema di riferimento nella posizione del player
    ctx.rotate(player.angle); // Ruota in base all'angolo del player

    ctx.fillStyle = "blue";

    // corpo (cerchio pieno)
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Punta/direzione
    ctx.beginPath();
    ctx.moveTo(player.radius * 1.8, 0);
    ctx.lineTo(player.radius - (player.radius / 1.5), -player.radius + 1);
    ctx.lineTo(0, -player.radius + 0.8);
    ctx.lineTo(0, player.radius - 0.8);
    ctx.lineTo(player.radius - (player.radius / 1.5), player.radius - 1);
    ctx.closePath();
    ctx.fill();


    ctx.restore(); // Ripristina stato

    if (stamina.alpha > 0) {
        ctx.save();
        ctx.translate(player.x, player.y);

        ctx.globalAlpha = stamina.alpha;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.arc(
            0,
            0,
            player.radius + 8,
            -Math.PI / 2,
            -Math.PI / 2 + stamina.length * Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
    }
}
function drawEnemies() { // Disegna i nemici
    // Disegno dei nemici (Da modificare e rendere unica con funzione entit�)
    for (let enemy of enemies) {

        const er = enemy.radius;

        ctx.save();
        ctx.translate(enemy.x - 10, enemy.y);
        ctx.beginPath();
        ctx.strokeStyle = "rgb(255,0,0)";
        ctx.moveTo(0, -9.5);
        ctx.lineTo(enemy.life * 10, -9.5);
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.moveTo(0, -12);
        ctx.lineTo(0, -7);
        ctx.lineTo(20, -7);
        ctx.lineTo(20, -12);
        ctx.lineTo(0, -12);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, -12);
        ctx.lineTo(10, -7);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.angle);

        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.arc(0, 0, er, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(er * 1.8, 0);
        ctx.lineTo(er - (er / 1.5), -er + 1);
        ctx.lineTo(0, -er + 0.8);
        ctx.lineTo(0, er - 0.8);
        ctx.lineTo(er - (er / 1.5), er - 1);
        ctx.closePath();
        ctx.fill();

        const gradient = ctx.createRadialGradient(
            0, 0, 0, // centro
            0, 0, er * cell_size // raggio
        );

        // centro più visibile
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.1)");

        // bordo trasparente
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(0, 0, er * cell_size, 72.5 * -Math.PI / 180, 72.5 * Math.PI / 180);
        ctx.lineTo(Math.cos(72.5 * -Math.PI / 180), Math.sin(72.5 * -Math.PI / 180));
        ctx.lineTo(-Math.cos(72.5 * -Math.PI / 180), -Math.sin(72.5 * -Math.PI / 180));
        ctx.closePath();
        ctx.fill()

        ctx.restore();
    }
}
function drawEnemyState() { // Disegna lo stato del nemico
    // Punto esclamativo
    for (let enemy of enemies) {
        if (!enemy.color) continue;
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.beginPath();
        ctx.fillStyle = enemy.color;
        ctx.arc(0, -20, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = enemy.color;
        ctx.moveTo(0, -26)
        ctx.lineTo(0, -40);
        ctx.lineCap = "round";
        ctx.lineWidth = 6
        ctx.stroke();
        ctx.restore();
    }
}