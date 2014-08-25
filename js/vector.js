pong_game.Vector = (function () {

    function Vector() {
        this.value = [];
        var i;
        if (arguments.length == 1 && arguments[0].constructor.name == "Vector") {

            for (i = 0; i < arguments[0].value.length; i++) { // Vector object in arguments
                this.value.push(arguments[0].value[i]);
            }
        } else if (arguments.length == 1) { // single array in arguments
            for (i = 0; i < arguments[0].length; i++) {
                this.value.push(arguments[0][i]);
            }
        } else {
            for (i = 0; i < arguments.length; i++) { // list of integers in arguments
                this.value.push(arguments[i]);
            }
        }
    }

    /**
     * Dot Product
     * @param a {Vector} - vector  a.length, a[0], a[1]
     * @param b {Vector} - vector
     * @returns {number}
     */
    Vector.dp = function (a, b) { // static Vector method
        var m = 0;

        if (typeof a != "object" || a.constructor.name != "Vector") {
            return;
        }

        var min = Math.min(a.value.length, b.value.length);
        for (var i = 0; i < min; i++) {
            m += a.value[i] * b.value[i];
        }
        return m;
    };

    Vector.isEqual = function (a, b) { // static Vector method
        var m = 0;

        if (typeof a != "object" || a.constructor.name != "Vector") {
            return false;
        }
        if (a.value.length === undefined || a.value.length != b.value.length) {
            return false;
        }
        for (var i = 0; i < a.value.length; i++) {
            if(a.value[i] != b.value[i]) {
                return false;
            }
        }
        return true;
    };

    /**
     * Get Vector Magnitude
     * @param v {Vector}
     * @returns {number}
     */
    Vector.mag = function (v) {
        return Math.sqrt(Vector.dp(v, v));
    };

    /**
     * Normalize vector (divide vect components by magnitude)
     * @param v {Vector}
     * @returns {Vector}
     */
    Vector.normalize = function (v) {
        var m = 1 / Vector.mag(v);
        var nv = new Vector(v);
        for (var i = 0; i < v.value.length; i++) {
            nv.value[i] *= m
        }
        return nv;
    };

    /**
     *
     * @param vector {Vector}
     * @param scalar {Number}
     * @param [preNormalize] {Boolean} - optional
     * @returns {Vector}
     */
    Vector.scale = function (vector, scalar, preNormalize) {
        var v = new Vector(vector);
        if (preNormalize === true) {
            v.normalize();
        }
        for (var i = 0; i < v.value.length; i++) {
            v.value[i] *= scalar;
        }
        return v;
    };

    Vector.add = function (v1, v2) {
        var v = new Vector(v1);

        var min = Math.min(v1.value.length, v2.value.length);

        for (var i = 0; i < min; i++) {
            v.value[i] += v2.value[i];
        }
        return v;
    };

    Vector.prototype.dp = function (v) {
        return Vector.dp(this, v);
    };

    Vector.prototype.length = function () {
        return this.value.length;
    };

    Vector.prototype.normalize = function () {
        var m = 1 / Vector.mag(this);
        for (var i = 0; i < this.value.length; i++) {
            this.value[i] *= m
        }
    };

    /**
     * @param arguments[0] {Vector | [x, y] | x, y} - the parameter is Vector, or Array, or list of numbers
     */
    Vector.prototype.set = function () {

        var arr = arguments;

        if (arguments.length == 1) {
            if (arguments[0].constructor.name == "Vector") {
                arr = arguments[0].value;
            } else {
                arr = arguments[0];
            }
        }

        var min = Math.min(this.value.length, arr.length);
        for (var i = 0; i < min; i++) {
            this.value[i] = arr[i];
        }
    };

    /**
     * Change a vector's direction based on a given surface vector and magnitude
     * @param {Vector} direction - bounce source vector
     * @param {Vector} normal - normalized surface normal (or scaled normal with desired bounce magnitude)
     * @param [magnitude] force - reflection magnitude (unless not given)
     *
     * create a new direction vector from a surface vector
     * mag(normal) should be:
     * 2: 100% reflection
     * >2: force/2 x reflection (faster)
     * <2: force/2 x reflection (slower)
     * 1: 0% reflection, stick to surface
     * <1: force/fall through surface slowly
     * 0: does not effect direction or speed
     */
    Vector.prototype.setBounce = function (direction, normal, force) {
        this.set(direction);
        var dmagsq = Vector.dp(direction, direction);  // magnitude squared of the current direction
        if (dmagsq > 0) { // there is movement so bounce is possible

            // if force is undefined => assume user scaled surface normal to desired bounce magnitude
           if (force === undefined) {
               force = 2;
           }
            var commonPathMag = Vector.dp(direction, normal) / Math.sqrt(dmagsq);// magnitude of direction vector along surface normal direction

            // commonPathMag > 0 when angle between surface normal and motion vector is < 90°, they face each other and modify motion
            // otherwise surface does not affect motion
            if (commonPathMag < 0) {
                this.set(normal);
                this.scale(-commonPathMag * force, true);  // prenormalize surface normal, multiply by force, project "direction" onto "normal"
                this.add(direction); //{new_direction} = {direction} + ( force * (-commonPathMag * {normal} ) )
            }
        }
    };

    /**
     *
     * @param {Vector} vadd - const Vector to add to self
     */
    Vector.prototype.add = function (vadd) {
        var min = Math.min(this.value.length, vadd.value.length);

        for (var i = 0; i < min; i++) {
            this.value[i] += vadd.value[i];
        }
    };

    /**
     *
     * @param {number} scalar - scalar multiplier
     * @param {boolean} preNormalize - self normalize prior to scaling
     */
    Vector.prototype.scale = function (scalar, preNormalize) {
        var v = this;
        if (preNormalize === true) {
            v.normalize();
        }
        for (var i = 0; i < v.value.length; i++) {
            v.value[i] *= scalar;
        }
    };

    Vector.prototype.getX = function() {
        return this.value[0];
    };

    Vector.prototype.getY = function() {
        return this.value[1];
    };

    return Vector;
})();

