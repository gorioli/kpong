/**
 * Provides steps of x & y coordinates for moving along a 2d surface
 *
 @param {{x:x, y:y}} P1 - first point of moving path along a single direction / vector tail of a direction
 @param {{x:x, y:y}} P2 - last point of moving path along a single direction / vector head of a direction
 @returns private prototype of Moving_engine object must be instantiated with 'new' keyword
 *
 */
pong_game.movementAgent_proto = (function () {
    /**
     * Creates an instance of Moving_engine.
     *
     * @constructor
     * @this {Moving_Agent}
     * @param {{x:x1, y:y1}} P1 source point for the moving a long a path.
     * @param {{x:x2, y:y2}} P2 destination point for the moving a long a path.
     * @param {boolean} isFaster indicates ball acceleration
     */
    function Moving_Agent() {

        var P_origin,
            P,
            P_dest,
            dx,
            dy,
            abs_dx,
            abs_dy,
            max,
            min,
            step_x,
            step_y,
            identical_step,
            made_steps,
            that = this;

        var ballRadius = parseInt(ball.style.width) / 2;
        var maxX;
        var maxY;
        var _speed;

        this.changeDirection = function () {
            step_x = -step_x;
        }

        this.init = function (P1, P2, speed) {
            _speed = speed;
            maxX = window.innerWidth - ballRadius;
            maxY = Math.floor(window.innerHeight * 0.93);


            P_origin = { x: P1.x, y: P1.y};
            P = { x: P1.x, y: P1.y};
            P_dest = { x: P2.x, y: P2.y};
            dx = P2.x - P1.x;
            dy = P2.y - P1.y;

            abs_dx = Math.abs(dx);
            abs_dy = Math.abs(dy);

            max = Math.max(abs_dx, abs_dy);
            min = Math.min(abs_dx, abs_dy);


            step_x = P2.x > P1.x ? 1 : P2.x < P1.x ? -1 : 0;
            step_y = P2.y > P1.y ? 1 : P2.y < P1.y ? -1 : 0;

            if (speed > 1) {
                if (max == abs_dx) {
                    step_x = step_x * speed;
                }
                else {
                    step_y = step_y * speed;
                }
            }

            identical_step = Math.floor((max + 1) / (min + 1));
            made_steps = identical_step;

        };

        this.updateSpeed = function () {
            if (max == abs_dx) {
                if(step_x < 0){
                    step_x = step_x - 1;
                }else{
                    step_x = step_x + 1;
                }
            }
            else {
                if(step_y < 0){
                    step_y = step_y - 1;
                }
                else{
                    step_y = step_y + 1;
                }
            }
        }

        /**
         * @returns {{x:x1, y:y1} | 0} next point for next move to or 0 if the end of the path was reached
         */
        this.getNextStep = function () {
            maxX = window.innerWidth - ballRadius;
            maxY = Math.floor(window.innerHeight * 0.93);

            if (P.x <= 0 || P.x >= maxX) { // hits vertical wall
                P.x = P.x < 0 ? -P.x : P.x > maxX ? 2 * maxX - P.x : P.x;
                step_x = -1 * step_x;

            }
            else if (P.y < 0 || P.y >= maxY) { //  hits horizontal walls
                P.y = P.y < 0 ? -P.y : P.y >= maxY ? 2 * maxY - P.y : P.y;
                step_y = -1 * step_y;
            }
            if (made_steps === 0) {
                if (min === abs_dx) {
                    P.x = P.x + step_x;
                }
                else {
                    P.y = P.y + step_y;
                }
                made_steps = identical_step;
            }
            else {
                if (min !== abs_dx) {
                    P.x = P.x + step_x;
                }
                else {
                    P.y = P.y + step_y;
                }
                made_steps = made_steps - 1 * _speed;
            }
            return P;
        }
    }

    return Moving_Agent;
})();
