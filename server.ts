// server.ts
import express, { Express, Request, Response } from 'express';
const app: Express = express();
const port = 3000;

// other code...

app.use(express.json());

// Lagrer meldingene midlertidig (dette kan endres basert på implementasjonsbehov)
let meldinger: string[] = [];

// API-rute for å motta meldinger fra spillere
app.post('/sendMelding', (req: Request, res: Response) => {
    const melding = req.body.melding;

    // Legg til meldingen i listen
    meldinger.push(melding);

    // Svar til klienten
    res.json({ suksess: true, melding: 'Melding mottatt' });

    // Sjekk om alle spillere har sendt en melding
    if (meldinger.length === 4) {
        // Logikk for å håndtere meldinger fra alle spillere, inkludert å vente på de neste tre spillerne
        // ... implementer videre bridge-logikk her ...
        console.log('Alle spillere har sendt en melding');
        // Nullstill listen med meldinger for neste runde
        meldinger = [];
    }
});

// Define a route handler for the root URL
app.get('/', (req: Request, res: Response) => {
    res.send('<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Bridge Server</title></head><body>Hello, this is the Bridge server!</body></html>');
});

app.listen(port, () => {
    console.log(`Serveren lytter på http://localhost:${port}`);
});
