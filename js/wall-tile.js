/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

const wallSolo = new Image();
wallSolo.src = "tiles/wall_solo.png";

const wallOneOpen = new Image();
wallOneOpen.src = "tiles/wall_one_open.png";

const wallTwoOpposite = new Image();
wallTwoOpposite.src = "tiles/wall_two_opposite.png";

const wallCorner = new Image();
wallCorner.src = "tiles/wall_corner.png";

const wallThreeOpen = new Image();
wallThreeOpen.src = "tiles/wall_three_open.png";

const wallFourOpen = new Image();
wallFourOpen.src = "tiles/wall_four_open.png";

function drawWallTile(row, col, size) {
    function wallMask(r, c) {
        let mask = 0;
        if (r > 0 && maze[r - 1][c] === 1) mask |= 1;
        if (c < cols - 1 && maze[r][c + 1] === 1) mask |= 2;
        if (r < rows - 1 && maze[r + 1][c] === 1) mask |= 4;
        if (c > 0 && maze[r][c - 1] === 1) mask |= 8;
        return mask;
    }

    function wallTile(mask) {
        switch (mask) {
            case 0: return { sprite: wallSolo, rot: 0 };

            // 1 vicino
            case 2: return { sprite: wallOneOpen, rot: 0 };               // E
            case 4: return { sprite: wallOneOpen, rot: Math.PI / 2 };     // S
            case 8: return { sprite: wallOneOpen, rot: Math.PI };         // W
            case 1: return { sprite: wallOneOpen, rot: -Math.PI / 2 };    // N

            // 2 opposti
            case 10: return { sprite: wallTwoOpposite, rot: 0 };           // E-W
            case 5: return { sprite: wallTwoOpposite, rot: Math.PI / 2 }; // N-S

            // 2 ad angolo
            case 6: return { sprite: wallCorner, rot: 0 };                // E-S
            case 12: return { sprite: wallCorner, rot: Math.PI / 2 };      // S-W
            case 9: return { sprite: wallCorner, rot: Math.PI };          // W-N
            case 3: return { sprite: wallCorner, rot: -Math.PI / 2 };     // N-E

            // 3 vicini
            case 14: return { sprite: wallThreeOpen, rot: 0 };             // E-S-W (chiuso N)
            case 13: return { sprite: wallThreeOpen, rot: Math.PI / 2 };   // S-W-N (chiuso E)
            case 11: return { sprite: wallThreeOpen, rot: Math.PI };       // W-N-E (chiuso S)
            case 7: return { sprite: wallThreeOpen, rot: -Math.PI / 2 };  // N-E-S (chiuso W)

            case 15: return { sprite: wallFourOpen, rot: 0 };
            default: return { sprite: wallSolo, rot: 0 };
        }
    }

    function drawTileRotated(img, x, y, size, rot) {
        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);
        ctx.rotate(rot);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
    const mask = wallMask(row, col);
    const t = wallTile(mask);
    const x = col * size;
    const y = row * size;

    if (t.sprite.complete && t.sprite.naturalWidth > 0) {
        drawTileRotated(t.sprite, x, y, size, t.rot);
    } else {
        ctx.fillStyle = wall_color;
        ctx.fillRect(x, y, size, size);
    }
}