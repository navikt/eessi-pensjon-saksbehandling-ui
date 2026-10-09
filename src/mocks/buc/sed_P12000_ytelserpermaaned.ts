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
    ytterligereInformasjon: "Ytelser per måned for perioden 01.01.2026 - 31.10.2026:\n- Inntektspensjon: 5 593 NOK\n- Garantipensjon: 73 NOK\n- Grunnpensjon: 1 441 NOK\n- Tilleggspensjon: 2 666 NOK\nSum: 9 773 NOK\n***********************\nYtterligere informasjon fra saksbehandler",
    foresporsel: {
      referanseTilPerson: "01"
    },
    anmodning13000verdi: "1"
  },
  options: {
    ytelserPerMaaned: {
      perioder: [
        {
          fom: "2025-01-01",
          tom: "2026-10-31",
          ytelser: [
            {
              fom: "2026-01-01",
              tom: "2026-10-31",
              mottarMinstePensjonsniva: false,
              vinnendeBeregningsmetode: null,
              belop: 9773,
              ytelseskomponenter: [
                { ytelsesKomponentType: "IP", belopTilUtbetaling: 5593 },
                { ytelsesKomponentType: "GAP", belopTilUtbetaling: 73 },
                { ytelsesKomponentType: "GP", belopTilUtbetaling: 1441 },
                { ytelsesKomponentType: "TP", belopTilUtbetaling: 2666 }
              ]
            },
            {
              fom: "2025-01-01",
              tom: "2025-12-31",
              mottarMinstePensjonsniva: false,
              vinnendeBeregningsmetode: null,
              belop: 9773,
              ytelseskomponenter: [
                { ytelsesKomponentType: "IP", belopTilUtbetaling: 5593 },
                { ytelsesKomponentType: "GAP", belopTilUtbetaling: 73 },
                { ytelsesKomponentType: "GP", belopTilUtbetaling: 1441 },
                { ytelsesKomponentType: "TP", belopTilUtbetaling: 2666 }
              ]
            }
          ],
          selected: [0]
        }
      ]
    }
  }
}
