function PongGame() {
    this.Ball = {};
    this.Paddle = {};
    this.Surface = {};
    this.CollisionAgent = {};


    this.ball = {};
    this.walls = [];
    this.wallTop = {};
    this.wallBottom = {};
    this.wallLeft = {};
    this.wallRight = {};
    this.paddles = {left: null, right: null};

    this.collisions = {};
    this.Score = {};

    this.Vector = {};
    this.Movable = {};

    this.scores = {left: null, right: null};

    this.gameLoopTimer = null;
    this.PADDLE_SIDE = {
        LEFT: 1,
        RIGHT: 2
    };
    this.lastScored = this.PADDLE_SIDE.LEFT;
    this.worldObjects = [];

    this.DEFAULT_BALL_SPEED = 200; // px / second
    this.DEFAULT_SPEED_MULTIPLIER = 1.2; // speed increase after quick tap
    this.fps = 40;  // the desired frames per second
    this.nextT = 1 / this.fps; // initial drawing interval

    this.innerHeight = 0;
    this.innerWidth = 0;
    this.paddleHeight = 0;
    this.paddleWidth = 0;

    // global booleans
    this.isDrawReady = false;  // all current objects are valid for drawing frame
    this.isNextValid = false;  // object calculations / updates are complete and current state should be updated
    this.isSetPaint = false;  // a frame will be painted
    this.isReset = false;  // a frame will be painted

    this.PongLogic = {};
    this.currentTime = this.lastTime = 0;  // TODO: make generic timing class
    this.timeError = 0;  // > 0 calculations are too slow, < 0 draw timing is too fast and needs delay

    // for DEBUG
    this.loops = 0;

    this.paddleLSurfaceR;
    this.paddleLSurfaceT;
    this.paddleLSurfaceB;
    this.paddleRSurfaceL;
    this.paddleRSurfaceT;
    this.paddleRSurfaceB;
};

PongGame.prototype.createGame = function () {
    this.paddles.left = new this.Paddle(paddle1);
    this.paddles.right = new this.Paddle(paddle2);

    this.ball = new this.Ball(ball);

    pong_game.scores.left = new pong_game.Score(score1);
    pong_game.scores.right = new pong_game.Score(score2);

    this.wallTop = new this.Surface();
    this.wallBottom = new this.Surface();
    this.wallLeft = new this.Surface();
    this.wallRight = new this.Surface();

    this.paddleLSurfaceR = new pong_game.Surface();
    this.paddleLSurfaceT = new pong_game.Surface();
    this.paddleLSurfaceB = new pong_game.Surface();
    this.paddleRSurfaceL = new pong_game.Surface();
    this.paddleRSurfaceT = new pong_game.Surface();
    this.paddleRSurfaceB = new pong_game.Surface();

    this.walls = [this.wallTop, this.wallBottom, this.wallLeft, this.wallRight];
    this.worldObjects = [
        this.ball, this.paddles.left, this.paddles.right,
        this.scores.left, this.scores.right,
        this.wallTop, this.wallBottom, this.wallLeft, this.wallRight
    ];
    this.collideObjects = [
        this.ball,
        this.wallTop, this.wallBottom, this.wallLeft, this.wallRight,
        this.paddleLSurfaceR, this.paddleLSurfaceT, this.paddleLSurfaceB,
        this.paddleRSurfaceL, this.paddleRSurfaceT, this.paddleRSurfaceB
    ];

    this.collisions = new this.CollisionAgent(this.collideObjects);

    this.setup();
};


PongGame.prototype.setup = function () {

    this.isDrawReady = false;

    this.worldObjects.forEach(function (obj) {
        if (obj.posChanged !== undefined) {
            obj.posChanged = false;
        }
    });

    // set screen parameters:
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    this.ball.radius = parseInt(window.getComputedStyle(ball).getPropertyValue('width')) / 2;

    this._initPaddles();
    this._initWalls();
    this._initBall();

    // set indications that all objects are ready for rendering
    this.worldObjects.forEach(function (obj) {
        if (obj.posChanged !== undefined) {
            obj.posChanged = true;
        }
        if (obj.visible !== undefined) {
            obj.visible = true;
        }
    });

    this.isNextValid = true;  // next object data is ready
    this.flushData();  // replace current object states with next states
    pong_game.isDrawReady = true;
};

PongGame.prototype._initPaddles = function () {
    this.isDrawReady = false;
    this.paddleHeight = parseInt(window.getComputedStyle(paddle1).getPropertyValue('height'));
    this.paddleWidth = parseInt(window.getComputedStyle(paddle1).getPropertyValue('width'));
    this.paddleEdgeOffsetX = Math.floor(this.innerWidth * 0.04);
    this.paddleEdgeOffsetY = Math.floor(this.innerHeight * 0.04);

    this.paddles.left.setSize(this.paddleWidth, this.paddleHeight);
    this.paddleLSurfaceR.setDirection(1, 0);
    this.paddleLSurfaceR.setSize(this.paddleHeight);
    this.paddles.left.attachSurface(this.paddleLSurfaceR, 1, 0.5);

    this.paddleLSurfaceT.setDirection(0, -1);
    this.paddleLSurfaceT.setSize(this.paddleWidth);
    this.paddles.left.attachSurface(this.paddleLSurfaceT, 0.5, 0);

    this.paddleLSurfaceB.setDirection(0, 1);
    this.paddleLSurfaceB.setSize(this.paddleWidth);
    this.paddles.left.attachSurface(this.paddleLSurfaceB, 0.5, 1);

    this.paddles.left.setXYBounds(
        this.paddleEdgeOffsetX,
        this.paddleEdgeOffsetY,
        this.paddleEdgeOffsetX,
            this.innerHeight - this.paddleEdgeOffsetY - this.paddleHeight
    );
    this.paddles.left.setXY(
        this.paddleEdgeOffsetX,
        Math.round(this.innerHeight / 2 - this.paddleHeight / 2));

    this.paddles.right.setSize(this.paddleWidth, this.paddleHeight);
    this.paddleRSurfaceL.setDirection(-1, 0);
    this.paddleRSurfaceL.setSize(this.paddleHeight);
    this.paddles.right.attachSurface(this.paddleRSurfaceL, 0, 0.5);

    this.paddleRSurfaceT.setDirection(0, -1);
    this.paddleRSurfaceT.setSize(this.paddleWidth);
    this.paddles.right.attachSurface(this.paddleRSurfaceT, 0.5, 0);

    this.paddleRSurfaceB.setDirection(0, 1);
    this.paddleRSurfaceB.setSize(this.paddleWidth);
    this.paddles.right.attachSurface(this.paddleRSurfaceB, 0.5, 1);

    this.paddles.right.setXYBounds(
            this.innerWidth - this.paddleWidth - this.paddleEdgeOffsetX, this.paddleEdgeOffsetY,
            this.innerWidth - this.paddleWidth - this.paddleEdgeOffsetX, this.innerHeight - this.paddleEdgeOffsetY - this.paddleHeight
    );
    this.paddles.right.setXY(this.innerWidth - this.paddleEdgeOffsetX - this.paddleWidth, Math.round(this.innerHeight / 2 - this.paddleHeight / 2));
};

PongGame.prototype._initWalls = function () {
    this.isDrawReady = false;
    this.wallTop.size = this.innerWidth - 2 * this.paddleEdgeOffsetX;
    this.wallTop.setPosition(this.innerWidth / 2, 0.01 * this.innerHeight);
    this.wallTop.setDirection(0, 1);
    this.wallTop.visible = true;
    this.wallTop.attrChanged = true;

    this.wallBottom.size = this.innerWidth - 2 * this.paddleEdgeOffsetX;
    this.wallBottom.setPosition(this.innerWidth / 2, 0.99 * this.innerHeight);
    this.wallBottom.setDirection(0, -1);
    this.wallBottom.visible = true;
    this.wallBottom.attrChanged = true;

    this.wallLeft.size = this.innerHeight;
    this.wallLeft.setPosition(0.5 * this.paddleEdgeOffsetX, this.innerHeight / 2);
    this.wallLeft.setDirection(1, 0);
    this.wallLeft.visible = false;
    this.wallLeft.attrChanged = true;
    this.wallLeft.onCollide = function (collideObj) {
        if (collideObj == pong_game.ball) {
            pong_game.scores.right.increment();
            pong_game.stopGameLoop();
            pong_game.lastScored = pong_game.PADDLE_SIDE.RIGHT;
            pong_game._initBall();
            pong_game.startGameLoop();
        } else {
            console.log("WallL: unexpected collide");
        }
    };

    this.wallRight.size = this.innerHeight;
    this.wallRight.setPosition(this.innerWidth - 0.5 * this.paddleEdgeOffsetX, this.innerHeight / 2);
    this.wallRight.setDirection(-1, 0);
    this.wallRight.visible = false;
    this.wallRight.attrChanged = true;
    this.wallRight.onCollide = function (collideObj) {
        if (collideObj == pong_game.ball) {
            pong_game.scores.left.increment();
            pong_game.stopGameLoop();
            pong_game.lastScored = pong_game.PADDLE_SIDE.LEFT;
            pong_game._initBall();
            pong_game.startGameLoop();
        } else {
            console.log("WallR: unexpected collide");
        }
    };
};

PongGame.prototype._initBall = function () {
    this.isDrawReady = false;
    this.ball.setVisible(false);  // hide during updates

    var x1, y1, x2, y2;
    var halfPaddleHeight = this.paddleHeight / 2;
    y2 = Math.floor(Math.random() * this.innerHeight);
    if (this.lastScored == this.PADDLE_SIDE.LEFT) {
        x1 = this.paddles.left.getEdgeMaxX() + (this.ball.radius + 1);
        x2 = this.paddles.right.getEdgeMinX() - (this.ball.radius + 1);
        y1 = this.paddles.left.getEdgeMinY() + halfPaddleHeight;
    } else {
        x1 = this.paddles.right.getEdgeMinX() - (this.ball.radius + 1);
        x2 = this.paddles.left.getEdgeMaxX() - (this.ball.radius + 1);
        y1 = this.paddles.right.getEdgeMinY() + halfPaddleHeight;
    }

    this.ball.nextMovable.setPosition(x1, y1);
    this.ball.nextMovable.setDirection(x2 - x1, y2 - y1);
    this.ball.nextMovable.setSpeed(this.DEFAULT_BALL_SPEED);
    this.ball.setVisible(true);
    this.ball.posChanged = true;

    this.ball.onCollide = function (obj, timeDelta) {

        if (pong_game.ball.posChanged) { // return if another onCollide function already modified ball
            return;
        }
        var surface = obj.surface !== undefined ? obj.surface : obj;

        pong_game.ball.nextMovable.direction.setBounce(pong_game.ball.lastMovable.direction, surface.direction); // set next direction at bounce

        // increase speed on paddle tap
        if (obj.parent !== undefined && obj.parent.isTapped !== undefined && obj.parent.isTapped()) {
            pong_game.ball.nextMovable.setSpeed(pong_game.ball.lastMovable.speed * pong_game.DEFAULT_SPEED_MULTIPLIER);
        } else
            pong_game.ball.nextMovable.setSpeed(pong_game.ball.lastMovable.speed);

        var lastT = pong_game.ball.dTLast; // save expected T

        pong_game.ball.calculate(timeDelta, false); // calculate new position

        pong_game.ball.flush(); // copy next data to current data
        pong_game.ball.calculate(lastT - timeDelta);  // set the next position after bounce with new speed and direction
    };
};