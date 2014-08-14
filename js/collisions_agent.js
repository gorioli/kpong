pong_game.collisionAgent = (function () {
    function CollisionAgent() {
        var paddlePositionY = 0;
        var isLeftHit = true;
        var paddle = {};


        /**
         *
         * @param P {P.x, P,y} - current location of the ball
         * @returns {boolean} - true if ball collides with an edge but not the paddle, false otherwise
         */
        this.isEdgeCollide = function (P) {

            if (P.x < pong_game.paddleWidth) { // hit left side by x
                paddlePositionY = pong_game.paddles.left.positionY;
                isLeftHit = true;
            }
            else if (P.x > window.innerWidth - pong_game.paddleWidth - pong_game.ballDiameter) { // hit right side by x
                paddlePositionY = pong_game.paddles.right.positionY;
                isLeftHit = false;
            }
            else {
                return false; // no collisions by x yet => coordinate P.x is in 'save' position
            }

            if (paddlePositionY <= P.y && P.y <= paddlePositionY + pong_game.paddleHeight) { // hits the paddle by y
                if (isLeftHit) {
                    paddle = pong_game.paddles.left;
                }else{
                    paddle = pong_game.paddles.right;
                }
                if(Date.now() - paddle.timeTouchStart < 1000){
                    pong_game.ball.speed = pong_game.ball.updateSpeed();
                }
                pong_game.movementAgent.changeDirection();
                pong_game.movementAgent.getNextStep();
            }
            else { // didn't hit a paddle

                if (P.x <= pong_game.ball.speed ||
                    P.x + pong_game.ballDiameter >= window.innerWidth - pong_game.ball.speed) {// if is path completed to the edge of the wall?
                    return true;
                }
            }
            return false;
        }
    }

    return new CollisionAgent();
})();