pong_game.CollisionAgent = (function () {
    /**
     * detects collisions between objects
     */
    var Vector = pong_game.Vector;

    function CollisionAgent(collisionObjects) {
        this.collisionObjects = collisionObjects;
    }

    CollisionAgent.prototype.calculate = function () {

        var i, j, obj1, obj2, obj;
        var collidedObj, collidedObjShortestTime;
        var len = this.collisionObjects.length;
        var cb1 = [], cb2 = []; // collide boxes
        var collidedObj = {};

        for (i = 0; i < this.collisionObjects.length; i++) {
            obj1 = this.collisionObjects[i];
            if (obj1.getCollideBox === undefined) { // test if object areas can be collided
                continue;
            }
            cb1 = obj1.getCollideBox();
            collidedObj = undefined; // collideObj is the nearest object that collided with obj1
            cb2 = [];

            for (j = i + 1; j < len; j++) {
                obj2 = this.collisionObjects[j];
                if (obj2.getCollideBox === undefined || obj1 === obj2) {
                    continue;
                }
                cb2 = obj2.getCollideBox();
                if (pong_game.CollisionAgent.overlaps(cb1, cb2)) {
                    var timeUntilCollision = _getTimeUntilCollision(obj1, obj2)
                    if (timeUntilCollision <= 0) {
                        continue;
                    }
                    if (collidedObj === undefined) {
                        collidedObj = this.collisionObjects[j];
                        collidedObjShortestTime = timeUntilCollision;
                    }
                    else if (timeUntilCollision < collidedObjShortestTime) {
                        collidedObj = this.collisionObjects[j];
                        collidedObjShortestTime = timeUntilCollision;
                    }

                }
            }

            if (collidedObj !== undefined) {
                if (collidedObj.onCollide !== undefined)
                    collidedObj.onCollide(obj1, collidedObjShortestTime);
                if (obj1.onCollide !== undefined)
                    obj1.onCollide(collidedObj, collidedObjShortestTime);
            }
        }
    };

    function _getTimeUntilCollision(obj1, obj2) {
        var dp, ball, surface, time;
        var speedVector, distance, shortestDistance;

        // init ball & surface
        if (obj1.lastMovable !== undefined) {
            if (obj2.lastMovable !== undefined) {
                //  console.log("Two movables are not implemented");
                return 0;
            }
            ball = obj1;
            surface = obj2;
        } else if (obj2.lastMovable !== undefined) {
            ball = obj2;
            surface = obj1;
        } else {
            //console.log("Two surfaces cannot collide");
            return 0;
        }
        surface = surface.surface !== undefined ? surface.surface : surface;


        var ballDirAlongSurface = Vector.dp(ball.lastMovable.direction, surface.direction); // = speed along the shortestDistance

        if (ballDirAlongSurface < 0) { // objects move towards each other instead of away => chance to collide

            // find Time for ball to hit surface by shortest path:
            var onV = new Vector(surface.direction);
            onV.scale(ballDirAlongSurface);

            distance = new Vector(surface.position);
            distance.scale(-1);
            distance.add(ball.lastMovable.position);

            //distance along surface normal V :
            shortestDistance = Vector.dp(distance, surface.direction) - ball.radius;

            // time along shortest distance to surface before collision
            var timeUntilCollision = shortestDistance / (ballDirAlongSurface * ball.lastMovable.speed); // time = distance / speed
            var collisionPosition = new Vector(ball.lastMovable.direction);
            collisionPosition.scale(timeUntilCollision * ball.lastMovable.speed);
            collisionPosition.add(ball.lastMovable.position);

            // calculate wall height where collision happened
            collisionPosition.scale(-1);
            collisionPosition.add(surface.position); // size of surface center
            var collideHeightSquared = Vector.dp(collisionPosition, collisionPosition);

            if (surface.size * surface.size >= collideHeightSquared) {
                return timeUntilCollision;
            }
        }
        return 0;

    };

    /**
     * Verify if collision domains overlap
     * @param obj1cb [ [minX, minY], [maxX, maxY] ] - object 1 minimum and maximum x/y coords
     * @param obj2cb [ [minX, minY], [maxX, maxY] ] - object 2 minimum and maximum x/y coords
     * @returns {boolean}
     */
    CollisionAgent.overlaps = function (obj1cb, obj2cb) {
        var o1minX = obj1cb[0][0];
        var o1minY = obj1cb[0][1];
        var o1maxX = obj1cb[1][0];
        var o1maxY = obj1cb[1][1];
        var o2minX = obj2cb[0][0];
        var o2minY = obj2cb[0][1];
        var o2maxX = obj2cb[1][0];
        var o2maxY = obj2cb[1][1];

        if ((o1minX > o2maxX) || (o1maxX < o2minX))
            return false;

        if ((o1minY > o2maxY) || (o1maxY < o2minY))
            return false;

        return true;
    };

    return CollisionAgent;
})();