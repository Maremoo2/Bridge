/**
 * Players.ts
 *
 * Definerer farger og posisjoner, og et Express-router som kan
 * håndtere spiller-registrering på norsk (ikke brukt direkte av Server.ts i dag).
 * Filer i serveren importerer Posisjon-enen for å holde posisjonstyper konsistente.
 */
import express, { Request, Response } from 'express';

// Definer Suit enum (♥, ♠, ♦, ♣)
export enum Farge {
  Hjerter = '♥',
  Spar = '♠',
  Ruter = '♦',
  Kløver = '♣'
}

// Definer Position enum (nord/øst/sør/vest) – brukes på tvers av prosjektet
export enum Posisjon {
  Nord = "nord",
  Øst = "øst",
  Sør = "sør",
  Vest = "vest",
}

const router = express.Router();

// Eksempelstruktur for spillere med kort (ikke brukt av hovedserver, men nyttig for videre arbeid)
export const spillereMedKort: { navn: string; postkasseId: number; kort: { farge: Farge; navn: string; verdi: number }[] }[] = [
  { navn: 'Nord', postkasseId: 1, kort: [] },
  { navn: 'Øst', postkasseId: 2, kort: [] },
  { navn: 'Sør', postkasseId: 3, kort: [] },
  { navn: 'Vest', postkasseId: 4, kort: [] },
];

export { router };

// Definer posisjoner
const posisjoner: Posisjon[] = [Posisjon.Nord, Posisjon.Sør, Posisjon.Øst, Posisjon.Vest];

// Hold styr på tildelte posisjoner
let tildeltePosisjoner: Posisjon[] = [];

export let spillere: { navn: string, posisjon: Posisjon }[] = [];

// Sluttpunkt for å hente listen over spillere
router.get('/spillere', (req: Request, res: Response) => {
  res.json(spillere);
});

// Sluttpunkt for å registrere spillere (opprett en ny spiller)
router.post('/registrer', (req: Request, res: Response) => {
  if (spillere.length >= 4) {
    return res.status(400).json({ success: false, error: 'Maksimalt antall spillere nådd' });
  }

  const spillernavn: string = req.body.spillernavn;

  if (!spillernavn) {
    return res.status(400).json({ success: false, error: 'Spillernavn er påkrevd' });
  }

  // Bland posisjoner for å tildele tilfeldig
  let tilgjengeligePosisjoner = posisjoner.filter(pos => !tildeltePosisjoner.includes(pos));
  const tilfeldigPosisjon = tilgjengeligePosisjoner[Math.floor(Math.random() * tilgjengeligePosisjoner.length)];

  // Tildel posisjon til spiller
  const nySpiller = { navn: spillernavn, posisjon: tilfeldigPosisjon };
  spillere.push(nySpiller);
  tildeltePosisjoner.push(tilfeldigPosisjon);

  return res.json({ success: true, spiller: nySpiller, melding: `${spillernavn} registrert vellykket` });
});

export default router;
