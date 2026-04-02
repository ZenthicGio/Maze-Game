/*!
 * © 2026 ΔΣGIS
 * All rights reserved.
 *
 * This code is the property of the author.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

function fitText(el, maxSize = 25) {
    let size = maxSize;
    el.style.fontSize = size + "px";

    while (el.scrollWidth > el.offsetWidth && size > 10) {
        size--;
        el.style.fontSize = size + "px";
    }
}