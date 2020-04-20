export default {
  trygdetid: {
    andrePerioder: [{
      land: 'AF',
      annenInformasjon: 'other period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1970',
          tom: '01.01.1971'
        }
      },
      usikkerDatoIndikator: '1',
      typePeriode: 'other period 1 otherType'
    }, {
      land: 'BB',
      annenInformasjon: 'other period 2 comment',
      periode: {
        openPeriode: {
          fom: '01.01.1972',
          extra: '01'
        }
      },
      usikkerDatoIndikator: '1',
      typePeriode: 'other period 2 otherType'
    }],
    arbeidsledigPerioder: [{
      land: 'CA',
      annenInformasjon: 'daily period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1973',
          tom: '01.01.1974'
        }
      },
      usikkerDatoIndikator: '1',
      navnPaaInstitusjon: 'daily period 1 payingInstitution'
    }, {
      land: 'DO',
      annenInformasjon: 'daily period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1975',
          tom: '01.01.1976'
        }
      },
      usikkerDatoIndikator: '1',
      navnPaaInstitusjon: 'daily period 2 payingInstitution'
    }],
    boPerioder: [{
      land: 'EC',
      annenInformasjon: 'home period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1977',
          tom: '01.01.1978'
        }
      },
      usikkerDatoIndikator: '1'
    }, {
      land: 'FR',
      annenInformasjon: 'home period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1979',
          tom: '01.01.1980'
        }
      },
      usikkerDatoIndikator: '1'
    }],
    opplaeringPerioder: [{
      land: 'GR',
      annenInformasjon: 'learn period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1981',
          tom: '01.01.1982'
        }
      },
      usikkerDatoIndikator: '1',
      navnPaaInstitusjon: 'learn period 1 learnInstitution'
    }, {
      land: 'HU',
      annenInformasjon: 'learn period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1983',
          tom: '01.01.1984'
        }
      },
      usikkerDatoIndikator: '1',
      navnPaaInstitusjon: 'learn period 2 learnInstitution'
    }],
    sykePerioder: [{
      land: 'IT',
      annenInformasjon: 'sick period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1985',
          tom: '01.01.1986'
        }
      },
      usikkerDatoIndikator: '1',
      navnPaaInstitusjon: 'sick period 1 payingInstitution'
    }, {
      land: 'JP',
      annenInformasjon: 'sick period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1987',
          tom: '01.01.1988'
        }
      },
      usikkerDatoIndikator: '1',
      navnPaaInstitusjon: 'sick period 2 payingInstitution'
    }],
    barnepassPerioder: [{
      annenInformasjon: 'child period 1 comment',
      informasjonBarn: {
        fornavn: 'Ole',
        land: 'KE',
        etternavn: 'Olsen',
        foedseldato: '01.01.2002'
      },
      periode: {
        lukketPeriode: {
          fom: '01.01.1989',
          tom: '01.01.1990'
        }
      },
      usikkerDatoIndikator: '1'
    }, {
      annenInformasjon: 'child period 2 comment',
      informasjonBarn: {
        fornavn: 'Teddy',
        land: 'LU',
        etternavn: 'Olsen',
        foedseldato: '01.01.2003'
      },
      periode: {
        lukketPeriode: {
          fom: '01.01.1991',
          tom: '01.01.1992'
        }
      },
      usikkerDatoIndikator: '1'
    }],
    ansattSelvstendigPerioder: [{
      jobbUnderAnsattEllerSelvstendig: 'work period 1 workActivity',
      annenInformasjon: 'work period 1 comment',
      adresseFirma: {
        postnummer: '0123',
        by: 'work period 1 workCity',
        land: 'MX',
        gate: 'work period 1 workStreet',
        region: 'work period 1 workRegion'
      },
      periode: {
        lukketPeriode: {
          fom: '01.01.1993',
          tom: '01.01.1994'
        }
      },
      forsikkringEllerRegistreringNr: 'work period 1 insuranceId',
      navnFirma: 'work period 1 workName',
      typePeriode: '01',
      usikkerDatoIndikator: '1'
    }, {
      jobbUnderAnsattEllerSelvstendig: 'work period 2 workActivity',
      annenInformasjon: 'work period 2 comment',
      adresseFirma: {
        postnummer: '0124',
        by: 'work period 2 workCity',
        land: 'NL',
        gate: 'work period 2 workStreet',
        region: 'work period 2 workRegion'
      },
      periode: {
        lukketPeriode: {
          fom: '01.01.1995',
          tom: '01.01.1996'
        }
      },
      forsikkringEllerRegistreringNr: 'work period 2 insuranceId',
      navnFirma: 'work period 2 workName',
      typePeriode: '02',
      usikkerDatoIndikator: '1'
    }],
    forsvartjenestePerioder: [{
      land: 'OM',
      annenInformasjon: 'military period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1997',
          tom: '01.01.1998'
        }
      },
      usikkerDatoIndikator: '1'
    }, {
      land: 'PT',
      annenInformasjon: 'military period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.1999',
          tom: '01.01.2000'
        }
      },
      usikkerDatoIndikator: '1'
    }],
    foedselspermisjonPerioder: [{
      land: 'QA',
      annenInformasjon: 'birth period 1 comment',
      periode: {
        openPeriode: {
          fom: '01.01.2001',
          extra: '98'
        }
      },
      usikkerDatoIndikator: '0'
    }, {
      land: 'RU',
      annenInformasjon: 'birth period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.2002',
          tom: '01.01.2003'
        }
      },
      usikkerDatoIndikator: '1'
    }],
    frivilligPerioder: [{
      land: 'SM',
      annenInformasjon: 'voluntary period 1 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.2004',
          tom: '01.01.2005'
        }
      },
      usikkerDatoIndikator: '1'
    }, {
      land: 'TR',
      annenInformasjon: 'voluntary period 2 comment',
      periode: {
        lukketPeriode: {
          fom: '01.01.2006',
          tom: '01.01.2007'
        }
      },
      usikkerDatoIndikator: '1'
    }]
  }
}
