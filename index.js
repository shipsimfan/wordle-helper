const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });

const WORDS_FILE = './words.txt';
const INITIAL_GUESS = "spain";

fs.readFile(WORDS_FILE, 'utf8', (err, data) => {
    if (err)
        throw err;

    let words = data.split('\n');

    console.log(`${WORDS_FILE} contains ${words.length} words`);

    let guess = INITIAL_GUESS; // Initial guess

    while (words.length > 1) {
        console.log(`I guess ${guess}`);
        // Get result
        let result = prompt("Enter the result: ").toLowerCase();

        words = filter_from_result(words, guess, result);
        guess = select_next_guess(words);
    }

    console.log(`The word is ${guess}`);
});

function select_next_guess(words) {
    // Search for the first word without repeated letters
    for (word of words) {
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

    return words[0]; // If all words have repeated letters, just return the first
}

function filter_from_result(words, guess, result) {
    let con = {};
    let notcon = [];

    for (let i = 0; i < 5; i++) {
        let letter = guess[i];

        if (result[i] == 'b') {
            notcon.push(letter);
            words = filter(words, "notat", letter, i);
        } else if (result[i] == 'y') {
            if (letter in con)
                con[letter]++;
            else
                con[letter] = 1;

            words = filter(words, "notat", letter, i);
        } else if (result[i] == 'g') {
            if (letter in con)
                con[letter]++;
            else
                con[letter] = 1;

            words = filter(words, "at", letter, i);
        }
    }

    for (letter of notcon)
        if (!(letter in con))
            words = filter(words, "notcon", letter, undefined);

    for (letter in con)
        words = filter(words, "multicon", letter, con[letter]);

    return words;
}

function filter(words, filter_type, letter, third_param) {
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
    for (word of words) {
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

    return new_words;
}
