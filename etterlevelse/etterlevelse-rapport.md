# Etterlevelsesrapport – eessi-pensjon-saksbehandling-ui

> Auto-generert analyse av hvordan komponenten **eessi-pensjon-saksbehandling-ui** bidrar til
> EESSI Pensjon-domenets etterlevelseskrav. Dette er en intern oversikt for
> team eessipensjon, ikke en besvarelse i etterlevelse-portalen.

- **Komponent:** eessi-pensjon-saksbehandling-ui
- **Rolle:** React/TypeScript web-frontend for pensjonssaksbehandlere. Express.js-server (`server.mjs`) håndterer autentisering via Wonderwall/Azure AD, OBO-token-veksling, og proxying til `eessi-pensjon-frontend-api` og `eessi-pensjon-fagmodul`. Ingen egen persistering eller Kafka-lytting.
- **Generert:** 2026-06-12
- **Kilde for krav:** navikt/eessi-pensjon / etterlevelse/agent-input
- **Antall krav vurdert:** 16

## Sammendrag

| Kravid | Tittel | Tema | Samlet status |
|--------|--------|------|---------------|
| K103.2 | Personopplysninger skal kunne rettes | Personvern | Ikke relevant |
| K104.1 | Personopplysninger skal kunne slettes | Personvern | Ikke relevant |
| K105.1 | Det må tilrettelegges for dataportabilitet | Personvern | Ikke relevant |
| K108.2 | Den registrerte skal informeres om behandling av personopplysninger | Personvern | Ikke relevant |
| K109.1 | Fødselsnummer skal bare brukes der det er nødvendig | Personvern | Ja (delvis) |
| K113.2 | Den registrerte har krav på innsyn | Personvern | Ikke relevant |
| K115.1 | Automatisering oppfyller vilkårene | Personvern | Ikke relevant |
| K116.1 | Behandling av personopplysninger må kunne begrenses | Personvern | Ikke relevant |
| K187.1 | Informasjon ved automatiske avgjørelser | Personvern | Ikke relevant |
| K188.1 | Profilering oppfyller vilkårene | Personvern | Ikke relevant |
| K191.1 | Lagringstid skal være avklart | Personvern | Ikke relevant |
| K245.1 | Risikovurdering for applikasjoner | Informasjonssikkerhet | Uavklart |
| K253.1 | Visning av personopplysninger til oppslagslogg (Arcsight) | Informasjonssikkerhet | Uavklart |
| K255.1 | Beskytte brukere med adressebeskyttelse | Informasjonssikkerhet | Ja (delvis) |
| K262.1 | Rett til å protestere mot behandling | Personvern | Ikke relevant |
| K267.1 | Applikasjoner skal ha forsvarlig sikkerhetsnivå | Informasjonssikkerhet | Ja (delvis) |

## Krav i detalj

### K103.2 – Personopplysninger skal kunne rettes

**Tema:** Personvern · **Samlet status:** Ikke relevant

Saksbehandling-ui er et rent presentasjonslag. Den lagrer ikke personopplysninger selv og har ingen funksjonalitet for å rette/oppdatere data — slike operasjoner skjer i backend-tjenestene (fagmodul, PESYS, PDL). UI videresender API-kall.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Vurdert behov for tiltak for korrekthet | Ikke relevant | UI lagrer ingen personopplysninger. Data hentes live fra backend ved hvert oppslag (`server.mjs:212-221`, proxy til backend). |
| 2  | Rutiner og funksjonalitet for retting | Ikke relevant | Retting skjer i kildesystemene (PDL, PESYS). UI sender kun API-kall videre via proxy. |
| 3  | Varslet mottaker om retting | Ikke relevant | UI utleverer ikke personopplysninger til tredjeparter. |

---

### K104.1 – Personopplysninger skal kunne slettes

**Tema:** Personvern · **Samlet status:** Ikke relevant

Komponenten har ingen egen lagring av personopplysninger. Ingen database, ingen cache med persondata på disk.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Rutiner og funksjonalitet for sletting | Ikke relevant | Ingen egen persistering. `Dockerfile:6-10` viser kun statiske filer og `server.mjs` i produksjon-imaget. |
| 2  | Varslet mottaker om sletting | Ikke relevant | Ingen utlevering av personopplysninger fra denne komponenten. |

---

### K105.1 – Det må tilrettelegges for dataportabilitet

**Tema:** Personvern · **Samlet status:** Ikke relevant

UI-et verken samler inn eller lagrer personopplysninger basert på samtykke eller avtale. Det er et internt saksbehandlerverktøy for offentlig myndighetsutøvelse.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Vurdert om dataportabilitet er aktuelt | Ikke relevant | Behandlingsgrunnlaget er offentlig myndighetsutøvelse, ikke samtykke/avtale. Dataportabilitet gjelder ikke. |
| 2  | Funksjonalitet for utlevering | Ikke relevant | Ikke aktuelt jf. SK1. |

---

### K108.2 – Den registrerte skal informeres om behandling av personopplysninger

**Tema:** Personvern · **Samlet status:** Ikke relevant

EESSI Pensjon er et internt saksbehandlerverktøy, ikke en selvbetjeningsløsning rettet mot registrerte. Informasjon til registrerte om behandling av personopplysninger skjer via nav.no/personvern og fagsystemene.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Vurdert hvilken informasjon som må gis | Ikke relevant | UI er kun tilgjengelig for Nav-ansatte (AD-grupper i `nais/prod-gcp.yml:17-18`). Registrerte har ikke tilgang. |
| 2  | Avklart informasjon ved innhenting fra andre kilder | Ikke relevant | UI samler ikke inn opplysninger fra registrerte. |
| 3  | Avklart hvordan informasjon gis | Ikke relevant | Informasjonsplikten ivaretas via nav.no/personvern, ikke via interne saksbehandlerverktøy. |

---

### K109.1 – Fødselsnummer skal bare brukes der det er nødvendig

**Tema:** Personvern · **Samlet status:** Ja (delvis)

Komponenten bruker fødselsnummer for sikker identifisering av bruker i saksbehandlingskontekst. Fnr sendes som path-segment i callback-URL etter Wonderwall-innlogging, noe som betyr at det kan forekomme i access-logger.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Avklart nødvendighet og saklighet | Ja | Fnr brukes for å identifisere bruker i pensjonssak. Det er nødvendig og saklig for saksbehandling. Brukes som path-parameter for å gjenfinne kontekst etter login (`server.mjs:56-63`, `server.mjs:97`). |
| 2  | Tiltak for sikring i usikrede kanaler | Ja (delvis) | Kommunikasjon skjer over HTTPS (intern ingress `pensjon-utland.intern.nav.no`, `nais/prod-gcp.yml:39`). Fnr sendes imidlertid som URL-path-segment (`server.mjs:63,97`) — dette kan havne i access-logger på NAIS-plattformen. |

---

### K113.2 – Den registrerte har krav på innsyn

**Tema:** Personvern · **Samlet status:** Ikke relevant

UI lagrer ingen personopplysninger og er ikke et system hvor innsyn gis til registrerte. Innsyn håndteres av Nav Kontaktsenter og fagsystemene.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Rutine for innsynsforespørsler | Ikke relevant | Ingen personopplysninger lagret i komponenten. Data vises i sanntid fra backend. |
| 2  | Avklart elektronisk innsyn | Ikke relevant | Ikke en selvbetjeningsløsning for registrerte. |

---

### K115.1 – Automatisering oppfyller vilkårene

**Tema:** Personvern · **Samlet status:** Ikke relevant

UI-et fatter ingen avgjørelser, verken helautomatiske eller delautomatiske. Det er et presentasjonslag for manuell saksbehandling.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Vurdert om behandlingen er helautomatisk | Ikke relevant | Ingen automatiserte avgjørelser i UI. |
| 2  | Regelverket egner seg for automatisering | Ikke relevant | Ikke aktuelt. |
| 3  | Likt faktagrunnlag gir likt resultat | Ikke relevant | Ikke aktuelt. |
| 4  | Datakilde god nok | Ikke relevant | Ikke aktuelt. |
| 5  | Vurderinger mot diskriminering | Ikke relevant | Ikke aktuelt. |
| 6  | Manuell overprøving | Ikke relevant | Ikke aktuelt. |
| 7  | Dokumentert helautomatisk behandling | Ikke relevant | Ikke aktuelt. |

---

### K116.1 – Behandling av personopplysninger må kunne begrenses

**Tema:** Personvern · **Samlet status:** Ikke relevant

Ingen personopplysninger lagres i denne komponenten. Begrensning av behandling må skje i kildene (PDL, PESYS, Joark).

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Rutiner og funksjonalitet for begrensning | Ikke relevant | UI lagrer ingen personopplysninger. Begrensning håndteres av kildene. |
| 2  | Varslet mottaker om begrensning | Ikke relevant | UI utleverer ikke data til tredjeparter. |

---

### K187.1 – Informasjon ved automatiske avgjørelser

**Tema:** Personvern · **Samlet status:** Ikke relevant

Ingen helautomatiske avgjørelser fattes i denne komponenten.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Informert om helautomatisk avgjørelse | Ikke relevant | Ikke aktuelt — ingen automatisering. |
| 2  | Informert om underliggende logikk | Ikke relevant | Ikke aktuelt. |
| 3  | Informert om konsekvenser | Ikke relevant | Ikke aktuelt. |

---

### K188.1 – Profilering oppfyller vilkårene

**Tema:** Personvern · **Samlet status:** Ikke relevant

Ingen profilering utføres i UI-komponenten.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Vurdert om behandlingen innebærer profilering | Ikke relevant | Ingen profilering. UI viser data fra backend uten analyse/maskinlæring. |
| 2  | Regelverket åpner for profilering | Ikke relevant | Ikke aktuelt. |
| 3  | Vurderinger mot diskriminering | Ikke relevant | Ikke aktuelt. |
| 4  | Særskilte krav ved profilering | Ikke relevant | Ikke aktuelt. |

---

### K191.1 – Lagringstid skal være avklart

**Tema:** Personvern · **Samlet status:** Ikke relevant

Komponenten har ingen persistent lagring av personopplysninger. Ingen database, GCP Storage, eller filbasert lagring utover statiske frontend-filer.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Avklart lagringsbehov og dokumentert | Ikke relevant | Ingen lagring av personopplysninger. `Dockerfile` bekrefter at image kun inneholder `server.mjs`, `build/` og `node_modules/`. |
| 2  | Avklart hva som skjer etter lagringsbehov opphører | Ikke relevant | Ikke aktuelt. |
| 3  | Tekniske løsninger for rutinemessig sletting | Ikke relevant | Ikke aktuelt — ingenting å slette. |

---

### K245.1 – Risikovurdering for applikasjoner

**Tema:** Informasjonssikkerhet · **Samlet status:** Uavklart

Kravet gjelder alle applikasjoner i Nav. Det kan ikke verifiseres fra koden alene om verdivurdering, trusselmodellering og risikovurdering er gjennomført for denne komponenten.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Verdivurdering gjennomført | Uavklart | Kan ikke verifiseres fra kode. Krever sjekk mot Sharepoint/HSB. |
| 2  | Trusselmodellering gjennomført | Uavklart | Ingen DFD eller trusselmodell funnet i repoet. |
| 3  | Sikkerhetsrisikovurdering (for Høy/Svært Høy) | Uavklart | Avhenger av verdivurdering. UI med tilgang til personopplysninger kan klassifiseres Høy. |
| 4  | Rutiner for oppdatering | Uavklart | Ingen dokumentasjon funnet i repoet. |
| 5  | Vurderinger lagret trygt | Uavklart | Kan ikke verifiseres fra kode. |

---

### K253.1 – Visning av personopplysninger til oppslagslogg (Arcsight)

**Tema:** Informasjonssikkerhet · **Samlet status:** Uavklart

Saksbehandling-ui viser personopplysninger til Nav-ansatte (saksbehandlere). Det er ikke funnet noen auditlogging/sporingslogg-integrasjon i frontend-koden eller server.mjs.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Visning logges til oppslagslogg | Uavklart | Ingen Arcsight-/auditlogg-integrasjon funnet i `server.mjs` eller `src/`. Grep ga null treff. Spørsmålet er om logging skjer i backend (fagmodul/saksbehandling-api) i stedet. |
| 2  | Logger kun når personopplysninger faktisk vises | Uavklart | Avhenger av om ansvaret ligger i backend. |
| 3  | Logger ikke ved listevisning | Uavklart | Avhenger av om ansvaret ligger i backend. |
| 4  | Logger ikke mer enn nødvendig | Uavklart | Avhenger av om ansvaret ligger i backend. |
| 5  | Avklart med Team Auditlogging Arcsight | Uavklart | Ingen dokumentasjon funnet. |
| 6  | Format bekreftet i produksjon | Uavklart | Ingen dokumentasjon funnet. |

---

### K255.1 – Beskytte brukere med adressebeskyttelse

**Tema:** Informasjonssikkerhet · **Samlet status:** Ja (delvis)

Komponenten har typedefinisjoner for `AdressebeskyttelseGradering` (`src/declarations/person.d.ts:60-64`) og feltet `adressebeskyttelse` på `PersonPDL` (`src/declarations/person.d.ts:151`), men det er ikke funnet noen visuell markering eller tilgangskontroll i UI-kode som sjekker denne verdien. Tilgangskontroll for AD-grupper (Fortrolig_Adresse, Strengt_Fortrolig_Adresse) skjer trolig i backend (fagmodul/saksbehandling-api).

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Sjekker riktig rolle for tilgang | Ja (delvis) | NAIS-config krever AD-gruppene `0000-ga-eessi-clerk-pensjon` / `0000-ga-eessi-clerk-ufore` (`nais/prod-gcp.yml:17-18`). Sjekk av spesifikke adressebeskyttelse-grupper (0000-GA-Fortrolig_Adresse osv.) ble ikke funnet i UI-koden — antas håndtert i backend. |
| 2  | Tydelig markering av beskyttelsesbehov | Uavklart | `AdressebeskyttelseGradering`-type er definert (`src/declarations/person.d.ts:60`), men grep finner ingen bruk i UI-komponenter (kun i mock-data). Ingen visuell markering (ikon/farge/banner) funnet. |
| 3  | Beskytter opplysninger på andre brukeres saker | Ikke relevant | EESSI Pensjon viser SED-data per BUC, ikke familiesaker med kryssreferanser mellom brukere i UI. |
| 4  | Beskytter i sammenstilte oversikter | Ikke relevant | UI viser ikke lister/rapporter over flere brukere med geolokaliserende data. |
| 5  | Deler ikke adresse med eksterne | Ikke relevant | UI deler ikke data med eksterne parter. Datadeling skjer i backend. |
| 6  | Varsom ved deling av geolokaliserende opplysninger | Ikke relevant | UI deler ikke data eksternt. |
| 7  | Beskytter i selvbetjeningsløsninger | Ikke relevant | Ikke en selvbetjeningsløsning — kun for Nav-ansatte. |
| 8  | Begrenser manuell håndtering | Ikke relevant | Automatisering av SED-behandling skjer i backend-tjenestene. |

---

### K262.1 – Rett til å protestere mot behandling

**Tema:** Personvern · **Samlet status:** Ikke relevant

UI-et har ingen funksjonalitet knyttet til den registrertes rettigheter. Protest mot behandling håndteres utenfor dette systemet.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Vurdert om rettigheten er aktuell | Ikke relevant | UI er et internt verktøy, ikke en kanal for registrertes rettighetsutøvelse. |
| 2  | Rutiner for å stanse behandling | Ikke relevant | Ingen behandling av personopplysninger i UI ut over visning. |
| 3  | Informert den registrerte | Ikke relevant | Informasjon om rettigheter skjer via nav.no/personvern. |

---

### K267.1 – Applikasjoner skal ha forsvarlig sikkerhetsnivå

**Tema:** Informasjonssikkerhet · **Samlet status:** Ja (delvis)

Komponenten har god autentisering og tilgangskontroll, men har noen identifiserte forbedringspunkter: bruk av `dangerouslySetInnerHTML`, fnr i URL-path, og manglende CSP-headers.

| SK | Suksesskriterium | Status | Begrunnelse (med kodereferanse) |
|----|------------------|--------|---------------------------------|
| 1  | Følger med på og håndterer sårbarheter | Ja (delvis) | Ingen `dependabot.yml` funnet i repoet. GitHub Actions finnes (`.github/workflows/`). Det er uklart om automatisk sårbarhetsskanning er aktivert. `package.json` viser oppdaterte avhengigheter (Express 5.2.1, React 19.2.6). |
| 2  | Avhengigheter oppdatert | Ja | `package.json` viser nylige versjoner: Express 5.2.1, React 19.2.6, @navikt/ds-react 8.11.1, @navikt/oasis 4.1.4. Node 22 i Dockerfile. Deployeres regelmessig via CI-workflows. |
| 3  | Validerer input og output | Nei (delvis) | `dangerouslySetInnerHTML` brukes i `src/pages/Error/Error.tsx:53,65`. Inputen kommer fra i18n-oversettelser (linje 53: `description` fra `t()`) og fra `error.stack` (linje 65). i18n-input er lav risiko, men `error.stack` kan potensielt inneholde brukerinndata. Ingen CSP-headers er konfigurert i `server.mjs`. |
| 4  | Beskytter og roterer hemmeligheter | Ja | Hemmeligheter håndteres via NAIS miljøvariabler (Azure client-secret injiseres av plattformen, `server.mjs:16-20`). Ingen hardkodede hemmeligheter i kode. Token-rotasjon håndteres av Azure AD / NAIS. |
| 5  | Logger feil og sikkerhetshendelser | Ja (delvis) | Winston logger feil (`server.mjs:36-43`). `logger.error(body.error_description)` ved OBO-feil (`server.mjs:148`). Access tokens logges IKKE — kun `error_description`. Men fnr forekommer i URL-path (`server.mjs:63,97`) og kan logges automatisk av NAIS ingress access-logger. |
| 6  | Backup av data og kode | Ja | Kode i GitHub. Ingen egen datalagring som krever backup. NAIS-plattform håndterer infrastruktur-backup. |
| 7  | Tilgangskontroll på alle endepunkter | Ja | Alle endepunkter unntatt health-checks krever autentisering. `mainPageAuth` (`server.mjs:54-86`) validerer token via `@navikt/oasis`. `apiAuth` (`server.mjs:129-157`) krever OBO-token. NAIS Azure sidecar konfigurert med AD-gruppekrav (`nais/prod-gcp.yml:17-18`). `app.disable("x-powered-by")` (`server.mjs:14`). |

## Avgrensninger

- Generisk EESSI-/RINA-infrastruktur (meldingsruting, SED-mottak) ivaretas av EUX-plattformen (team eessibasis).
- Vedtaksbehandling, brevproduksjon og lagringstider ligger i fagsystemene (PESYS m.fl.).
- Auditlogging til Arcsight kan ligge i backend-tjenestene (fagmodul, saksbehandling-api) — ikke i UI.
- Tilgangskontroll for adressebeskyttelse (sjekk av Fortrolig_Adresse-grupper) antas å skje i backend-API-ene.
- Plattformsikkerhet (NAIS, Kubernetes-nettverkspolicyer, TLS-terminering, tilgangsstyring) håndteres av NAIS-teamet.

## Punkter som må følges opp

- [ ] **K245.1 (SK1-5):** Verdivurdering, trusselmodellering og risikovurdering — er dette gjennomført for EESSI Pensjon samlet? Sjekk med teamlead og HSB.
- [ ] **K253.1 (SK1-6):** Auditlogging til Arcsight — gjøres sporingslogging i fagmodul eller saksbehandling-api ved visning av personopplysninger? Er dette avklart med Team Auditlogging Arcsight?
- [ ] **K255.1 (SK1):** Sjekkes adressebeskyttelse-gruppene (0000-GA-Fortrolig_Adresse, 0000-GA-Strengt_Fortrolig_Adresse) i fagmodul/saksbehandling-api ved oppslag? Verifiser med backend-teamet.
- [ ] **K255.1 (SK2):** Vises adressebeskyttelse-gradering visuelt for saksbehandler i UI? `AdressebeskyttelseGradering`-typen er definert men brukes tilsynelatende ikke i komponenter.
- [ ] **K267.1 (SK1):** Er automatisk sårbarhetsskanning (Dependabot, Snyk, eller lignende) aktivert for dette repoet?
- [ ] **K267.1 (SK3):** `dangerouslySetInnerHTML` i `Error.tsx` — vurder om dette utgjør XSS-risiko. `error.stack` kan potensielt inneholde usanitert input.
- [ ] **K267.1 (SK5):** Fnr i URL-path (`server.mjs:63,97`) — disse vil logges av NAIS ingress access-logger. Vurder om dette bryter med kravet om at fnr ikke skal forekomme i URL.
- [ ] **K267.1 (SK3):** Ingen Content-Security-Policy (CSP) headers konfigurert i `server.mjs`. Vurder å legge til CSP for å mitigere XSS.
