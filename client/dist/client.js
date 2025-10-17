// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
// Function to fetch and update player names
function updatePlayerNames() {
    fetch('/api/players')
        .then(response => response.json())
        .then(players => {
            // Update usernames on the HTML page
            players.forEach(player => {
                const position = player.position; // Keep original case (North, South, East, West)
                const usernameElement = document.querySelector(`.${position}-deck .username`);
                if (usernameElement) {
                    usernameElement.textContent = player.name;
                }
            });
        })
        .catch(error => console.error('Error fetching player names:', error));
}

// Call the function initially to set up the initial state
updatePlayerNames();

// Optionally, set up a periodic refresh to keep the usernames up-to-date
setInterval(updatePlayerNames, 5000); // Refresh every 5 seconds (adjust as needed)


    // Function to register a new player
    function registerPlayer(playerName) {
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerName: playerName })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // After registering a new player, update the player names on the website
            updatePlayerNames();
        })
        .catch(error => console.error('Error registering player:', error));
    }

    // Function to fetch and display cards for a specific player
    function fetchAndDisplayCards(position) {
    fetch(`/api/${position.toLowerCase()}-hand`)
        .then(response => response.json())
        .then(handData => {
            const { hand, count } = handData;
            console.log(`${position} hand:`, hand);

            // Display the cards in the hand
            const cardContainer = document.getElementById(`${position}-cards`);
            cardContainer.innerHTML = ''; // Clear existing cards
            hand.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.textContent = `${card.rank} ${card.suit}`;
                cardContainer.appendChild(cardElement);
            });

            // Update the number of cards text
            const cardCountElement = document.querySelector(`.${position}-deck .card-count`);
            if (cardCountElement) {
                cardCountElement.textContent = `Antall kort: ${count}`;
            }
        })
        .catch(error => console.error(`Error fetching ${position} hand:`, error));
}


    // Call the function initially to set up the initial state
    updatePlayerNames();

    // Optionally, set up a periodic refresh to keep the usernames up-to-date
    setInterval(updatePlayerNames, 5000); // Refresh every 5 seconds (adjust as needed)

// Deal button click event handler
document.getElementById('dealBtn').addEventListener('click', () => {
    fetch('/api/deal') // Change method to GET
        .then(response => response.json())
        .then(() => {
            // Send notification that cards have been dealt
            console.log('Cards have been dealt');
            // Refresh player names after dealing
            updatePlayerNames();
        })
        .catch(error => console.error('Error dealing cards:', error));
});

    // Add click event handlers to player containers to fetch and display their cards
    document.querySelectorAll('.deck').forEach(deck => {
        deck.addEventListener('click', () => {
            const position = deck.classList[0].split('-')[0]; // Extract position from class (e.g., 'North-deck' -> 'North')
            fetchAndDisplayCards(position);
        });
    });
});
