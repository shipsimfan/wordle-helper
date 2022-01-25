const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });
const WORDS_FILE = './words.txt';

fs.readFile(WORDS_FILE, 'utf8', (err, data) => {
    if (err)
        throw err;

    let words = data.split('\n');

    console.log(`${WORDS_FILE} contains ${words.length} words`);

    while (words.length > 1) {
        words = filter(words);

        let display = prompt("Display words? ").toLowerCase();
        if (display == "yes" || display == "y") {
            console.log();
            for (word of words) {
                console.log(word);
            }
            console.log();
        }
    }
});

function filter(words) {
    // Get user filter
    let filter_type = prompt("What type of filter? (con, notcon, multicon, at, notat) ").toLowerCase();
    let letter = prompt("What letter? ").toLowerCase()[0];
    let third_param;
    if (filter_type == "at" || filter_type == "notat" || filter_type == "multicon")
        third_param = parseInt(prompt(filter_type == "multicon" ? "How many? " : "Where? ")) - 1;

    // Create new words list
    let new_words = [];
    for (word of words) {
        let keep = true;
        if (filter_type == "con") {
            keep = false;
            for (wletter of word) {
                if (wletter == letter) {
                    keep = true;
                    break;
                }
            }
        } else if (filter_type == "notcon") {
            for (wletter of word) {
                if (wletter == letter) {
                    keep = false;
                    break;
                }
            }
        } else if (filter_type == "multicon") {
            let count = 0;
            for (wletter of word)
                if (wletter == letter)
                    count++;

            keep = count >= third_param;
        } else if (filter_type == "at")
            keep = word[third_param] == letter;
        else if (filter_type == "notat")
            keep = word[third_param] != letter;


        if (keep)
            new_words.push(word);
    }

    return new_words;
}