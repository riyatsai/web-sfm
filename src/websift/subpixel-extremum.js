'use strict';

var la = require('sylvester'),
    Matrix = la.Matrix,
    Vector = la.Vector;

//===============================================================


/**
 *
 * @param {DogPyramid} dogs
 * @param {int} r
 * @param {int} c
 * @param {int} layer
 * @returns {null|Subpixel}
 */
module.exports.subpixel = function(dogs, r, c, layer){

    var steps = 0;

    var intR = r, intC = c, intLayer = layer,
        subR = 0, subC = 0, subLayer = 0;

    var deriv, hess, delta, valid = false;

    while(steps<5){

        steps++;

        deriv = exports.deriv3D(dogs, intR, intC, intLayer);
        hess = exports.hessian(dogs, intR, intC, intLayer);
        delta = hess.x(deriv).x(-1);

        subR = delta.e(2);
        subC = delta.e(1);
        subLayer = delta.e(3);
        valid = Math.abs(subR) < 0.5 && Math.abs(subC) < 0.5 && Math.abs(subLayer) < 0.5;

        if (valid) {
            break;
        }
        else {
            intR = intR + Math.round(subR);
            intC = intC + Math.round(subC);
            intLayer = intLayer + Math.round(subLayer);
        }

    }

    if (valid) {
        return {
            row: intR+subR,
            col: intC+subC,
            layer: intLayer+subLayer,
            value: dogs.get(intR, intC, intLayer) + deriv.x(delta)/2
        };
    }
    else {
        return null;
    }

};


/**
 *
 * @param {DogPyramid} space
 * @param {int} row
 * @param {int} col
 * @param {int} layer
 * @returns {Vector}
 */
module.exports.deriv3D = function(space, row, col, layer){

    var dxx = ( space.get(row, col+1, layer) - space.get(row, col-1, layer) ) / 2,
        dyy = ( space.get(row+1, col, layer) - space.get(row-1, col, layer) ) / 2,
        dss = ( space.get(row, col, layer+1) - space.get(row, col, layer-1) ) / 2;

    return Vector.create([dxx, dyy, dss]);

};


/**
 * Get Hessian Matrix of a integral point in DoG space
 * @param {DogPyramid} space
 * @param {int} row
 * @param {int} col
 * @param {int} layer
 * @return {Matrix}
 */
module.exports.hessian = function(space, row, col, layer){

    var v   = space.get(row, col, layer),
        dxx = ( space.get(row, col+1, layer) + space.get(row, col-1, layer) - 2 * v ),
        dyy = ( space.get(row+1, col, layer) + space.get(row-1, col, layer) - 2 * v ),
        dss = ( space.get(row, col, layer+1) + space.get(row, col, layer-1) - 2 * v ),
        dxy = (
            space.get(row+1, col+1, layer) -
            space.get(row+1, col-1, layer) -
            space.get(row-1, col+1 ,layer) +
            space.get(row-1, col-1, layer) ) / 4.0,
        dxs = (
            space.get(row, col+1, layer+1) -
            space.get(row, col-1, layer+1) -
            space.get(row, col+1 ,layer-1) +
            space.get(row, col-1, layer-1) ) / 4.0,
        dys = (
            space.get(row+1, col, layer+1) -
            space.get(row-1, col, layer+1) -
            space.get(row+1, col ,layer-1) +
            space.get(row-1, col, layer-1) ) / 4.0;

    return Matrix.create([
        [dxx, dxy, dxs],
        [dxy, dyy, dys],
        [dxs, dys, dss]
    ]);

};