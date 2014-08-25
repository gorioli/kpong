pong_game.Surface = (function () {

    /**
     * Creates an instance of Surface, one dimensional object in 2D space
     * @constructor
     * @this {Surface}
     */
    function Surface() {
        this.position = new pong_game.Vector(0, 0);
        this.direction = new pong_game.Vector(0, 0);
        this.size = 0;

        this._xyOffsets = [ [0,0], [0,0] ]; // cached xy surface coordinates (from center)
        var cacheSDir = new pong_game.Vector(0,0);  // cache for scaled direction vector

        var me = this;

        this._setCache = function() {
            cacheSDir.set(me.direction);
            cacheSDir.scale(me.size/2);
            // (x, y) start and end is +90 and -90 degrees from surface direction
            me._xyOffsets[0] = [cacheSDir.value[1], -cacheSDir.value[0] ];
            me._xyOffsets[1] = [-cacheSDir.value[1], cacheSDir.value[0] ];
        };
    }

    /**
     * @param arguments[0] {Vector | [x, y] | (x,y)} - the parameter is nonzero 2D Vector, or Array, or list of numbers
     */
    Surface.prototype.setDirection = function() {
        this.direction.set.apply(this.direction, arguments);
        this.direction.normalize();
        this._setCache();  // cache dimensions relatively to direction
    };

    /**
     *
     * @param size {Number} - surface size
     */
    Surface.prototype.setSize = function(size) {
        this.size = size;
        this._setCache();  // cache dimensions relatively to size
    };

    /**
     * @param arguments[0] {Vector | [Number, Number] | (Number, Number)} - the parameter is a nonzero 2D Vector or an Array, list of Numbers
     */
    Surface.prototype.setPosition = function() {
        this.position.set.apply(this.position, arguments);
    };

    /**
     *
     * @returns {*[]} real points on screen from position and x,y offsets
     */
    Surface.prototype._getPoints = function() {
        return [
            [ this._xyOffsets[0][0] + this.position.value[0], this._xyOffsets[0][1] + this.position.value[1] ],
            [ this._xyOffsets[1][0] + this.position.value[0], this._xyOffsets[1][1] + this.position.value[1] ]
        ];
    };

    Surface.prototype.getEdgeMinX = function() {
        var points = this._getPoints();
        return Math.min(points[0][0], points[1][0]);  // min of x0, x1
    };

    Surface.prototype.getEdgeMaxX = function() {
        var points = this._getPoints();
        return Math.max(points[0][0], points[1][0]);  // max of x0, x1
    };

    Surface.prototype.getEdgeMinY = function() {
        var points = this._getPoints();
        return Math.min(points[0][1], points[1][1]);  // min of y0, y1
    };

    Surface.prototype.getEdgeMaxY = function() {
        var points = this._getPoints();
        return Math.max(points[0][1], points[1][1]);  // max of y0, y1
    };

    /**
     *
     * @returns {*[]|*}
     */
    Surface.prototype.getCollideBox = function() {
        r = [[],[]];
        r[0] = [this.getEdgeMinX(), this.getEdgeMinY()];
        r[1] = [this.getEdgeMaxX(), this.getEdgeMaxY()];
        return r;
    };

    return Surface;
})();
