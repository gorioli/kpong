PongGame.prototype.startGameLoop = function () {
    if (this.gameLoopTimer === null) {
        this.gameLoopTimer = setTimeout(this.gameLoop, 0);
    }
};

PongGame.prototype.gameLoop = function () {
    // if painting or future object calculation cache is full
    if (pong_game.isSetPaint === true || pong_game.isNextValid === true) {
        console.log("Next object cache full, waiting for next paint")
        return;
    }

    // 1. calculate: object positions after nextT seconds
    pong_game.worldCalculate(pong_game.nextT);

    //2. check and manage collisions
    pong_game.collisions.calculate();
    pong_game.isNextValid = true;  // calculations & collisions are complete for the next object states

    pong_game.flushData();  // set all future objects as current objects
    pong_game.isDrawReady = true;  // notify that it is OK to Draw

    //3. paint / update DOM elements
    pong_game.paint(pong_game.nextT);
};

/**
 * Update all object next data
 * @param {number} T - time in seconds between last drawn object data and future drawn data points
 */
PongGame.prototype.worldCalculate = function (T) {
    this.isNextValid = false;
    this.worldObjects.forEach(function (obj) {
        if (obj.lastMovable !== undefined && obj.calculate !== undefined) {
            obj.calculate(T);
        }
    });
};

/**
 * Update current frame world object data
 */
PongGame.prototype.flushData = function () {
    if (this.isNextValid === true) {

        // move all world objects with next state cache to the current state
        this.worldObjects.forEach(function (obj) {
            if (obj.flush !== undefined) {
                obj.flush();
            }
        });
        this.isNextValid = false;
    }
};
/**
 * Renders DOM components during the next window animation frame
 * If the elaspsed time since the last draw is >= the desired timeDelta, draw the frame
 */
PongGame.prototype.paint = function (timeDelta) {
    var currentGameLoopTimer;
    if (pong_game.isSetPaint === true) {
        console.log("Warning: new paint queued before previous finished")
    }
    else {
        pong_game.isSetPaint = true;
        window.requestAnimationFrame(function (timestamp) {
            currentGameLoopTimer = pong_game.gameLoopTimer;

            if (pong_game.isDrawReady) {
                // render paddles:
                [pong_game.paddles.left, pong_game.paddles.right].forEach(function (obj) {
                    if (obj.posChanged === true) {
                        obj.node.style.top = obj.positionY + "px";
                        obj.posChanged = false;
                        if (obj.visible === true) {
                            obj.node.style.display = "block";
                            obj.visible = false;
                            obj.node.style.left = obj.positionX + "px";
                        }
                    }
                });

                // render scores:
                [pong_game.scores.left, pong_game.scores.right].forEach(function (obj) {
                    if (obj.posChanged) {
                        obj.node.innerText = obj.score;
                        obj.posChanged = false;
                    }
                });

                // render ball:
                if (pong_game.ball.posChanged) {
                    pong_game.ball.node.style.left = Math.round(pong_game.ball.lastMovable.getX() - pong_game.ball.radius) + "px";
                    pong_game.ball.node.style.top = Math.round(pong_game.ball.lastMovable.getY() - pong_game.ball.radius) + "px";
                }
                if (pong_game.ball.attrChanged) {
                    pong_game.ball.node.style.width = Math.round(2 * pong_game.ball.radius);
                    pong_game.ball.node.style.height = Math.round(2 * pong_game.ball.radius);
                    if (pong_game.ball.visible) {
                        pong_game.ball.node.style.display = "block";
                    } else {
                        pong_game.ball.node.style.display = "none";
                    }
                    pong_game.ball.attrChanged = undefined;
                }

                pong_game.isSetPaint = false; // notify that we have painted
            }

            if (currentGameLoopTimer === pong_game.gameLoopTimer) {
                pong_game.gameLoopTimer = setTimeout(pong_game.gameLoop, 1000 * this.nextT);
            }
        }); // requestAnimationFrame end
    }
};

PongGame.prototype.stopGameLoop = function () {

    clearTimeout(this.gameLoopTimer);
    this.gameLoopTimer = null;
};


