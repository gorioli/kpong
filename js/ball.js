pong_game.ball_proto = (function () {
    /**
     * Creates an instance of Ball.
     *
     * @constructor
     * @this {Ball}
     * @param {optional number} speed The desired speed of ball in milliseconds (the same as for timeout, since the ball moves one pixel per one call of timeout function).
     */
    function Ball(speed) {
        this.runningTimeOutTaskRef = 0;
        this.position;
        this.speed = window.innerWidth > 700 && speed < 3 ? 3 : speed;
        var me = this;
        var isInitial = true;
        var P2;
        var P1;

        /**
         * increments its speed by 1
         */
        Ball.prototype.updateSpeed = function () {
            this.speed = window.innerWidth > 700 ? this.speed >= 27 ? 27 : this.speed + 1 : this.speed >= 7 ? 7 : this.speed + 1; // the upper threshold for the speed
            pong_game.movementAgent.updateSpeed();
        }
        /**
         * Creates new movement for the ball starting at the winning paddle's side wall.
         * The angle for movement is generated randomly by creating a destination point - P2
         */
        Ball.prototype.startMoving = function (moveFromLeft) {

            setPoints(moveFromLeft);

            if (isInitial) {
                ball.style.display = "block";
                isInitial = false;
            }

            pong_game.movementAgent = new pong_game.movementAgent_proto();

            pong_game.movementAgent.init(P1, P2, this.speed);

            this.runningTimeOutTaskRef = setInterval(function running() {

                me.position = pong_game.movementAgent.getNextStep();

                if (pong_game.collisionAgent.isEdgeCollide(me.position)) {
                    clearInterval(me.runningTimeOutTaskRef);
                    throwAway();
                    return;
                }
                /**
                 *  requestAnimationFrame to schedule all DOM writes for the next frame.
                 *  This means that all the reads happen together, followed by all the writes, and our layout doesn't get 'thrashed'
                 */
                window.requestAnimationFrame(function () {
                    ball.style.left = me.position.x + "px";
                    ball.style.top = me.position.y + "px";
                });
            }, 0);
        };

        var throwAway = function () {
            var count = 5;
            var startMoveFromLeftPaddle = true;

            var runningTimeOutTaskRef = setInterval(function () {
                me.position = pong_game.movementAgent.getNextStep();
                window.requestAnimationFrame(function () {
                    ball.style.left = me.position.x + "px";
                    ball.style.top = me.position.y + "px";
                });

                count = count - 1;
                if (count === 0) {
                    clearInterval(runningTimeOutTaskRef);
                    me.speed = window.innerWidth > 700 && speed < 3 ? 3 : 1;
                    ;
                    if (me.position.x <= pong_game.paddleWidth) {// left paddle looses
                        pong_game.scores.right.update();  // right paddle wins
                        me.startMoving(!startMoveFromLeftPaddle);
                    } else {
                        pong_game.scores.left.update(); // update left score
                        me.startMoving(startMoveFromLeftPaddle);
                    }
                }

            }, 0)
        }

        var setPoints = function (isFromLeft) {
            if (isFromLeft) {
                P1 = {
                    x: pong_game.paddleWidth + 1,
                    y: Math.floor(pong_game.halfPaddleHeight + parseInt(paddle1.style.top))
                };
                P2 = {
                    x: window.innerWidth - pong_game.paddleWidth,
                    y: Math.floor(Math.random() * window.innerHeight)
                };
            }
            else {
                P1 = {
                    x: window.innerWidth - pong_game.paddleWidth - pong_game.ballRadius - 10,
                    y: Math.floor(pong_game.halfPaddleHeight + parseInt(paddle2.style.top))
                };
                P2 = {
                    x: 0,
                    y: Math.floor(Math.random() * window.innerHeight)
                };
            }
        }
    }

    return Ball;
})();






