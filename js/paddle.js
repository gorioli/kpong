pong_game.paddle_proto = (function () {
    // window.requestAnimationFrame schedules a function to be executed at the next frame, similar to setTimeout(fn, 0) but synchronized.
    var raf = window.requestAnimationFrame;

    /**
     *
     * @param paddleId {number} - paddle paddleId
     * @constructor
     */
    function Paddle(paddleId) {
        this.positionY = 0; // keeps track of y coordinate of paddles top corner, is equal to paddleN.style.top
        this.timeTouchStart = 0;
        var __paddleId = paddleId; // reference to its DOM object paddleId -> div tag of left/right paddle
        var me = this;


        // raf - requestAnimationFrame for DOM update
        raf(function () { // initial y position of the paddle
            me.positionY = Math.floor(window.innerHeight / 3);
            __paddleId.style.top = me.positionY + "px";
            __paddleId.style.display = "block";
        });

        var touchMove = function (ev) { // callback of touch event
            console.log("move");
            ev.preventDefault(); // this also disables scrolling

            var touch = ev.changedTouches[0];


            if (__paddleId === paddle1) { // we are on the left paddle
                if (touch.pageX > pong_game.paddleWidth) { // event touch belongs to the right panel
                    if (ev.changedTouches.length > 1) { // if there are two paddles touched
                        touch = ev.changedTouches[1];
                    } else {
                        return;
                    }
                }
            }
            else { // we are on the right paddle
                if (touch.pageX < pong_game.paddleWidth) { // event touch belongs to the left panel
                    if (ev.changedTouches.length > 1) {
                        touch = ev.changedTouches[1];
                    } else {
                        return;
                    }
                }
            }

            me.positionY = touch.screenY - pong_game.halfPaddleHeight;

            if (0 <= me.positionY && me.positionY <= window.innerHeight - pong_game.paddleHeight) {
                raf(function () {
                    __paddleId.style.top = me.positionY + "px";
                });
            }
        }

        var touchStart = function (ex) {
            console.log("start");
            ex.preventDefault();
            me.timeTouchStart = Date.now();
        }

        var touchEnd = function (ex) {
            console.log("end");
            ex.preventDefault();
            if(Date.now() - me.timeTouchStart > 400){
                me.timeTouchStart = 0;
            }
            else{
                me.timeTouchStart = Date.now();
            }
        }

        __paddleId.addEventListener('touchmove', touchMove, false);
        __paddleId.addEventListener('touchstart', touchStart, false);
        __paddleId.addEventListener('touchend', touchEnd, false);

    };


    return Paddle;
})();