```typescript
//Server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import http from 'http';
import { Posisjon } from './Players';
import Deck, { Kort } from './Deck'; // Importer kort fra Deck
import { BudOgSpørsmål, Budtype } from './BidAndAsk';

const app: Express = express();
const port = 2000;

app.use(express.json());

// Mellomvare for å håndtere CORS-headere
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Server statiske filer
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

// Spillere
export let players: { name: string, position: Posisjon }[] = [];

// Helpers to align with client expectations
const positionToEnglish = (p: Posisjon): 'North' | 'South' | 'East' | 'West' => {
  switch (p) {
    case Posisjon.Nord: return 'North';
    case Posisjon.Sør: return 'South';
    case Posisjon.Øst: return 'East';
    case Posisjon.Vest: return 'West';
  }
};

type ClientCard = { suit: string; rank: string };
const serializeCard = (k: Kort): ClientCard => ({ suit: k.farge, rank: k.navn });

// Sluttpunkt for å hente listen over spillere (NO)
app.get('/api/spillere', (req: Request, res: Response) => {
  res.json(players);
});

// Endpoint expected by client: list players with English positions
app.get('/api/players', (req: Request, res: Response) => {
  const clientPlayers = players.map(p => ({ name: p.name, position: positionToEnglish(p.position) }));
  res.json(clientPlayers);
});

// Sluttpunkt for å registrere spillere (opprett en ny spiller) (NO)
app.post('/api/registrer', (req: Request, res: Response) => {
  if (players.length >= 4) {
    return res.status(400).json({ success: false, error: 'Maksimalt antall spillere nådd' });
  }

  const playerName: string = req.body.playerName;

  if (!playerName) {
    return res.status(400).json({ success: false, error: 'Spillernavn er påkrevd' });
  }

  // Tildel posisjon til spiller
  const positions: Posisjon[] = [Posisjon.Nord, Posisjon.Sør, Posisjon.Øst, Posisjon.Vest];
  const availablePositions = positions.filter(pos => !players.some(player => player.position === pos));
  if (availablePositions.length === 0) {
    return res.status(400).json({ success: false, error: 'Alle posisjoner er opptatt' });
  }
  const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];

  // Legg til spiller i listen
  const newPlayer = { name: playerName, position: randomPosition };
  players.push(newPlayer);

  return res.json({ success: true, player: newPlayer, message: `${playerName} registrert vellykket` });
});

// English alias expected by client
app.post('/api/register', (req: Request, res: Response) => {
  if (players.length >= 4) {
    return res.status(400).json({ success: false, error: 'Maximum number of players reached' });
  }

  const playerName: string = req.body.playerName;
  if (!playerName) {
    return res.status(400).json({ success: false, error: 'playerName is required' });
  }

  const positions: Posisjon[] = [Posisjon.Nord, Posisjon.Sør, Posisjon.Øst, Posisjon.Vest];
  const availablePositions = positions.filter(pos => !players.some(player => player.position === pos));
  if (availablePositions.length === 0) {
    return res.status(400).json({ success: false, error: 'All positions are taken' });
  }
  const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];

  const newPlayer = { name: playerName, position: randomPosition };
  players.push(newPlayer);
  return res.json({ success: true, player: newPlayer, message: `${playerName} registered` });
});

// Bud og Spørsmål
let budOgSpørsmål = new BudOgSpørsmål(); // Opprett en instans av BudOgSpørsmål

// Eksempelbruk
app.post('/api/bud', (req: Request, res: Response) => {
  const { position, bid } = req.body;
  if (!position || !bid) {
    return res.status(400).json({ success: false, error: 'Posisjon og bud er påkrevd' });
  }

  const success = budOgSpørsmål.gjørBud(position, bid);
  if (success) {
    return res.json({ success: true, message: 'Bud utført vellykket' });
  } else {
    return res.status(400).json({ success: false, error: 'Feilet i å gjøre bud' });
  }
});

// Endpoint for getting the bid history
app.get('/api/budhistorikk', (req, res) => {
  const budhistorikk = budOgSpørsmål.getBudhistorikk();
  res.json(budhistorikk);
});

// Nåværende auksjons-tilstand (neste budgiver, høyeste kontrakt, historikk)
app.get('/api/state', (_req: Request, res: Response) => {
  const next = budOgSpørsmål.getNesteBudgiver();
  const highest = budOgSpørsmål.getHøyesteKontrakt();
  return res.json({ nextBidder: next, highestContract: highest, history: budOgSpørsmål.getBudhistorikk() });
});

// Lagoppstilling (NS og EW) av registrerte spillere
app.get('/api/teams', (_req: Request, res: Response) => {
  const NS = players.filter(p => p.position === Posisjon.Nord || p.position === Posisjon.Sør).map(p => p.name);
  const EW = players.filter(p => p.position === Posisjon.Øst || p.position === Posisjon.Vest).map(p => p.name);
  res.json({ NS, EW });
});

// Kortstokk
let kortstokk = new Deck(); // Opprett en instans av Deck

let nordHånd: Kort[], østHånd: Kort[], sydHånd: Kort[], vestHånd: Kort[]; // Definer hender globalt
let kortDelt = false; // Variabel for å spore om kort er delt

app.get('/api/del', (req: Request, res: Response) => {
  if (kortDelt) {
    return res.status(400).json({ success: false, message: 'Kortene er allerede delt' });
  }

  // Del kort til hver spiller
  nordHånd = kortstokk.delUt();
  østHånd = kortstokk.delUt();
  sydHånd = kortstokk.delUt();
  vestHånd = kortstokk.delUt();

  kortDelt = true; // Oppdater variabelen for å indikere at kort er delt

  // Beregn antallet kort i hver hånd
  const nordHåndAntall = nordHånd.length;
  const østHåndAntall = østHånd.length;
  const sydHåndAntall = sydHånd.length;
  const vestHåndAntall = vestHånd.length;

  console.log('Kort delt (NO)');
  // Returner hendene til alle spillere sammen med antall kort
  return res.json({
    success: true,
    message: 'Kortene er delt',
    hender: {
      nord: nordHånd,
      øst: østHånd,
      syd: sydHånd,
      vest: vestHånd
    },
    tellinger: {
      nord: nordHåndAntall,
      øst: østHåndAntall,
      syd: sydHåndAntall,
      vest: vestHåndAntall
    }
  });
});

// English alias expected by client
app.get('/api/deal', (req: Request, res: Response) => {
  if (kortDelt) {
    return res.status(400).json({ success: false, message: 'Cards already dealt' });
  }
  nordHånd = kortstokk.delUt();
  østHånd = kortstokk.delUt();
  sydHånd = kortstokk.delUt();
  vestHånd = kortstokk.delUt();
  kortDelt = true;
  console.log('Cards dealt');
  return res.json({ success: true, message: 'Cards dealt' });
});


// Sluttpunkt for å se Nordens hånd
app.get('/api/nord-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: nordHånd
  });
});

// Sluttpunkt for å se Østs hånd
app.get('/api/ost-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: østHånd
  });
});

// Sluttpunkt for å se Sørs hånd
app.get('/api/syd-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: sydHånd
  });
});

// Sluttpunkt for å se Vestens hånd
app.get('/api/vest-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: vestHånd
  });
});

// English hand endpoints expected by client
app.get('/api/north-hand', (req: Request, res: Response) => {
  if (!kortDelt) return res.status(400).json({ success: false, error: 'Cards not dealt yet' });
  const hand = nordHånd.map(serializeCard);
  console.log('GET north-hand', hand.length);
  return res.json({ success: true, hand, count: hand.length });
});

app.get('/api/east-hand', (req: Request, res: Response) => {
  if (!kortDelt) return res.status(400).json({ success: false, error: 'Cards not dealt yet' });
  const hand = østHånd.map(serializeCard);
  console.log('GET east-hand', hand.length);
  return res.json({ success: true, hand, count: hand.length });
});

app.get('/api/south-hand', (req: Request, res: Response) => {
  if (!kortDelt) return res.status(400).json({ success: false, error: 'Cards not dealt yet' });
  const hand = sydHånd.map(serializeCard);
  console.log('GET south-hand', hand.length);
  return res.json({ success: true, hand, count: hand.length });
});

app.get('/api/west-hand', (req: Request, res: Response) => {
  if (!kortDelt) return res.status(400).json({ success: false, error: 'Cards not dealt yet' });
  const hand = vestHånd.map(serializeCard);
  console.log('GET west-hand', hand.length);
  return res.json({ success: true, hand, count: hand.length });
});

// Reset endpoint to allow re-dealing
app.post('/api/reset', (_req: Request, res: Response) => {
  kortstokk = new Deck();
  nordHånd = [] as unknown as Kort[];
  østHånd = [] as unknown as Kort[];
  sydHånd = [] as unknown as Kort[];
  vestHånd = [] as unknown as Kort[];
  kortDelt = false;
  budOgSpørsmål = new BudOgSpørsmål();
  console.log('Game reset');
  return res.json({ success: true, message: 'Reset done' });
});


// Opprett en HTTP-server og fest Express-appen
const server = http.createServer(app);

// Serverlytting
server.listen(port, () => {
  console.log(`Serveren lytter på http://localhost:${port}`);
});

// Behandle SIGTERM
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Serveren terminert');
  });
});

// Favicon to avoid 404 noise
app.get('/favicon.ico', (_req: Request, res: Response) => res.status(204).end());

// Catch-all 404 JSON for API
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});
```