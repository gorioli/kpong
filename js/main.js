window.onload = function () {

    pong_game.createGame();


    // register touch events:
    var noscroll = function (e) {
        e.preventDefault();
    }; // disables scrolling completely
    document.body.addEventListener('touchstart', noscroll);
    document.body.addEventListener('touchmove', noscroll);

    window.addEventListener("resize",  pong_game.onRotate);

    window.addEventListener("beforeunload", pong_game.unload, false);

    [pong_game.paddles.left, pong_game.paddles.right].forEach(function (paddle) {

        paddle.node.addEventListener('touchmove', pong_game.touchMove, false);
        paddle.node.addEventListener('touchstart', paddle.touchStart, false);
        paddle.node.addEventListener('touchend', paddle.touchEnd, false);

    });

    pong_game.startGameLoop();
}



