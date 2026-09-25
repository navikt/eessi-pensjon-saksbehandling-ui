export default {
  sed: "P12000",
  nav: {
    eessisak: [
      {
        institusjonsid: "NO:NAVAT07",
        institusjonsnavn: "NAV ACCEPTANCE TEST 07",
        saksnummer: "22958426",
        land: "NO"
      }
    ],
    bruker: {
      person: {
        etternavn: "Nordmann",
        fornavn: "Kari",
        foedselsdato: "1954-06-16"
      }
    }
  },
  pensjon: {
    pensjoninfo: {
      betalingsdetaljer: [
        {
          pensjonstype: "01",
          effektueringsdato: "2024-01-01",
          utbetalingshyppighet: "maaned_12_per_aar",
          basertpaa: "01",
          belop: "11111",
          valuta: "EUR"
        }
      ],
      pensjonsavslag: [
        {
          begrunnelse: "Avslag fordi vilkarene ikke er oppfylt",
          pensjonstype: "01"
        }
      ],
      pensjonsopphoring: [
        {
          begrunnelse: "Opphor fordi ytelsen er avsluttet",
          pensjonstype: "01"
        }
      ],
      tilleggsytelserutbetalingitilleggtilpensjon: "Tilleggsytelse"
    },
    gjenlevende: {
      mor: {
        person: {
          etternavnvedfoedsel: "Nordmann",
          fornavn: "Kari"
        }
      }
    },
    ytterligereInformasjon: "Ytterligere informasjon",
    foresporsel: {
      referanseTilPerson: "01"
    },
    anmodning13000verdi: "1"
  }
}
