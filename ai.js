module.exports = (initial_words) => {
    let ai = {};

    ai.words = initial_words;
    ai.select_next_guess = function () {
        // Search for the first word without repeated letters
        for (word of this.words) {
            let repeat = false;
            let letters = [];
            for (letter of word) {
                for (l of letters) {
                    if (l == letter) {
                        repeat = true;
                        break;
                    }
                }

                if (repeat) {
                    break;
                } else {
                    letters.push(letter);
                }
            }

            if (!repeat)
                return word;
        }

        return this.words[0]; // If all words have repeated letters, just return the first
    }

    ai.filter_from_result = function (guess, result) {
        let con = {};
        let notcon = [];

        for (let i = 0; i < 5; i++) {
            let letter = guess[i];

            if (result[i] == 'b') {
                notcon.push(letter);
                this.filter("notat", letter, i);
            } else if (result[i] == 'y') {
                if (letter in con)
                    con[letter]++;
                else
                    con[letter] = 1;

                this.filter("notat", letter, i);
            } else if (result[i] == 'g') {
                if (letter in con)
                    con[letter]++;
                else
                    con[letter] = 1;

                this.filter("at", letter, i);
            }
        }

        for (letter of notcon)
            if (!(letter in con))
                this.filter("notcon", letter, undefined);

        for (letter in con)
            this.filter("multicon", letter, con[letter]);
    }

    ai.filter = function (filter_type, letter, third_param) {
        let invert = false;
        if (filter_type == "con" || filter_type == "notcon") {
            if (filter_type == "notcon")
                invert = true;
            filter_type = "multicon";
            third_param = 1;
        } else if (filter_type == "notat") {
            invert = true;
            filter_type = "at";
        }

        // Create new words list
        let new_words = [];
        for (word of this.words) {
            let keep = true;
            if (filter_type == "multicon") {
                let count = 0;
                for (wletter of word)
                    if (wletter == letter)
                        count++;

                keep = count >= third_param;
            } else if (filter_type == "at")
                keep = word[third_param] == letter;

            if (invert)
                keep = !keep;

            if (keep)
                new_words.push(word);
        }

        this.words = new_words;
    }

    return ai;
}
