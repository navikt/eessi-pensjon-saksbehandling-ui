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
    ytterligereInformasjon: "Ytelser per måned for perioden 01.09.2024 - 31.03.2025:\n- Inntektspensjon: 5 210 NOK\n- Garantipensjon: 68 NOK\n- Grunnpensjon: 1 395 NOK\n- Tilleggspensjon: 2 580 NOK\n- Minstenivåtillegg individuelt: 620 NOK\nSum: 9 873 NOK\n\nYtelser per måned fra og med 01.02.2026:\n- Inntektspensjon: 5 593 NOK\n- Garantipensjon: 73 NOK\n- Grunnpensjon: 1 441 NOK\n- Tilleggspensjon: 2 666 NOK\nSum: 9 773 NOK\n\nYtelser per måned for perioden 01.09.2026 - 31.12.2026:\n- Inntektspensjon: 5 784 NOK\n- Garantipensjon: 76 NOK\n- Grunnpensjon: 1 490 NOK\n- Tilleggspensjon: 2 757 NOK\n- Gjenlevendetillegg: 950 NOK\nSum: 11 057 NOK\n***********************\nYtterligere informasjon",
    foresporsel: {
      referanseTilPerson: "01"
    },
    anmodning13000verdi: "1"
  },
  options: {
    ytelserPerMaaned: {
      fom: "2025-01-01",
      tom: "2026-10-31",
      ytelser: [
        {
          fom: "2024-09-01",
          tom: "2025-03-31",
          mottarMinstePensjonsniva: true,
          vinnendeBeregningsmetode: null,
          belop: 9873,
          ytelseskomponenter: [
            { ytelsesKomponentType: "IP", belopTilUtbetaling: 5210 },
            { ytelsesKomponentType: "GAP", belopTilUtbetaling: 68 },
            { ytelsesKomponentType: "GP", belopTilUtbetaling: 1395 },
            { ytelsesKomponentType: "TP", belopTilUtbetaling: 2580 },
            { ytelsesKomponentType: "MIN_NIVA_TILL_INDV", belopTilUtbetaling: 620 }
          ]
        },
        {
          fom: "2025-08-01",
          tom: null,
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
          fom: "2026-02-01",
          tom: null,
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
          fom: "2026-05-01",
          tom: null,
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
          fom: "2026-09-01",
          tom: "2026-12-31",
          mottarMinstePensjonsniva: false,
          vinnendeBeregningsmetode: null,
          belop: 11057,
          ytelseskomponenter: [
            { ytelsesKomponentType: "IP", belopTilUtbetaling: 5784 },
            { ytelsesKomponentType: "GAP", belopTilUtbetaling: 76 },
            { ytelsesKomponentType: "GP", belopTilUtbetaling: 1490 },
            { ytelsesKomponentType: "TP", belopTilUtbetaling: 2757 },
            { ytelsesKomponentType: "AP_GJT", belopTilUtbetaling: 950 }
          ]
        }
      ],
      selected: [0, 2, 4]
    }
  }
}
