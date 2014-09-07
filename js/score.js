pong_game.Score = (function () {
    /**
     *
     * @param scoreId {Number}
     * @constructor
     */
    function Score(scoreId) {
        this.node = scoreId;
        this.score = 0;
        this.posChanged = false;
    }

    Score.prototype.increment = function () {
        this.posChanged = false; // increment suppose to be atomic
        this.score = this.score + 1;
        this.posChanged = true;
    };
    return Score;
})();