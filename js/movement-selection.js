/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * 
 * v2.2.0.2
 */

const control = document.getElementsByName("control");

control.forEach(radio => {
    radio.addEventListener("change", () => {
        if (wasd.checked) {
            w.innerHTML = "↑: ";
            s.innerHTML = "↓: ";
            a.innerHTML = "←: ";
            d.innerHTML = "→: ";
            shootKey.innerHTML = "Space: ";
        } else if (mouseAim.checked || wasdMouse.checked) {
            w.innerHTML = "W: ";
            s.innerHTML = "S: ";
            a.innerHTML = "A: ";
            d.innerHTML = "D: ";
            shootKey.innerHTML = "LMB: ";
        }

        if (!gameCanvas.hasAttribute("tabindex")) {
            gameCanvas.setAttribute("tabindex", "-1");
        }
        gameCanvas.focus();
    });
});