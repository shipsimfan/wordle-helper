# Worlde Helper
A helper program for the wordle puzzle game.

## Running
Before running for the first time, run the following:
```sh
npm install
```

To run, use the following command:
```sh
node .
```

The program starts with a list of all 5-letter English words. It then asks you
for types of filters it should apply to those words. The filters are based on 
what letters are or are not correct in your guesses. All parameters for filters
are asked after the type of filter is selected. The types of filters are as 
follows:
 * con (Contains) - Only keeps words which contain the given letter
 * notcon (Not Contains) - Only keeps words which do not contain the given 
    letter
 * multicon (Multiple Contain) - Only keeps words which have at least the 
    specified number of the given letter
 * at (At) - Only keeps words which contain the given letter at the specified
    position (1 - 5)
 * notat (Not At) - Only keeps words which do not contain the given letter at 
    the specified position (1 - 5)
