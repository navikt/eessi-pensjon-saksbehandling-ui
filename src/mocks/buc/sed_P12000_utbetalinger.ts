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
    ytterligereInformasjon: "Utbetalinger for perioden 01.01.2023 - 31.12.2023:\n1) Grunnpensjon: 10 000 NOK (månedlig)\n2) Tilleggspensjon: 5 000 NOK (kvartalsvis)\n3) Inntektspensjon: 12 000 NOK (årlig)\n***********************\nYtterligere informasjon fra saksbehandler",
    foresporsel: {
      referanseTilPerson: "01"
    },
    anmodning13000verdi: "1"
  },
  options: {
    utbetalinger: {
      perioder: [
        {
          fom: "2023-01-01",
          tom: "2023-12-31",
          items: [
            { type: "grunnpensjon", belop: 10000, valuta: "NOK", utbetalingshyppighet: "maanedlig" },
            { type: "tilleggspensjon", belop: 5000, valuta: "NOK", utbetalingshyppighet: "kvartalsvis" },
            { type: "pensjonstillegg", belop: 8000, valuta: "NOK", utbetalingshyppighet: "halvaarlig" },
            { type: "inntektspensjon", belop: 12000, valuta: "NOK", utbetalingshyppighet: "aarlig" },
            { type: "minstenivaatilleggindivid", belop: 7000, valuta: "NOK", utbetalingshyppighet: "maanedlig" }
          ],
          selected: [0, 1, 3]
        }
      ]
    }
  }
}
