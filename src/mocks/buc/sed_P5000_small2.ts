export default {
  sed: 'P5000',
  sedGVer: '4',
  sedVer: '2',
  nav: {
    eessisak: [{
      institusjonsid: 'NO:889640782',
      institusjonsnavn: 'The Norwegian Labour and Welfare Administration',
      saksnummer: '25183754',
      land: 'NO'
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
          land: 'DE',
          institusjon: null
        }],
        pinland: null,
        statsborgerskap: [{
          land: 'DE'
        }],
        etternavn: 'MCDEUTSCH',
        fornavn: 'DEUTSCH',
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
      land: 'DE',
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
      beregning: '001',
      informasjonskalkulering: null,
      periode: null,
      enkeltkrav: null
    }],
    medlemskapAnnen: [{
      relevans: '010',
      ordning: '01',
      land: 'DE',
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
      yrke: '000',
      gyldigperiode: null,
      type: '20',
      beregning: '001',
      informasjonskalkulering: null,
      periode: null,
      enkeltkrav: null
    }],
    medlemskapTotal: [{
      relevans: '010',
      ordning: null,
      land: 'DE',
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
      beregning: '001',
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
        land: 'DE',
        sum: {
          kvartal: null,
          aar: '00',
          dager: {
            nr: '6',
            type: '7'
          },
          maaneder: '07'
        },
        yrke: '20',
        gyldigperiode: null,
        type: '20',
        beregning: '001',
        informasjonskalkulering: null,
        periode: {
          fom: '1986-01-04',
          tom: '1986-07-06'
        },
        enkeltkrav: null
      }, {
        relevans: '20',
        ordning: '20',
        land: 'DE',
        sum: {
          kvartal: null,
          aar: '00',
          uker: '00',
          dager: {
            nr: '20',
            type: '7'
          },
          maaneder: '01'
        },
        yrke: '20',
        gyldigperiode: null,
        type: '20',
        beregning: '001',
        informasjonskalkulering: null,
        periode: {
          fom: '1986-08-02',
          tom: '1986-09-20'
        },
        enkeltkrav: null
      }, {
        relevans: '20',
        ordning: '20',
        land: 'DE',
        sum: {
          kvartal: null,
          aar: '00',
          uker: '00',
          dager: {
            nr: '20',
            type: '7'
          },
          maaneder: '01'
        },
        yrke: '20',
        gyldigperiode: null,
        type: '20',
        beregning: '001',
        informasjonskalkulering: null,
        periode: {
          fom: '1986-09-21',
          tom: '1986-12-20'
        },
        enkeltkrav: null
/*      }, {
        relevans: '20',
        ordning: '20',
        land: 'SE',
        sum: {
          kvartal: null,
          aar: '00',
          uker: '00',
          dager: {
            nr: '20',
            type: '7'
          },
          maaneder: '01'
        },
        yrke: '20',
        gyldigperiode: null,
        type: '20',
        beregning: '001',
        informasjonskalkulering: null,
        periode: null,
        enkeltkrav: null*/
      }]
    }
  }
}
