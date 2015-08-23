/**
 * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * http://www.redblobgames.com/grids/hexagons/#basics
 * In a regular hexagon the interior angles are 120°. 
 * There are six “wedges”, each an equilateral triangle with 60° angles inside. 
 * Corner i is at (60° * i), size units away from the center.
 */
function hexCorner(centerX, centerY, size, i) {
    var angleRad = (Math.PI / 180) * ((60 * i) + 30);
    
    return {
        x : centerX + (size * Math.cos(angleRad)),
        y : centerY + (size * Math.sin(angleRad))
    };
}