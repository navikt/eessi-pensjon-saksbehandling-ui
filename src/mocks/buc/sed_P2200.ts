import { P2200SED } from "src/declarations/p2200";

const mockP2200: P2200SED = {
  sed: "P2200",
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
        fornavn: "Test",
        etternavn: "Bruker"
      },
      uforhet: {
        arbeidsUlykke: "0"
      }
    }
  },
  pensjon: {
    bruker: {
      arbeidsforhold: [
        {
          yrke: "Kokk",
          type: "forsikrede_driver_fortsatt_selvstendig_naerigsvirksomhet",
          inntekt: [
            {
              betalingshyppighetinntekt: "06",
              beloeputbetaltsiden: "2022-01-02",
              valuta: "NOK",
              beloep: "1000"
            }
          ]
        }
      ]
    },
    ytelser: [
      {
        ytelse: "08",
        status: "02",
        beloep: [
          {
            beloep: "55",
            valuta: "EUR",
            betalingshyppighetytelse: "02"
          }
        ]
      }
    ],
    vedtak: [
      {
        mottaker: ["forsikret_person"],
        trekkgrunnlag: ["987_2009_Art_72_1"]
      }
    ],
    vedlegg: ["utførlig_medisinsk_rapport"],
    etterspurtedokumenter: "P5000",
    ytterligeinformasjon: "Ytterligere informasjon"
  }
}

export default mockP2200
