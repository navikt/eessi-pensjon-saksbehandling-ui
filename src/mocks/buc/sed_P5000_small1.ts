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
          institusjonsnavn: 'The Norwegian Labour and Welfare Administration',
          institusjonsid: 'NO:889640782',
          sektor: null,
          identifikator: '12345678901',
          land: 'NO',
          institusjon: null
        }, {
          institusjonsnavn: null,
          institusjonsid: null,
          sektor: null,
          identifikator: '1000000000001',
          land: 'DE',
          institusjon: null
        }],
        pinland: null,
        statsborgerskap: [{
          land: 'DE'
        }],
        etternavn: 'VON RICHTOFEN',
        fornavn: 'MANFRED',
        kjoenn: 'M',
        foedested: {
          by: 'Unknown',
          land: 'DE',
          region: null
        },
        foedselsdato: '1948-01-01',
        sivilstand: null,
        relasjontilavdod: null,
        rolle: null
      },
      adresse: {
        gate: 'GATE 34',
        bygning: '2000 BRUSSELS',
        by: 'BELGIA',
        postnummer: null,
        region: null,
        land: 'BE',
        kontaktpersonadresse: null,
        datoforadresseendring: null,
        postadresse: null,
        startdato: null
      },
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
      land: null,
      sum: {
        kvartal: null,
        aar: '2.2222',
        uker: null,
        dager: {
          nr: '00',
          type: '7'
        },
        maaneder: '00'
      },
      yrke: null,
      gyldigperiode: null,
      type: '10',
      beregning: '10',
      informasjonskalkulering: null,
      periode: null,
      enkeltkrav: null
    }],
    medlemskapAnnen: null,
    medlemskapTotal: [{
      relevans: '010',
      ordning: null,
      land: null,
      sum: {
        kvartal: null,
        aar: '2.2222',
        uker: null,
        dager: {
          nr: '00',
          type: '7'
        },
        maaneder: '00'
      },
      yrke: null,
      gyldigperiode: null,
      type: '10',
      beregning: '10',
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
      medlemskap: [{
        relevans: null,
        ordning: null,
        land: null,
        sum: {
          kvartal: null,
          aar: '01.111111',
          uker: null,
          dager: {
            nr: '00',
            type: '7'
          },
          maaneder: '00'
        },
        yrke: null,
        gyldigperiode: null,
        type: '10',
        beregning: '10',
        informasjonskalkulering: null,
        periode: {
          fom: '1906-01-01',
          tom: '1906-07-06'
        },
        enkeltkrav: null
      }, {
        relevans: null,
        ordning: null,
        land: null,
        sum: {
          kvartal: null,
          aar: '01.111111',
          uker: null,
          dager: {
            nr: '00',
            type: '7'
          },
          maaneder: '00'
        },
        yrke: null,
        gyldigperiode: null,
        type: '10',
        beregning: '10',
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
