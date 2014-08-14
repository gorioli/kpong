function PongGame() {
    this.ball_proto = {};
    this.ball = {};
    this.paddle_proto = {};
    this.paddles = {left: null, right: null};
    this.movementAgent_proto = {};
    this.movementAgent = {};
    this.collisionAgent = {};
    this.score_proto = {};
    this.paddleHeight = parseInt(window.getComputedStyle(paddle1).getPropertyValue('height'));
    this.paddleWidth = parseInt(window.getComputedStyle(paddle1).getPropertyValue('width'));
    this.halfPaddleHeight = this.paddleHeight / 2;
    this.scores = {left: null, right: null};
    this.ballDiameter = 0;
    this.ballRadius = 0;

    var me = this;

    // disables scrolling completely
    var noscroll = function (e) {
        e.preventDefault();
    };
    document.body.addEventListener('touchstart', noscroll);
    document.body.addEventListener('touchmove', noscroll);

    function doOnOrientationChange(e) {
        clearTimeout(me.ball.runningTimeOutTaskRef); // stop the ball running
        me.startGame();
    }

    var orientationEvent = "onorientationchange" in window ? "orientationchange" : "resize";
    window.addEventListener(orientationEvent, doOnOrientationChange);
};

PongGame.prototype.startGame = function () {

    this.ballDiameter = parseInt(ball.style.width);
    this.ballRadius = this.ballDiameter / 2;
    this.paddles.left = new this.paddle_proto(paddle1);
    var width = (window.innerWidth - pong_game.paddleWidth);
    this.paddles.right = new this.paddle_proto(paddle2);

    this.ball = new this.ball_proto(1); // for v2

    var startMoveFromLeftPaddle = true;
    this.ball.startMoving(startMoveFromLeftPaddle);
}

var pong_game = new PongGame();

