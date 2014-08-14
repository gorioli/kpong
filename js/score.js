pong_game.score_proto = (function () {
    /**
     *
     * @param scoreId {Number}
     * @constructor
     */
    function Score(scoreId) {
        this.scoreId = scoreId;
        this.score = 0;
        scoreId.innerText = this.score;
    }

    Score.prototype.update = function () {
        this.score = this.score + 1;
        this.scoreId.innerText = this.score;
    }
    return Score;
})();