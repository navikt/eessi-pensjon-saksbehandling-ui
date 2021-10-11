export default {
  sed: 'P5000',
  sedGVer: '4',
  sedVer: '2',
  nav: {
    eessisak: [{
      institusjonsid: 'NO:889640782',
      institusjonsnavn: 'The Norwegian Labour and Welfare Administration',
      saksnummer: '25183754',
      land: 'FI'
    }],
    bruker: {
      mor: null,
      far: null,
      person: {
        pin: [{
          institusjonsnavn: null,
          institusjonsid: null,
          sektor: null,
          identifikator: '12345678901',
          land: 'FI',
          institusjon: null
        }],
        pinland: null,
        statsborgerskap: [{
          land: 'FI'
        }],
        etternavn: 'MCFINNISH',
        fornavn: 'FINNISH',
        kjoenn: 'M',
        foedested: null,
        foedselsdato: '1948-01-01',
        sivilstand: null,
        relasjontilavdod: null,
        rolle: null
      },
      adresse: null,
      arbeidsforhold: null,
      bank: null
    },
    brukere: null,
    ektefelle: null,
    barn: null,
    verge: null,
    krav: null,
    sak: null,
    annenperson: null
  },
  pensjon: {
    trygdetid: [{
      relevans: null,
      ordning: null,
      land: 'FI',
      sum: {
        kvartal: null,
        aar: '20',
        uker: '00',
        dager: {
          nr: null,
          type: '7'
        },
        maaneder: '00'
      },
      yrke: null,
      gyldigperiode: null,
      type: '20',
      beregning: '20',
      informasjonskalkulering: null,
      periode: null,
      enkeltkrav: null
    }],
    medlemskapAnnen: [{
      relevans: '010',
      ordning: '01',
      land: 'FI',
      sum: {
        kvartal: null,
        aar: '11',
        uker: null,
        dager: {
          nr: null,
          type: '7'
        },
        maaneder: '00'
      },
      yrke: '0000',
      gyldigperiode: null,
      type: '20',
      beregning: '20',
      informasjonskalkulering: null,
      periode: null,
      enkeltkrav: null
    }],
    medlemskapTotal: [{
      relevans: '010',
      ordning: null,
      land: 'FI',
      sum: {
        kvartal: null,
        aar: '02',
        uker: '00',
        dager: {
          nr: null,
          type: '7'
        },
        maaneder: '08'
      },
      yrke: null,
      gyldigperiode: null,
      type: '20',
      beregning: '20',
      informasjonskalkulering: null,
      periode: null,
      enkeltkrav: null
    }],
    medlemskap: null,
    medlemskapboarbeid: {
      enkeltkrav: {
        datoFrist: null,
        krav: '20'
      },
      gyldigperiode: '1',
      medlemskap: [{
        relevans: '20',
        ordning: '20',
        land: 'FI',
        sum: {
          kvartal: null,
          aar: '02',
          uker: '02',
          dager: {
            nr: '2',
            type: '7'
          },
          maaneder: '02'
        },
        yrke: '20',
        gyldigperiode: null,
        type: '20',
        beregning: '20',
        informasjonskalkulering: null,
        periode: {
          fom: '1986-01-01',
          tom: '1986-07-06'
        },
        enkeltkrav: null
      }, {
        relevans: '20',
        ordning: '20',
        land: 'FI',
        sum: {
          kvartal: null,
          aar: '02',
          uker: '00',
          dager: {
            nr: '2',
            type: '7'
          },
          maaneder: '02'
        },
        yrke: '20',
        gyldigperiode: null,
        type: '20',
        beregning: '20',
        informasjonskalkulering: null,
        periode: {
          fom: '1987-01-01',
          tom: '1987-12-31'
        },
        enkeltkrav: null
      }]
    }
  }
}
