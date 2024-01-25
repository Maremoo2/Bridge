// script.js

// Importing the Card and Deck classes from deck.js using named imports
import { Card, Deck } from "./deck.js";

// Creating a new instance of the Deck class
const deck = new Deck();

// Creating the deck
deck.createDeck();

// Shuffling the deck
const shuffledDeck = deck.shuffleDeck();

// Logging the shuffled cards
console.log(shuffledDeck);
