const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });

const WORDS_FILE = './words.txt';

let word = prompt("Enter the word (leave blank for random): ");

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

if (word == "") {
    fs.readFile(WORDS_FILE, 'utf8', (err, data) => {
        if (err)
            throw err;

        let words = data.split('\n');

        let word = words[Math.floor(Math.random() * words.length)];

        play(word);
    });
} else {
    play(word)
}

function play(word) {
    for (let i = 0; i < 6; i++) {
        let guess = prompt("Enter your guess: ");
        let result = "bbbbb";
        let temp_word = word;

        if (guess == word) {
            console.log("You guessed the correct word!");
            return;
        }

        // Note any correct letters and replace them
        for (let j = 0; j < 5; j++) {
            if (guess[j] == word[j]) {
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

        console.log(`                  ${result}`);
    }

    console.log("You have run out of guesses");
    console.log(`The word was ${word}`);
}