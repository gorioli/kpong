/**
 * Starting point of running
 */
window.onload = function () {

    pong_game.scores.left = new pong_game.score_proto(score1);
    pong_game.scores.right = new pong_game.score_proto(score2);
    pong_game.startGame(); // for ball_v2

    //pong_game.ball.startup(); // for ball_v1
}



