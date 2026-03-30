/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function startGeneration() { // Inizia la generazione del labirinto con algoritmo Prim

    generating = true; // attiva modalità generazione
    frontier = []; // svuota lista frontier

    const startRow = cellRowRandom;
    const startCol = cellColRandom;

    maze[startRow][startCol] = 0; // rende la prima cella aperta

    addFrontier(startRow, startCol); // aggiunge felle frontier iniziali
}
function addFrontier(r, c) { // Aggiunge le celle frontier (a distanza 2 dalla cella corrente)

    // celle a distanza 2
    const dirs = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];

    for (let [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // controlla che siano dentro i limiti e che sia ancora muro
        if (
            nr > 0 && nr < rows - 1 &&
            nc > 0 && nc < cols - 1 &&
            maze[nr][nc] === 1
        ) {
            // salva anche la cella parent (r, c)
            frontier.push([nr, nc, r, c]);
        }
    }
}
function stepGeneration() { // Esegue un singolo passo della generazione

    // se non ci sono più frontier → fine
    if (frontier.length === 0) {
        generating = false;
        finishGeneration();
        return;
    }
    // sceglie una frontier casuale
    const index = Math.floor(Math.random() * frontier.length);
    const [r, c, pr, pc] = frontier.splice(index, 1)[0];

    // se è ancora muro
    if (maze[r][c] === 1) {

        maze[r][c] = 0;

        // apre il muro tra parent e child
        maze[(r + pr) / 2][(c + pc) / 2] = 0;

        addFrontier(r, c); // aggiunge nuove frontier
    }
}
function finishGeneration() { // Completa la generazione del labirinto. Sceglie la cella più lontana come GOAL (BFS). Posiziona le chiavi nei vicoli ciechi. Attiva lo spawn dei nemici

    // Calcola le distanze reali dal punto di partenza (cellRowRandom, cellColRandom)
    const startR = cellRowRandom, startC = cellColRandom;
    const dist = bfsDistances(startR, startC);

    // Trova la cella aperta più lontana
    let best = -1;
    let farCells = [];

    // Scorre tutta la griglia
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            // Considera solo le celle aperte
            if (maze[r][c] !== 0) continue;

            // Se trova una distanza maggiore, aggiorna
            if (dist[r][c] > best) {
                best = dist[r][c];
                farCells = [[r, c]];
            }
            // Se ha stessa distanza massima, la aggiunge
            else if (dist[r][c] === best) {
                farCells.push([r, c]);
            }
        }
    }

    // Sceglie casualmente tra le più lontane
    const pick = farCells[Math.floor(Math.random() * farCells.length)];
    goal.row = pick[0];
    goal.col = pick[1];

    // Posiziona le hiavi nei vicoli ciechi
    const playerSpawnKey = "1,1";
    const exclude = new Set([`${startR},${startC}`, `${goal.row},${goal.col}`, playerSpawnKey]);
    let dead = getDeadEnds(exclude);

    // shuffle
    dead.sort(() => Math.random() - 0.5);

    let keyRandom = Math.floor(Math.random() * 10) + 1; // Se Math.random() = 0, + 1 garantisce che ci sia almeno una chiave nel labirinto.

    // Salva il numero totale di chiavi
    totalKeys = keyRandom;
    const KEY_COUNT = keyRandom;

    // Seleziona le celle dove mettere le chiavi
    const posKey = (r, c) => `${r},${c}`;
    const occupied = new Set([
        posKey(startR, startC),
        posKey(goal.row, goal.col),
        "1,1"
    ]);

    const takeDeadCells = (count) => {
        const free = dead.filter(([r, c]) => !occupied.has(posKey(r, c)));
        const chosen = free.slice(0, Math.min(count, free.length));
        for (const [r, c] of chosen) occupied.add(posKey(r, c));
        return chosen;
    };

    // Keys
    pickup = takeDeadCells(KEY_COUNT).map(([r, c]) => ({ row: r, col: c }));
    initialPickups = pickup.map(p => ({ row: p.row, col: p.col }));
    pickupRemaining = pickup.length;

    // Magazines
    const magRnd = Math.floor(Math.random() * 2) + 1;
    const magCount = magRnd;
    magazines = takeDeadCells(magCount).map(([r, c]) => ({ row: r, col: c }));
    initialMagazines = magazines.map(m => ({ row: m.row, col: m.col }));

    // Batteries
    batteries = takeDeadCells(1).map(([r, c]) => ({ row: r, col: c }));
    initialBatteries = batteries.map(bt => ({ row: bt.row, col: bt.col }));

    // Meds
    meds = takeDeadCells(1).map(([r, c]) => ({ row: r, col: c }));
    initialMeds = meds.map(m => ({ row: m.row, col: m.col }));

    // Railgun
    railgun.pickup = null;
    const railgunEligible = !railgun.activeByPickup && levels >= railgun.nextSpawnLevel;
    if (railgunEligible) {
        const railgunCandidates = dead.filter(([r, c]) => !occupied.has(posKey(r, c)));
        if (railgunCandidates.length > 0) {
            const [rr, rc] = railgunCandidates[Math.floor(Math.random() * railgunCandidates.length)];
            railgun.pickup = { row: rr, col: rc };
            occupied.add(posKey(rr, rc));
        }
    }


    // Attiva il goal solo se non ci sono chiavi
    goalActive = (pickupRemaining === 0);
    if (!command.peacefulMode) {
        levelEnemyCount = Math.floor(Math.random() * diff_enemy_num) + 2; // Numero randomico di nemici, minimo 2
        spawnEnemies(levelEnemyCount);
    }
    else {
        enemies = [];
        levelEnemyCount = 0;
    }
}
function spawnEnemies(enemy_count) { // Genera un numero randomico di nemici. I nemici vengono posizionati lontano dal punto iniziale
    enemies = [];

    const playerRow = Math.floor(player.y / cell_size);
    const playerCol = Math.floor(player.x / cell_size);

    // Calcola distanza dal player
    const dist = bfsDistances(playerRow, playerCol);
    let farCells = [];

    // Trova celle aperte abbastanza lontane
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (maze[r][c] !== 0) continue;
            if (r === playerRow && c === playerCol) continue; // Impedisce lo spawn nella cella del player
            if (dist[r][c] > minDist) farCells.push([r, c]);
        }
    }
    if (farCells.length === 0) { levelEnemyCount = 0; return; }
    // Crea i nemici
    for (let i = 0; i < enemy_count; i++) {
        const pick = farCells[Math.floor(Math.random() * farCells.length)];
        enemiesPush(pick[0], pick[1])
    }
}
function spawnOneEnemy() { // Spawna 1 singolo nemico quando muore. Calocola distanze dal player (BFS). Sceglie una cella aperta abbastanza lontana dal player. Evita la cella iniziale (1, 1)

    // Converte posizione del player in coordinate griglia
    const playerRow = Math.floor(player.y / cell_size);
    const playerCol = Math.floor(player.x / cell_size);

    // BFS: distanza minima di ogni cella dal player
    const dist = bfsDistances(playerRow, playerCol);

    let validCells = [];

    // Cerca celle valide in tutta la griglia
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            // Solo celle aperte
            if (maze[r][c] !== 0) continue;

            // Evita spawn nella cella [1, 1]
            if (r === 1 && c === 1) continue;

            // Deve essere abbastanza lontano dal player
            if (dist[r][c] > minDist) {
                validCells.push([r, c]);
            }
        }
    }

    // Se non ci sono celle valide, esce
    if (validCells.length === 0) return;

    // Sceglie una cella casuale tra quelle valide
    const pick = validCells[Math.floor(Math.random() * validCells.length)];

    enemiesPush(pick[0], pick[1])
}
function enemiesPush(row, col) { // Crea il nemico in coordinate pixel (centro della cella)
    enemies.push({
        x: col * cell_size + cell_size / 2,
        y: row * cell_size + cell_size / 2,
        radius: player.radius,
        speed: diff_speed,
        angle: 0,
        state: "wander",
        target: null,
        wanderTarget: null,
        memoryTimer: 0,
        memoryDuration: md,
        colors: {
            none: "rgba(0, 0, 0, 0)",
            yellow: "rgba(255, 255, 0, 1)",
            orange: "rgba(255, 128, 0, 1)",
            red: "rgba(255, 0, 0, 1)"
        },
        color: "",
        cachedDist: null,
        lastTarget: null,
        currentCellTarget: null,
        lastCell: null,
        life: 2
    });
}
function generateMaze() { //Resetta il labirinto e riavvia la generazione
    goalActive = false; // Disattiva il Goal

    // Riempie la griglia di muri (1)
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            maze[row][col] = wpValue;
        }
    }

    cellRowRandom = randomOdd(1, rows - 2);
    cellColRandom = randomOdd(1, cols - 2);
    // Reset del player nella cella [1, 1]
    player.x = cellColRandom * cell_size + cell_size / 2;
    player.y = cellRowRandom * cell_size + cell_size / 2;
    startSP();
    player.angle = 0;

    noiseEvent = null;
    noiseOwner = null;

    trail = []; // Reset del trail (scia del player)
    pickup = []; // Reset dei pickup
    bullets = []; // Reset dei proiettili se presenti
    batteries = []; // Reset delle batterie se presenti
    enemies = []; // Reset dei nemici
    enemyRespawnQueue = []; // Resetta la lista dei nemici in attesa di respawn
    magazines = []; // Reset dei caricatori
    railgun.pickup = null;
    lvl.textContent = "Level: 1";
    totalPickupsCollected = 0; // Reset dei pickups
    totalEnemiesKilled = 0
    pickupCounterEl.textContent = "Pickup: 0";

    startGeneration();
}