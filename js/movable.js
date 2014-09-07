pong_game.Movable = (function () {

    /**
     * Movable is used to indicate previous and feature ball steps,
     * It is a container for position vector, direction vector and speed.
     * @constructor
     */
    function Movable() {
        this.position = new pong_game.Vector([0,0]);
        this.direction = new pong_game.Vector([0,0]); // normalized direction of movement
        this.speed = 0;

        if (arguments.length == 1 && arguments[0].constructor.name == "Movable") {
            Movable.clone(arguments[0]);
        }
    }

    Movable.prototype.clone = function(movable) {
        if (movable.constructor.name != "Movable")
            return;

        function quickclone(obj) {
            if (obj == null || typeof obj != 'object') //this.constructor.name)
                return obj;
            var temp = obj.constructor();
            for(var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    temp[key] = clone(obj[key]);
                }
            }

            return temp;
        }

        for(var key in movable) {
            if (movable.hasOwnProperty(key)) {
                this[key] = quickclone(obj[key]);
            }
        }
    };

    /**
     * @param arguments[0] {Vector | [x, y]} - the parameter is either Vector or an Array
     */
    Movable.prototype.setDirection = function() {
        this.direction.set.apply(this.direction, arguments);
        this.direction.normalize();
    };

    /**
     * @param arguments[0] {Vector | [x, y]} - the parameter is either Vector or an Array
     */
    Movable.prototype.setPosition = function() {
        this.position.set.apply(this.position, arguments);
    };

    Movable.prototype.setSpeed = function(m) {
        this.speed = m;
    };

    Movable.prototype.getX = function() {
        return this.position.value[0];
    };

    Movable.prototype.getY = function() {
        return this.position.value[1];
    };

    return Movable;
})();
