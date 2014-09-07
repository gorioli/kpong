pong_game.Ball = (function () {
    /**
     * Creates an instance of Ball.
     *
     * @constructor
     * @this {Ball}
     */
    function Ball(node) {
        this.node = node; // DOM component
        this.radius = 0;
        this.lastMovable = new pong_game.Movable(0, 0); // last position, speed, direction
        this.nextMovable = new pong_game.Movable(0, 0); // future position, speed, direction after dTNext seconds from lastMovable
        this.visible = false;
        this.attrChanged = false;  // attributes / size / visibility changed
        this.posChanged = false;  // x, y has changes
        this.dTLast = 0;  // last flushed time offset from dTNext
        this.dTNext = 0;  // future time offset for next movable state
    };

    var Vector = pong_game.Vector;
    var temp;

    Ball.prototype.setVisible = function (visible) {
        var changed = this.visible ^ visible;
        this.visible = visible;
        this.attrChanged = changed;
    };

    Ball.prototype.setSize = function (radius) {
        var changed = this.radius == radius;
        this.radius = radius;
        this.attrChanged = changed;
    };

    //timeDelta - time in seconds -
    /**
     * Store the nextMovable state and indicate newdata is available
     * @param {number} timeDelta - time in seconds in future to precalculate next data
     * @param {boolean} copy = true - true: copy speed and direction to next state
     */
    Ball.prototype.calculate = function (timeDelta, copy) {
            this.posChanged = false; // reset position change until final object flush

            // calculate {nextposition} = {lastposition} + timeDelta * speed * {direction}
            this.nextMovable.setPosition(Vector.add(this.lastMovable.position,
                Vector.scale(this.lastMovable.direction, timeDelta * this.lastMovable.speed)));
            if (copy !== false) {
                this.nextMovable.setDirection(this.lastMovable.direction);
                this.nextMovable.setSpeed(this.lastMovable.speed);
            }
            this.dTNext = timeDelta;
    };

    Ball.prototype.flush = function () {
            temp = this.nextMovable;
            this.nextMovable = this.lastMovable;
            this.lastMovable = temp;
            this.dTLast = this.dTNext;
            this.dTNext = 0;
            this.posChanged = !pong_game.Vector.isEqual(this.lastMovable.position, this.nextMovable.position);
    };

    Ball.prototype.getEdgeMinX = function () {
        var t = this.lastMovable.getX();
        if (this.posChanged === true) {
            t = Math.min(t, this.nextMovable.getX());
        }
        return t - this.radius;
    };

    Ball.prototype.getEdgeMaxX = function () {
        var t = this.lastMovable.getX();
        if (this.posChanged === true) {
            t = Math.max(t, this.nextMovable.getX());
        }
        return t + this.radius;
    };

    Ball.prototype.getEdgeMinY = function () {
        var t = this.lastMovable.getY();
        if (this.posChanged === true) {
            t = Math.min(t, this.nextMovable.getY());
        }
        return t - this.radius;
    };

    Ball.prototype.getEdgeMaxY = function () {
        var t = this.lastMovable.getY();
        if (this.posChanged === true) {
            t = Math.max(t, this.nextMovable.getY());
        }
        return t + this.radius;
    };

    Ball.prototype.getCollideBox = function () {
        var r = [
            [],
            []
        ];
        r[0] = [this.getEdgeMinX(), this.getEdgeMinY()];
        r[1] = [this.getEdgeMaxX(), this.getEdgeMaxY()];
        return r;
    };

    return Ball;
})();
