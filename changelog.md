----Add: something added
----Change: big edit
----Edit: minor edit
----Fix: known bug or unexpected behavior fixed
----Major: Major Change


0.0.0.x = Fix/Edit
0.0.x.0 = Change
0.x.0.0 = Add/Major Change
x.0.0.0 = Major Update

_________________________________________________________________________________________

                                        VERSIONS

________________________________________V1.0.0.0_________________________________________

Add:
  -Procedural maze generation.
  -Player.

________________________________________V1.1.0.0_________________________________________

Add:
  -Player movement X Y.
  -Player collision.

________________________________________V1.1.0.1_________________________________________

Fix:
  -Player movement stuck (when it hits the wall it blocks the player movement).

________________________________________V1.1.0.2_________________________________________

Fix:
  -Key combination player vector.

________________________________________V1.2.0.0_________________________________________

Add:
  -Goal keys.

Edit:
  -Player render restyle.

________________________________________V1.2.1.0_________________________________________

Changed:
  -Color restyling.

________________________________________V1.3.0.0_________________________________________

Add:
  -Difficulty system.
  -Trail.
  -Enemies.

________________________________________V1.3.0.1_________________________________________

Fix:
  -Enemy spawn.

________________________________________V1.3.0.2_________________________________________

Fix: 
  -Enemy movement.

________________________________________V1.3.0.3_________________________________________

Fix: 
  -Enemy collision to player.

________________________________________V1.4.0.0_________________________________________

Add:
  -Shot system.
  -Auto-Aim.

________________________________________V1.4.0.1_________________________________________

Fix:
  -Enemy doesn't reach player.

Edit:
  -Removed safezone.

________________________________________V1.4.1.0_________________________________________

Change:
  -From BFS to Prim.

Edit:
  -Enemy render restyle.
  -Goal keys render restyle.
  -Trail color restyle.

________________________________________V1.5.0.0_________________________________________

Add:
  -Sounds:
   -Keys.
   -Shot.
   -Kill.
   -Death.
   -Goal.

________________________________________V1.5.0.1_________________________________________

Fix:
  -Sounds pitch.

________________________________________V1.6.0.0_________________________________________

Change:
  -Enemy number now random for difficulty (min 2).
  -Key number now random.

Add:
  -Score.
  -Bullets counter.
  -Level counter.

________________________________________V1.6.0.1_________________________________________

Fix
  -Level UI starting from 0.
  -Score UI reset.
  -Bullet shots UI reset.

________________________________________V1.7.0.0_________________________________________

Add:
  -Step sound.

Edit:
  -Bullets render restyle.

________________________________________V1.7.0.1_________________________________________

Fix:
  -Player wall collision.

Edit:
  -"Esc" key added to pause.

________________________________________V1.8.0.0_________________________________________

Add:
  -Run holding "Shift".
  -Enemy AI.

Edit:
  -Running step sound.
  -Trail to footprints.

________________________________________V1.8.0.1_________________________________________

Fix:
  -Foot steps gap increase when running.
  -Enemy speed reset when player is out of range and enemy timer end.

Edit:
  -Maze generation speed increased.

________________________________________V1.8.0.2_________________________________________

Fix:
  -Game speed no longer x2.
  -Enemies stop chasing player.
  -Enemy wall collision.

Edit:
  -Enemy view angle increased.

________________________________________V1.8.1.0_________________________________________

Change:
  -Enemies spot player if shoot.
  -App icon changed.

________________________________________V1.8.1.1_________________________________________

Fix:
  -Enemy freeze during chasing.

________________________________________V1.8.1.2_________________________________________

Fix:
  -Enemy now reach player position.

________________________________________V1.9.0.0_________________________________________

Add:
  -Enemy investigation on shot.

Change:
  -Enemy AI improved.
  -Enemy don't reach player if he shoot and enemy don't see player.

________________________________________V1.10.0.0________________________________________

Add:
  -Stamina.

Change:
  -Keys now reset per level and show key count in maze.

________________________________________V1.10.0.1________________________________________

Edit:
  -Stamina bar is no longer visible on bottom of maze, now around player.

________________________________________V1.10.1.0________________________________________

Fix:
  -Enemies freeze during investigation time.
  -Key score reset on level complete.

Change:
  -Enemies show state.

Edit:
  -Enemy render restyle.
  -HUD "Pickups" replaced with "Keys".

________________________________________V1.11.0.0________________________________________

Add:
  -Limited ammo.
  -Pickable magazine into maze.
  -Magazine pickup sound.
  -Reloading system.
  -Ammo and Magazine counters.

Change:
  -Enemies no longer insta-spawn, now respawn in base of selected difficulty.

________________________________________V1.11.0.1________________________________________

Edit:
  -Player reload time change on seleced difficulty.

________________________________________V1.11.0.2________________________________________

Fix:
  -Magazine pickables do not despawn during maze generation.

________________________________________V1.12.0.0________________________________________

Add:
  -Command console.
  -Commands.

________________________________________V1.12.0.1________________________________________

Fix:
  -Enemies no longer reach player position in invisible mode.
  -Railgun mode not auto reload.

________________________________________V1.12.0.2________________________________________

Fix:
  -Projectiles not shown properly.
  -Autoreload now is working again.

________________________________________V1.12.0.3________________________________________

Fix:
  -Enemy queue no longer spawn enemies in new maze.

________________________________________V1.12.1.0________________________________________

Change:
  -Maze generation cell start is no longer from cell(1, 1).

________________________________________V1.12.2.0________________________________________

Change:
  -Code refactoring.

________________________________________V1.13.0.0________________________________________

Add:
  -Railgun pickable.

________________________________________V1.13.0.1________________________________________

Fix:
  -Railgun last shoot not shooting.

________________________________________V2.0.0.0_________________________________________

Major:
  -Player movement is combined now with mouse.

Edit:
  -Removed Auto-aim.
  -Shoot with LMB (Left Mouse Button).

________________________________________V2.0.0.1_________________________________________

Fix:
  -Player run fixed.

________________________________________V2.1.0.0_________________________________________

Add:
  -Player control gameplay selector.

________________________________________V2.1.0.1_________________________________________

Fix:
  -Stamina not working.

________________________________________V2.2.0.0_________________________________________

Add:
  -Laser beam can destroy walls.
  -Switch pistol/railgun to laser with RMB.

________________________________________V2.2.0.1_________________________________________

Fix:
  -Fixed bullet collision not working.

________________________________________V2.2.0.2_________________________________________

Fix:
  -Laser not working on direction change.

________________________________________V2.2.0.3_________________________________________

Fix:
  -Laser switch between weapons not working.

________________________________________V2.2.0.4_________________________________________

Fix:
  -Movement not working.

________________________________________V2.2.0.5_________________________________________

Fix:
  -Laser Aim in "↑←↓→ + Auto Aim" no longer look in mouse direction.

________________________________________V2.3.0.0_________________________________________

Add:
  -Invulnerability timer after death.
  -Difficulty invulnerability change.

________________________________________V2.3.0.0_________________________________________

Change:
  -Command railgun no longer work as pistol but with railgun shells.

________________________________________V2.3.1.1_________________________________________

Fix:
  -Laser Raycast now work properly.

________________________________________V2.3.1.2_________________________________________

Fix:
  -Laser beam no longer lag the game.

________________________________________V2.3.1.3_________________________________________

Fix:
  -Ammo and Magazine UI not showning correctly ammo and weapon type.

________________________________________V2.4.0.0_________________________________________

Add:
  -Breaking walls has chance to spawn magazines or enemies.

________________________________________V2.5.0.0_________________________________________

Major Change:
  -Enemies use now raycast to detect player.

Fix:
  -In "WASD + Mouse Direction" mode:
    -Player diagonal movement normalized.
    -Shift key will no longer give charge/drain swing of stamina (unlimited stamina bug).
  -Enemies no longer follow row/col to reach player if no walls are in raycast.

Edit:
  -Enemies render restyle.

________________________________________V2.5.0.1_________________________________________

Fix:
  -Changing movement, weapon type key switch not showning correctly.
  -Weapon no longer able to being switched with R and RMB in "↑←↓→ + AutoAim" mode.

Edit:
  -Wall color changed.

________________________________________V2.5.1.0_________________________________________

Change:
  -Controls now shown in a tabel.

Fix:
  -Ammo UI now work properly showning the selected weapon.

________________________________________V3.0.0.0_________________________________________

Major:
  -Game has now options menu.

Add:
  -Death counter in Stats menu option.

Change:
  -Player now spawn in start maze cell generation.
  -UI Shots no longer available on top of maze.
  -UI Kills no longer available on top of maze.
  -UI Shots, Kills, will available soon in menu Stats option.
  -Controls and objective description are now in Help menu option.

Info:
  -Death counter will available in the next update.

________________________________________V3.1.0.0_________________________________________

Add:
  -Death counter in stats.
  -Main Menu.
  -Return to main menu option.

________________________________________V3.1.1.0_________________________________________

Change:
  -Players now not able to start the game before choosing control type.
  -Pause menu has now Resume option.

Fix:
  -Shots no longer crash the game.
  -Controls type in Help option now shown properly.
  -Game massive lag has now been resolved.
  -Laser no longer able to break walls without hitting them.
  -Laser sound missing fixed.

________________________________________V3.2.0.0_________________________________________

Add:
  -Laser has now battery.
  -Batteries pickable in maze.
  -Laser battery UI.

Change:
  -Help option now show how to start and play the game.
  -Controls are now shown in Keys.
  -Keys pickable restyle.

________________________________________V3.2.0.1_________________________________________

Fix:
  -Enemies no ear player shoting after player death.

________________________________________V3.2.1.0_________________________________________

Change:
  -Player's first spawn cell is now more easily identifiable.

Edit:
  -Maze walls restyle.
  -Code clean.
  -On wall breaking there is a chanche of:
    15% to spawn a battery,
    20% to spawn a magazine,
    50% to spawn an enemy,
    15% to spawn nothing.

________________________________________V3.2.1.1_________________________________________

Fix:
  -Returning to menu and starting a new game will no longer mantain scores.
  -Enemies now don't hard hit wall corners during chase.
  -Ammo, Magazines and Laser Battery level now will reset on game start.

________________________________________V3.3.0.0_________________________________________

Add:
  -Game can be saved with scores, magazines, bullets, etc. etc...
  -Game saved can be loaded.

________________________________________V3.3.0.1_________________________________________

Fix:
  -Enemies impact to wall losing pathfinding during investigation state.
  -Player position not the same of save file.

________________________________________V3.3.0.2_________________________________________

Fix:
  -The number of enemies per level now remains fixed at level generation if the player dies.

________________________________________V3.4.0.0_________________________________________

Add:
  -Options over and click sound.
  -Exit option.
  -Save delete option.

Fix:
  -Saves not save enemy numbers.

Edit:
  -Help option now pulse.

________________________________________V4.0.0.0_________________________________________

Major:
  -Switched from browser app to exe app.
  -Game can be installed downloading MazeGame-Setup.exe.

Change:
  -Help option now glow for invite people to click on it and read "How To Start" instead
  typing me reporting "New Game" option not clickable.

________________________________________V4.0.0.1_________________________________________

Fix:
  -Enemies investigation state fix... again.

________________________________________V4.0.0.2_________________________________________

Fix:
  -A bug case Exit option not working.
  -Enemies killed doesn't give any score point.
  -Uninstalling no longer causes path finding errors.

_________________________________V5.0.0.0-dev2903261753__________________________________

Major:
  -Enemies has now life length.
  -Hit Sound added for hitted enemies.
  -Player has now Stats perks.
  -Player has not Health.

Add:
  -Pickable meds.
  -Meds can spawn on wall break.

Change:
  -Enemies no longer overlap player when playe is in spawn protection state.
  -Difficulty, Controls and Keys are now in Settings panel in menus.
  -How to start, objective and perks info are now options into Help option.
  -Saves will no longer saved in JSON.

________________________________________V5.0.0.0_________________________________________

Change:
  -Perk cost balanced per difficulty.
  -Perk cost increment per level.
  -New SFX.


Fix:
  -If railgun was active, laser mode did not display battery percentage.

________________________________________V5.0.1.0_________________________________________

Change:
  -Saves now save files in .save

________________________________________V5.1.0.0_________________________________________

Add:
  -Player Inventory.
  -Enemies now drop items.
  -Completing a level will recive some scores. Values change on difficulty.

________________________________________V5.1.0.1_________________________________________

Fix:
  -Enemies no longer lose chasing target and path.

Edit:
  -Some item spawn balancing.

File:
  -ai.js (*Fix*)
  -generation.js (*Edit*)
  -loop.js (*Edit*)

________________________________________V5.2.0.0_________________________________________

Add:
  -Fog of war
  -Med kit efficiency
  -Laser battery efficiency

Edit:
  (modifica del fade-in-out speed della scritta pre-menu)
  -Player stamina perk now is linear.
  -Stats menu restyle.

Fix:
  -Returning to main menu and joining back the game, inventory and player stats not open.

File:
  -ai.js
  -input.js
  -laser-audio.js
  -laser.js
  -loop.js
  -movement-selection.js
  -option.js
  -render.js
  -save.js
  -state.js
  -utils.js
  -weapons.js
  -index.html
  -maze.css
  -new text.js dynamic management of text dimension

________________________________________V5.2.1.0_________________________________________

Change:
  -Fog of war now has perk.
  -Fog of war now open completely when keys remaining is less equal to 0

Fix:
  -Player will no longer have extra HP after picking up medkit improved by perks.
  -Game save now save Medkit Efficiency and Laser Battery Efficiency perk status

______________________________________V5.2.2.0-beta______________________________________

Change:
  -Custom keybind now is possible.
  -"P" key no longer pause the game

Edit:
  -Updated Perks otion.
  -Ease-in-out speed of initial page increased.

WIP: Working on mouse keybind
WARN: DO NOT TRY TO KEYBIND MOUSE, ACTUALLY IS NOT WORKING AND YOU RISK TO BUG THE GAME.

________________________________________V5.2.2.0_________________________________________

Fix:
  -Keybind overwrite with previous keybind
  -Shoot key and weapon switch key now work properly

Edit:
  -Compatibility to mouse keybind

________________________________________V5.2.2.1_________________________________________

Fix:
  -Main menu background not showning


________________________________________V5.2.2.2_________________________________________

Edit:
  -On death, now you got 4 respawn bullets.