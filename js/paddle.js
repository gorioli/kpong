pong_game.Paddle = (function () {

    /**
     *
     * @param paddleId {number} - paddle paddleId
     * @constructor
     */
    function Paddle(paddleNode) {

        this.node = paddleNode;
        this.timeTouchStart = 0; // tracks the last tappped time
        this.visible = false;
        this.posChanged = false;
        this.surfaces = [];  //attached surfaces
        this.surfaceOffsets = []; // where is surface attached relative to paddle x,y in terms of width, height
        this.height = 0;
        this.width = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.bounds = undefined;
        this.tapDelay = 400; // ms;
        var self = this;

        this.touchStart = function (ex) {
            ex.preventDefault();
            self.timeTouchStart = Date.now();
        };

        this.touchEnd = function (ex) {
            ex.preventDefault();
            var now = Date.now();
            if (now - this.timeTouchStart > self.tapDelay) { // assuming that 400ms between touchStart and touchEnd is considered a tapping on the paddle
                self.timeTouchStart = 0;
            }
            else {
                self.timeTouchStart = now; // otherwise it is long click and not tapping
            }
        };
    };

    Paddle.prototype.setX = function (x) {
        this.setXY(x, this.positionY);
    };

    Paddle.prototype.setY = function (y) {
        this.setXY(this.positionX, y);
    };

    Paddle.prototype.setXY = function (x, y) {
        this.posChanged = false;
        if (this.bounds === undefined) {
            this.positionX = x;
            this.positionY = y;
        } else {
            this.positionX = (x < this.bounds[0]) ? this.bounds[0] : (x > this.bounds[2]) ? this.bounds[2] : x;
            this.positionY = (y < this.bounds[1]) ? this.bounds[1] : (y > this.bounds[3]) ? this.bounds[3] : y;
        }

        var self = this;
        this.surfaces.forEach(function (surface, i) {
            surface.setPosition(
                    self.positionX + self.width * self.surfaceOffsets[i][0],
                    self.positionY + self.height * self.surfaceOffsets[i][1]);
        });
    };

    Paddle.prototype.setSize = function (width, height) {
        this.posChanged = false;
        this.width = width;
        this.height = height;
    };

    Paddle.prototype.attachSurface = function (surface, widthX, heightY) {
        surface.onCollide = function (collideObj, deltaT) {
            if (this.parent.onCollide !== undefined)
                this.parent.onCollide(collideObj, deltaT);
        };
        surface.setPosition(
                this.positionX + this.width * widthX,
                this.positionY + this.height * heightY
        );
        surface.parent = this;
        this.surfaces.push(surface);
        this.surfaceOffsets.push([widthX, heightY]);
    };

    Paddle.prototype.setXYBounds = function (minX, minY, maxX, maxY) {
        this.bounds = [minX, minY, maxX, maxY];
        this.setXY(this.positionX, this.positionY); // update position with bounds
    };

    Paddle.prototype.isTapped = function () {
        if (Date.now() - this.timeTouchStart < this.tapDelay * 2) { // is 2*tapDelay ms passed since the last tap
            return true;
        }
        return false;
    };

    Paddle.prototype.getEdgeMinX = function () {
        return this.positionX;
    };

    Paddle.prototype.getEdgeMaxX = function () {
        return this.positionX + this.width;
    };

    Paddle.prototype.getEdgeMinY = function () {
        return this.positionY;
    };

    Paddle.prototype.getEdgeMaxY = function () {
        return this.positionY + this.height;
    };

    Paddle.prototype.getCollideBox = function () {
        return [
            [ this.positionX, this.positionY],
            [ this.positionX + this.width, this.positionY + this.height]
        ];
    };

    return Paddle;
})();