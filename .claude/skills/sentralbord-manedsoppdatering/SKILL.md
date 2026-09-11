---
name: sentralbord-manedsoppdatering
description: Kjør den månedlige regnskaps- og driftsoppdateringen for We4you AS sitt sentralbord — henter ferske tall fra Tripletex (salg, leverandørreskontro, likviditet), Zisson (samtalestatistikk/SLA) og Bigin CRM («Pipeline Geir», salgspipeline), og oppdaterer BEGGE Lovable-nettsidene («we4you-sentralbord-styre»-dashboardet og «We4you bemanning»-presentasjonen, som er Git-synket til GitHub-repoet BookingkodenAS/Sentralbord-bemanning). Bruk denne skillen når Geir ber om «oppdater sentralbordet», «månedsoppdatering», «kjør sentralbord-rutinen», «oppdater dashboardet og GitHub/Lovable», «hent Bigin/Pipeline Geir», eller når den månedlige scheduled-rutinen («10. i måneden») trigger den. Dette er den KORREKTE, oppdaterte etterfølgeren til den eldre «sentralbordet»-skillen — bruk denne fremfor den gamle, som refererer til feil Lovable-prosjekt-ID-er og et Chrome-basert GitHub-verktøy som ikke finnes i denne miljøet.
---

# /sentralbord-manedsoppdatering — Månedlig regnskaps- og driftsoppdatering

Du er regnskapsmessig og teknisk analytiker for We4you AS sitt sentralbord. Denne skillen kjører
én gang i måneden (rundt den 10.) og friskner opp alle tall siden forrige kjøring, deretter
oppdaterer den de to Lovable-eiendelene som utgjør styringsrapporteringen for selskapet.

**Viktig miljø-merknad:** Denne skillen er skrevet for den skybaserte Claude-sesjonen tilknyttet
GitHub-repoet `BookingkodenAS/Sentralbord-bemanning`. Den ELDRE skillen «sentralbordet» ble skrevet
for en annen kontekst (lokal Claude Desktop m/Chrome-utvidelse) og refererer til feil Lovable-
prosjekt-ID-er og et `claude-in-chrome`-verktøy som ikke finnes her. Ikke bland ressursene fra de to
skillene.

**Viktig om lagringssted for dette skillet selv:** Styringen ligger HER, i selve GitHub-repoet
(`BookingkodenAS/Sentralbord-bemanning`, sti `.claude/skills/sentralbord-manedsoppdatering/SKILL.md`
på `main`), IKKE i kontoens `/root/.claude/skills/synced/...`-mappe. Den mappen synkes periodisk ned
fra kontoens skill-lager og overskriver lokale filer som ikke er registrert der — et tidligere forsøk
på å legge skillet der ble slettet av nettopp denne synken. Ved å committe SKILL.md til repoet i
stedet, plukkes den automatisk opp av enhver Claude Code-økt (inkl. den månedlige automatiske
rutinen) som har dette repoet checket ut, uavhengig av kontoens skill-synk. **Når du oppdaterer
denne skillen — nye referansetall, ny metode, rettelser — rediger filen direkte i repoet og committ/
pusht endringen (til `main`, siden det er branchen automatiserte økter kloner), ikke i en lokal
scratchpad-kopi som forsvinner når økten avsluttes.**

## Ressurser i DENNE sesjonen (bruk alltid disse, aldri verdiene fra den gamle skillen)

| Ressurs | Verdi |
|---|---|
| Lovable-dashboard («styredashboard», Chart.js, KPI-kort) | prosjekt-ID `865f94d7-1b48-4bf4-8c81-09544711ff59` (we4you-sentralbord-styre), url `we4you-sentralbord-styre.lovable.app` |
| Lovable-presentasjon («We4you bemanning», 13+ slides) | prosjekt-ID `65d401eb-554a-4c06-a71d-eed34b896bd4` (look-and-smile), url `look-and-smile.lovable.app`. **Dette prosjektet er Git-synket til GitHub-repoet `BookingkodenAS/Sentralbord-bemanning`** — når Lovable-agenten commiter en endring her, oppdateres GitHub normalt automatisk, men synken kan ta flere minutter eller utebli. |
| GitHub-repo | `BookingkodenAS/Sentralbord-bemanning`, branch `main`. Hvis `git log origin/main` ikke viser Lovables nye commit innen ~4 minutter (poll med Monitor-tool, ikke Bash-sleep), hent filene direkte fra Lovable (`mcp__Lovable__read_file` for `src/content/presentation.html` og `src/routes/index.tsx`) og push dem manuelt til `main` som en sikkerhetsmekanisme (`git checkout -B tmp-sync origin/main`, kopier inn filene, commit, `git push origin tmp-sync:main`, rydd opp branchen etterpå). |
| Bigin CRM — «Pipeline Geir» | Via `mcp__Zapier__*`, `selected_api: "BiginCLIAPI"`, org-id `915563000000023712` ("Bookingkoden AS"). Se eget avsnitt under for identifikasjon og spørremetode — IKKE anta at «Pipeline Geir» er noe annet enn selve hoved-pipelinen. |
| Zisson-statistikk | Enten vedlagt av Geir i chatten (xlsx), eller hentet via `mcp__Microsoft_365__outlook_email_search` (avsender "zisson" / `query: "Zisson statistics"`) mot Geirs egen innboks. |
| Tripletex | `mcp__Tripletex__*` direkte (search_invoices, search_supplier_invoices, search_ledger_postings). IKKE bruk `tripletex_run_script` for store batcher — den rammes lett av 429 rate-limiting; paginer heller direkte. |

## Steg 1 — Tripletex: salgsinntekter

Bruk `search_invoices`. Hent kun måneder som ikke allerede er verifisert (se referansetabellen
nederst i dette dokumentet — oppdater den etter hver kjøring).

**Sentralbordkunder**: AS/SA-bedrifter med løpende fakturaer ≥ 1 000 NOK. Utelat privatpersoner,
DA-selskaper, support-engangsfakturaer (993,75 NOK), og fakturaer med `isCredited: true` (sjekk om
en kreditert faktura har en erstatningsfaktura som skal inkluderes i stedet).

## Steg 2 — Tripletex: leverandørreskontro

**Bruk alltid `amountCurrency`, ikke `amount`** (fakturaer i bilagsmottak har `amount = 0`). Paginer
til `hasMore` er false.

**Avdelingsregel for Sentralbordet vs. VPN** (etablert og verifisert tidligere): fakturaer fra
Telenor (Telenor Norge AS / Telenor Infra AS) ELLER med en kostnadslinje postert på konto 4300
(Innkjøp varer, høy mva) → avdeling VPN. Alle andre leverandørfakturaer → Sentralbordet. Denne
regelen overstyrer Tripletex sin egen avdelingstagging på leverandørfakturaer, fordi de fleste
leverandørfakturaer aldri var avdelingstagget i utgangspunktet.

## Steg 3 — Likviditet (AR/AP)

`search_invoices` (AR, 6 mnd tilbake, `amountOutstanding > 0`) og `search_supplier_invoices` (AP,
3 mnd tilbake). Netto arbeidskapital = Total AR − Total AP. Trafikklys: Grønn > 50k, Gul 0–50k,
Rød < 0.

## Steg 4 — Zisson samtalestatistikk

### Filformat-deteksjon (KRITISK — verifisert flere ganger, ikke stol blindt på filens egen sum)

To kjente kolonneformater:
- **Format A**: `[navn, intervall, alle_anrop, ubesvart, besvart, svar%, innen 5 sek, ...]`
- **Format B** (vanligst fra juni 2026): `[navn, intervall, alle_anrop, totale_anrop, ubesvart, besvart, svar%, innen 5 sek, ...]` (ekstra dublettkolonne "Totale anrop")

**Kolonneforskyvning-fellen** (funnet i juni 2026-filen): enkelte rader i "Alle"-arket manglet
"Totale anrop"-kolonnen, noe som forskjøv resten av raden og ga feil besvart-tall ved naiv summering.
Sjekk ALLTID: for hver rad, er `Alle anrop == Totale anrop`? Hvis ja → normal kolonnemapping. Hvis
nei/mangler → raden er sannsynligvis forskjøvet; rekonstruer `Besvart = round(Alle_anrop × lagret Svar%)`
i stedet for å stole på kolonneposisjonen. Sammenlign alltid din egen sum mot filens "Totalt"-rad —
et avvik er et varsel om at noen rader er forskjøvet, IKKE noe å ignorere.

**Bruk alltid "All queues" / "Total"-raden** for månedens grandtotal (ikke summer per-kunde-rader
selv — det gir lett dobbelttelling av callback-køer). Ekskluder "We4you (1207)" som intern testkø.

### SLA-formel (KRITISK — verifisert mot allerede publiserte dashboardtall, stol på denne)

Andel besvart innen D-sek (20 sek) / E-sek (40 sek) = `Besvart innen D/E sek inkl. tilbakering`
**÷ Alle anrop** (IKKE ÷ Besvart, og IKKE ÷ "reelle" D-sekund-korrigerte anrop — det er en annen
metrikk, se under).

**D-sekund-korrigert svarprosent** (separat metrikk — "ble noen i det hele tatt besvart, korrigert
for at noen legger på før agenten rekker å svare"): `reelle_anrop = alle_anrop − lagt_på_innen_D_sek`,
`korrigert_svar% = besvart ÷ reelle_anrop`. Ikke forveksle denne med SLA-prosenten over.

D/E-sekund-data (og dermed SLA %) er kun tilgjengelig i eksporter fra juni 2026 og senere
("Kødetaljer første kø"-arket). Eldre måneder (jan–mai) har kun rå besvart%, ikke SLA-prosent.

## Steg 5 — Bigin CRM pipeline («Pipeline Geir»)

### Identifikasjon (avklart 11. sep 2026 — ikke gjett på nytt)

Geir sin CRM-pipeline vises i Bigin-UI under navnet **«Pipeline Geir»**
(`https://bigin.zoho.eu/bigin/bookingkoden/Home#/deals/kanban/915563000000030987?pipeline=915563000000032043&sub_pipeline=915563000000516846`).
Dette er IKKE et eget modul/objekt utenfor det vi allerede har hentet fra — «Pipeline Geir» er ganske
enkelt visningsnavnet (Layout-navnet, id `915563000000032043`) på selve hoved-pipelinen i Bigin sin
`Pipelines`-modul (API-modulnavn `Pipelines`, ikke `Deals` — `Deals` fungerer som alias i COQL men
`Pipelines` er det korrekte REST-modulnavnet). Det finnes for øyeblikket kun ÉN pipeline med data i
denne kontoen; en sub-pipeline-verdi «Sales Pipeline Standard 1» finnes som valg i feltlisten men har
0 poster. Ikke bruk tid på å lete etter en separat "Pipeline Geir"-fil eller -modul igjen — dette ER
dataene skillet allerede henter, forutsatt at du bruker riktig spørremetode under.

### Anbefalt spørremetode (mer robust enn COQL for dette formålet)

`get_records_coql` (`select_query` med `WHERE`-klausul) fungerer, men er skjør for enkelte felt
(f.eks. `Sub_Pipeline` gir "column given seems to be invalid"). Foretrekk i stedet et direkte GET-kall
via `bigin_by_zoho_crm_make_api_get_request`:

```
url: https://www.zohoapis.eu/bigin/v2/Pipelines
querystring: { fields: "Deal_Name,Amount,Stage,Closing_Date,Created_Time", per_page: "200" }
```

Dette ga 82 poster i én side (`more_records: false`), inkl. et `Pipeline: {name, id}`-objekt du kan
bruke til å bekrefte at posten faktisk tilhører «Pipeline Geir» (id `915563000000032043`) dersom det
noensinne dukker opp en post med et annet pipeline-navn. Filtrer bort `Amount` som er `null` eller
`0` for pipeline-beregningene (72 av 82 poster per 11. sep 2026 hadde reelt beløp).

Kategorier (`Stage`-feltet):
- **Åpen**: Prospekt, Interessert, Tilbud sendt, Forhandling - vurderes av kunde
- **Vunnet**: Vunnet / Closed Won
- **Tapt**: Tapt / Closed Lost

Beregn: total åpen pipeline (NOK/mnd + antall), avansert stadium (Tilbud sendt + Forhandling —
nærmest lukking), overforfalte åpne deals (`Closing_Date < i dag`), vunnet hittil i år (YTD),
winrate = vunnet / (vunnet + tapt).

**NB:** Disse tallene kan endre seg mye fra måned til måned (nye deals legges inn løpende) — ikke
anta at forrige måneds referansetall fortsatt stemmer noenlunde; hent alltid ferskt.

## Steg 6 — Kapasitetsutnyttelse

Faktiske samtaler (Zisson All queues) ÷ maks kapasitet × 100. Maks kapasitet = samtaler/agent/dag-norm
(150) × antall FTE × arbeidsdager i måneden.

## Steg 7 — Oppdater Lovable-dashboardet (styredashboard)

Bruk `mcp__Lovable__send_message` mot prosjekt `865f94d7-1b48-4bf4-8c81-09544711ff59`. Skriv en
strukturert, presis naturlig-språk-beskjed (IKKE full HTML/TSX — Lovable-agenten redigerer koden
selv) med: nye MONTHLY-rader, korrigerte Zisson-tall og SLA, oppdatert Bigin-pipeline-seksjon,
oppdatert "sist oppdatert"-tidsstempel, og eventuelle nye alert-tekster. Be den publisere når den
er ferdig.

**Forvent at `send_message` kan gi en klient-side timeout etter 60 sekunder selv om meldingen ble
mottatt og Lovable-agenten fortsatt jobber.** Ikke tolk dette som feil — bruk `list_messages` eller
`get_message` for å polle status (`status: "completed"` = ferdig, `"accepted"`/ingen assistant-svar
ennå = fortsatt i arbeid). Vent og poll i stedet for å sende meldingen på nytt.

## Steg 8 — Oppdater Lovable-presentasjonen (We4you bemanning / GitHub)

Samme fremgangsmåte mot prosjekt `65d401eb-554a-4c06-a71d-eed34b896bd4`. Be den oppdatere KUN
tall/datostempler i de relevante slidene (finansielle tall, Zisson-statistikk, Bigin-pipeline,
leverandørreskontro-slide) — ikke rør annet innhold (f.eks. e-post/eSMS/Veidekke-teksten) med mindre
datoene der er utdatert. Siden dette prosjektet er Git-synket, oppdateres GitHub-repoet normalt
automatisk når Lovable commiter — men verifiser alltid med `git log origin/main` (poll med
Monitor-tool i inntil ~4 minutter). Hvis auto-synken ikke lander, bruk sikkerhetsmekanismen beskrevet
i ressurstabellen øverst (hent filene fra Lovable, push direkte til `main`).

## Steg 9 — Flagg alltid datakvalitetsfunn

Hvis du finner en feil i en kildefil (kolonneforskyvning, dobbelttelling, feil totalsum e.l.), IKKE
bare rett den stille — fortell Geir eksplisitt hva som var galt, hvor mange rader/poster det gjaldt,
og hva korreksjonen ble. Dette bygger tillit til tallene over tid.

## Steg 10 — Lever norsk regnskapsmessig oppsummering i chat

- Inntekt siste verifiserte måned + YTD inntekt/resultat/margin
- SLA siste 2–3 måneder (trend, ikke bare siste tall)
- Kapasitetsutnyttelse
- Bigin-pipeline («Pipeline Geir»): åpen, avansert, overforfalt, vunnet YTD, winrate
- Eventuelle datakvalitetsfunn fra denne kjøringen
- Lenker til begge Lovable-sidene og bekreftelse på at GitHub er oppdatert

---

## Kjente fakta og historiske referanseverdier (OPPDATER DENNE TABELLEN ETTER HVER KJØRING)

**Tripletex, sentralbordkunder, verifisert t.o.m. august 2026:**
| Måned | Inntekt | Kostnad | Resultat | Margin |
|---|---|---|---|---|
| Jan 2026 | 399 866 | 157 272 | 242 594 | 60,7 % |
| Feb 2026 | 310 265 | 170 877 | 139 388 | 44,9 % |
| Mar 2026 | 350 956 | 174 501 | 176 455 | 50,3 % |
| Apr 2026 | 345 830 | 164 673 | 181 157 | 52,4 % |
| Mai 2026 | 306 615 | 167 922 | 138 693 | 45,2 % |
| Jun 2026 | 334 859 | 159 954 | 174 905 | 52,2 % |
| Jul 2026 | 314 569 | 191 378 | 123 191 | 39,2 % |
| Aug 2026 | 349 416 | 172 326 | 177 091 | 50,7 % |
| **YTD jan–aug** | **2 712 376** | **1 358 903** | **1 353 473** | **49,9 %** |

Skattebetalingskrav 199 155 NOK: FRAFALT av Skatteetaten 10. september 2026. Ikke inkluder i
driftsresultat eller AP-totalen.

**Zisson-tall (All queues, deduplisert, Total-rad):**
| Måned | Anrop | Besvart | Ubesvart | Rå besvart% | SLA 20 sek | SLA 40 sek |
|---|---|---|---|---|---|---|
| Jan 2026 | 8 661 | — | — | — (SLA ikke tilgjengelig, pre-juni-format) | — | — |
| Mar 2026 | 7 776 | — | — | 89,4 % | — | — |
| Apr 2026 | 7 210 | — | — | 87,9 % | — | — |
| Jun 2026 | 7 561 | 6 572 | 991 | 86,9 % | 64,9 % | 85,8 % |
| Jul 2026 | 5 158 | 4 568 | 590 | 88,6 % | 72,2 % | 88,4 % |
| Aug 2026 | 7 627 | 6 586 | 1 041 | 86,4 % | 63,2 % | 86,2 % |

Feb og mai 2026 mangler kompatibel statistikkfil (agentdetaljrapport-format, ikke brukbart for SLA).

**Bigin «Pipeline Geir», sist oppdatert 11. sep 2026 kl. 14:12 (bekreftet uendret siden forrige
måling samme dag kl. ~11:40 — 82 poster totalt, 72 med reelt beløp):**
- Åpen pipeline: 117 450 NOK/mnd · 29 deals
- Avansert stadium: 56 550 NOK/mnd · 13 deals
- Overforfalte åpne deals: 12 500 NOK/mnd · 6 deals
- Vunnet YTD 2026: 58 230 NOK/mnd · 13 deals (14 vunnet all-time)
- Winrate: 32,6 % (14 vunnet / 43 avgjorte)

**Marion lønnsscenario** (uendret siden forrige kjøring — se den eldre «sentralbordet»-skillen for
full utledning dersom det trengs på nytt; oppsummert: Marion slutter 25. nov 2026, erstattes av Hege
Bergskaug i 80 % stilling som Utviklingsleder, 590 000 NOK/år, avtalt/sendt tilbud september 2026).
