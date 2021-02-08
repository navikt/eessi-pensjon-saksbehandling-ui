const avdod1 = {
  identer: [
    {
      ident: 'personFarFnr',
      gruppe: 'FOLKEREGISTERIDENT'
    },
    {
      ident: 'personFarAktoerId',
      gruppe: 'AKTORID'
    }
  ],
  navn: {
    fornavn: 'AVDØD1',
    mellomnavn: null,
    etternavn: 'SAKS',
    sammensattNavn: 'AVDØD1 SAKS'
  },
  adressebeskyttelse: [
    'UGRADERT'
  ],
  bostedsadresse: null,
  oppholdsadresse: null,
  statsborgerskap: [
    {
      land: 'NOR',
      gyldigFraOgMed: '1980-02-09',
      gyldigTilOgMed: null
    }
  ],
  foedsel: {
    foedselsdato: '1980-02-09',
    foedeland: null,
    foedested: null,
    folkeregistermetadata: {
      gyldighetstidspunkt: '2020-10-12T11:40:56'
    }
  },
  geografiskTilknytning: null,
  kjoenn: {
    kjoenn: 'MANN',
    folkeregistermetadata: {
      gyldighetstidspunkt: '2020-10-12T11:40:56'
    }
  },
  doedsfall: {
    doedsdato: '2020-01-01',
    folkeregistermetadata: {
      gyldighetstidspunkt: '2020-10-12T11:40:56'
    }
  },
  familierelasjoner: [
    {
      relatertPersonsIdent: 'personFnr',
      relatertPersonsRolle: 'BARN',
      minRolleForPerson: 'FAR'
    }
  ],
  sivilstand: [
    {
      type: 'GIFT',
      gyldigFraOgMed: '2007-10-10',
      relatertVedSivilstand: '20047520887'
    }
  ]
}

const avdod2 = {
  identer: [
    {
      ident: 'personMorFnr',
      gruppe: 'FOLKEREGISTERIDENT'
    },
    {
      ident: 'pesonMorAktoerId',
      gruppe: 'AKTORID'
    }
  ],
  navn: {
    fornavn: 'AVDØD2',
    mellomnavn: null,
    etternavn: 'SAKS',
    sammensattNavn: 'AVDØD2 SAKS'
  },
  adressebeskyttelse: [
    'UGRADERT'
  ],
  bostedsadresse: null,
  oppholdsadresse: null,
  statsborgerskap: [
    {
      land: 'NOR',
      gyldigFraOgMed: '1980-02-09',
      gyldigTilOgMed: null
    }
  ],
  foedsel: {
    foedselsdato: '1980-02-09',
    foedeland: null,
    foedested: null,
    folkeregistermetadata: {
      gyldighetstidspunkt: '2020-10-12T11:40:56'
    }
  },
  geografiskTilknytning: null,
  kjoenn: {
    kjoenn: 'MANN',
    folkeregistermetadata: {
      gyldighetstidspunkt: '2020-10-12T11:40:56'
    }
  },
  doedsfall: {
    doedsdato: '2020-01-01',
    folkeregistermetadata: {
      gyldighetstidspunkt: '2020-10-12T11:40:56'
    }
  },
  familierelasjoner: [
    {
      relatertPersonsIdent: 'personFnr',
      relatertPersonsRolle: 'BARN',
      minRolleForPerson: 'MOR'
    }
  ],
  sivilstand: [
    {
      type: 'GIFT',
      gyldigFraOgMed: '2007-10-10',
      relatertVedSivilstand: '20047520887'
    }
  ]
}

export default (nrAvdod: number | undefined) => {
  let whichOne = 0
  if (nrAvdod !== undefined) {
    whichOne = nrAvdod
    if (whichOne > 2) {
      whichOne = 2
    }
  } else {
    whichOne = Math.floor(Math.random() * 3)
  }
  if (whichOne === 0) {
    return []
  }
  if (whichOne === 1) {
    return [avdod1]
  }
  if (whichOne === 2) {
    return [avdod1, avdod2]
  }
  return undefined
}
