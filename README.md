For å snakke med client:
npm install express @types/express
-------------------------------------------------------
GitHUB-kommandoer
Her er en oppsummering av trinnene de bør følge etter å ha gjort endringer:

1. Gjør endringer: Endre filene etter behov.
2. Legg til endringer: Legg til de endrede filene som skal inkluderes i neste commit:
git add .

1. Utfør commit: Commit de stagede endringene med en beskrivende melding:
git commit -m "Beskrivelse av endringer gjort"

1. Push endringer: Push de committede endringene til det fjerne (remote) git-repositoriet:
git push origin main
2. Bruk git pull-kommandoen for å trekke ned eventuelle oppdateringer fra GitHub til din lokale kopi av repositoryet. 

---------------------------- POSTMAN COMMANDS-----------------------------------------
1. Registrer spillere: Send en POST-forespørsel til http://localhost:2000/api/registrer eller /api/register med JSON-data i forespørselens kropp som inneholder spillernavnet. For eksempel::

kopier kode:
{
    "playerName": "John"
}
Dette vil registrere en spiller med navnet "John" og gi dem en tilfeldig plass (Nord, Sør, Øst, Vest). Den vil også si ifra når det er mer enn 4 spillere som prøver på registrere seg.

1. Få liste over spillere: Send en GET-forespørsel til http://localhost:2000/api/spillere eller /api/players for å hente listen over registrerte spillere.

1. Gi bud: Send en POST-forespørsel til http://localhost:2000/api/bud med JSON-data som inneholder posisjonen og budet. For eksempel:

kopier kode:
{
    "position": "nord",
    "bid": "Pass"
}
{
    "position": "øst",
    "bid": "1♠"
}
{
    "position": "sør",
    "bid": "Double"
}

GET-forespørselen http://localhost:2000/api/budhistorikk gjør at du får opp budhistorikken.

1. Del ut kort: Send en GET-forespørsel til http://localhost:2000/api/del eller /api/deal for å dele ut en hånd med kort fra kortstokken.

Se hender (NO):
- GET /api/nord-hand
- GET /api/ost-hand
- GET /api/syd-hand
- GET /api/vest-hand

Se hender (EN):
- GET /api/north-hand
- GET /api/east-hand
- GET /api/south-hand
- GET /api/west-hand

Reset spill:
- POST /api/reset

-------------------- MANGLER -----------------------------
1. Man kan melde litt hva som helst
2. Danne lag (N,S og W,E)



---Hva fungerer utmerket---
1. Registrere spillere
    - gi de en tilfeldig posisjon
2. Dele kortstokken
3. Se hver enkelt hånd til spillere
4. bud går på rundgang (nord,øst,sør,vest)
5. Når 3 stykker har POST Pass så kan kommer en melding om "spillet starter nå!"
