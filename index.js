const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const new_game = require('./game');
const new_ai = require('./ai');

const WORDS_FILE = './words.txt';

console.log(" 1. Play a game");
console.log(" 2. Run AI");
console.log(" 3. Test AI");
let mode = parseInt(prompt("Please select an option: "));

if (mode == 1) {
    let word = prompt("Enter the word (leave blank for random): ");

    if (word == "") {
        fs.readFile(WORDS_FILE, 'utf8', (err, data) => {
            if (err)
                throw err;

            let words = data.split('\n');

            let word = words[Math.floor(Math.random() * words.length)];

            play(word);
        });
    } else {
        play(word);
    }
} else if (mode == 2) {
    fs.readFile(WORDS_FILE, 'utf8', (err, data) => {
        if (err)
            throw err;

        let ai = new_ai(data.split('\n'));
        let guess;

        while (ai.words.length > 1) {
            guess = ai.select_next_guess();
            console.log(`I guess ${guess}`);

            // Get result
            let result = prompt("Enter the result: ").toLowerCase();

            ai.filter_from_result(guess, result);
        }

        console.log(`The word is ${guess}`);
    });
} else {
    let runs = parseInt(prompt("How many runs would you like to do? "));
    let display_stumped = prompt("Would you like display stumped words? ");

    display_stumped = display_stumped == "yes" || display_stumped == "y";

    fs.readFile(WORDS_FILE, 'utf8', (err, data) => {
        if (err)
            throw err;

        let words = data.split('\n');

        let wins = 0;
        let winning_guesses = 0;
        let stumped_words = [];

        for (let i = 0; i < runs; i++) {
            let ai = new_ai(words);
            let game = new_game(words[Math.floor(Math.random() * words.length)]);

            while (true) {
                let guess = ai.select_next_guess();

                let result = game.guess(guess);

                if (result == "out of moves") {
                    if (display_stumped)
                        stumped_words.push(game.word);
                    break;
                } else if (result == "correct") {
                    wins++;
                    winning_guesses += game.guesses;
                    break;
                }

                ai.filter_from_result(guess, result);
            }
        }

        let losses = runs - wins;
        let win_rate = (wins * 100.0) / runs;

        let average_winning_guesses = (winning_guesses * 1.0) / wins;

        console.log("RESULTS");
        console.log(`   ${wins} wins, ${losses} losses (${win_rate.toFixed(2)}% wins)`);
        console.log(`   It took an average of ${average_winning_guesses.toFixed(2)} guesses to win`);


        if (stumped_words.length > 0 && display_stumped) {
            console.log(`   The following words stumped the ai:`);
            for (word of stumped_words) {
                console.log(`     - ${word}`);
            }
        }
    });
}

function play(word) {
    let game = new_game(word);

    while (true) {
        let guess = prompt("Enter your guess: ");

        let result = game.guess(guess);

        if (result == "correct") {
            console.log(`You guessed the correct word in ${game.guesses} guesses`);
            return;
        } else if (result == "out of moves")
            break;

        console.log(`                  ${result}`);
    }

    console.log("You have run out of guesses");
    console.log(`The word was ${game.word}`);
}