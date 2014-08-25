PongGame.prototype.onRotate = function () {

    pong_game.stopGameLoop();
    pong_game.setup();
    pong_game.startGameLoop();
};

PongGame.prototype.unload = function () {
    pong_game.stopGameLoop();

    [pong_game.paddles.left, pong_game.paddles.right].forEach(function (paddle) {

        paddle.node.removeEventListener('touchmove', pong_game.touchMove);
        paddle.node.removeEventListener('touchstart', paddle.touchStart);
        paddle.node.removeEventListener('touchend', paddle.touchEnd);

    });
    var noscroll = function (e) {
        e.preventDefault();
    }; // disables scrolling completely
    document.body.removeEventListener('touchstart', noscroll);
    document.body.removeEventListener('touchmove', noscroll);

    window.removeEventListener("resize", doOnOrientationChange);
    window.removeEventListener("beforeunload", pong_game.unload);
};

/**
 * Update paddle positions from touchmove event
 */
PongGame.prototype.touchMove = function (ev) {

    var touches = ev.changedTouches;
    var i, touch;

    ev.preventDefault(); // this also disables scrolling
    for (i = 0; i < touches.length; i++) {
        touch = touches[i];
        if (touch.screenX <= pong_game.innerWidth / 2) { // event touch belongs to the left paddle
            pong_game.paddles.left.setY(touch.screenY - pong_game.paddleHeight/2);
            pong_game.paddles.left.posChanged = true;
        }
        else { // right paddle
            pong_game.paddles.right.setY(touch.screenY - pong_game.paddleHeight/2);
            pong_game.paddles.right.posChanged = true;
        }
    }
};

var pong_game = new PongGame();


