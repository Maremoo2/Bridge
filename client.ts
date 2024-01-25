// client.ts

// En enkel måte å gjøre dette på klienten (kan variere avhengig av frontend-rammeverket)
async function sendMelding(melding: string) {
    const respons = await fetch('http://localhost:3000/sendMelding', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ melding }),
    });

    const data = await respons.json();
    console.log(data);
}

// Bruk denne funksjonen når en spiller sender en melding
sendMelding('1 hjerter');
