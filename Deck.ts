//Her blir kortstokken laget, definert og stokket
// Denne klassen definerer kortklassen
export class Card {
    public name: string;
    public suit: string;
    public value: number;

    constructor(suit: string, name: string, value: number) {
        this.name = name;
        this.suit = suit;
        this.value = value;
    }
}

// Her defineres kortstokken med 52 kort
export class Deck {
    public cards: Card[];
    public suits: string[];
    public names: string[];
    public values: number[];

    constructor() {
        this.cards = [];
        this.suits = ['♥', '♠', '♦', '♣'];
        this.names = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
        this.values = [14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    }

    // Her blir kortstokken laget
    // Den første løkken vil iterere gjennom kortstokkens farger.
    // Den innebygde løkken vil iterere gjennom navnene og verdiene til kortene.
    // Dette vil legge til kortobjekter i den tomme kortstokken (cards array).
    public createDeck(): void {
        console.log('Creating a new Deck');
        for (let i = 0; i < this.suits.length; i++) {
            for (let n = 0; n < this.names.length; n++) {
                this.cards.push(new Card(this.suits[i], this.names[n], this.values[n]));
            }
        }
    }

    // Denne metoden vil stokke kortstokken
    // Denne for-løkken er satt til 52 iterasjoner fordi vi ønsker å stokke 52 kort
    // Dette vil ta det siste elementet i arrayet og multiplisere det med et tilfeldig tall
    // Dette vil sette variabelen randomItem til det spliced objektet basert på det tilfeldige tallet
    // Dette vil legge til det tilfeldige objektet fra oven i en ny tom array kalt
    public shuffleDeck(): Card[] {
        console.log('Shuffling Deck');
        const shuffledDeck: Card[] = [];
        for (let i = 0; i < 52; i++) {
            let randomPosition = Math.floor((this.cards.length - i) * Math.random());
            let randomItem = this.cards.splice(randomPosition, 1);
            shuffledDeck.push(...randomItem);
        }
        return shuffledDeck;
    }}
