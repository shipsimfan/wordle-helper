String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

module.exports = (word) => {
    let game = {};

    game.word = word;
    game.guesses = 0;
    game.guess = function (guess) {
        if (guess == this.word)
            return "correct";

        this.guesses++;
        if (this.guesses >= 6)
            return "out of moves";

        let result = "bbbbb";
        let temp_word = this.word;

        // Note any correct letters and replace them
        for (let j = 0; j < 5; j++) {
            if (guess[j] == temp_word[j]) {
                result = result.replaceAt(j, 'g');
                guess = guess.replaceAt(j, ' ');
                temp_word = temp_word.replaceAt(j, ' ');
            }
        }

        // Find any yellow letters
        for (let j = 0; j < 5; j++) {
            if (guess[j] == ' ')
                continue;

            if (temp_word.includes(guess[j])) {
                result = result.replaceAt(j, 'y');
                temp_word = temp_word.replace(guess[j], ' ');
            }
        }

        return result;
    }

    return game;
}