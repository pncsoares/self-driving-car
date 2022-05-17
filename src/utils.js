/**
 * Meaning: Linear interpolation
 *
 * - When t is zero, this part [(B - A) * 0] is zero so you are left with A
 * - When t is one, the A and -A will cancel each other and you are left with B
 * - When t is in the middle, B - A is half of that difference
 *
 * Find more about Linear interpolation [here](https://en.wikipedia.org/wiki/Linear_interpolation)
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}

/**
 * Verify the intersection of two line segments
 *
 * Fore more information, read [this article](https://blogs.sas.com/content/iml/2018/07/09/intersection-line-segments.html)
 *
 * @param {*} A
 * @param {*} B
 * @param {*} C
 * @param {*} D
 */
function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom !== 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for (let p1 = 0; p1 < poly1.length; p1++) {
        for (let p2 = 0; p2 < poly2.length; p2++) {
            const touch = getIntersection(
                poly1[p1],
                poly1[(p1 + 1) % poly1.length],
                poly2[p2],
                poly2[(p2 + 1) % poly2.length]
            );

            if (touch) {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value) {
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    const alpha = Math.abs(value);

    return 'rgba(' + R + ',' + G + ',' + B + ',' + alpha + ')';
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 50%)`;
}