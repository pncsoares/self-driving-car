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
