export default {
  identer: [
    {
      ident: 'personFnr',
      gruppe: 'FOLKEREGISTERIDENT'
    },
    {
      ident: 'personAktoerId',
      gruppe: 'AKTORID'
    }
  ],
  navn: {
    fornavn: 'LEALAUS',
    mellomnavn: null,
    etternavn: 'SAKS',
    sammensattNavn: 'LEALAUS SAKS'
  },
  adressebeskyttelse: [
    'UGRADERT'
  ],
  bostedsadresse: {
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2021-01-01',
    utenlandskAdresse: {
      landkode: 'SE'
    },
    vegadresse: {
      adressenavn: 'Adressenavn',
      husnummer: '00',
      husbokstav: 'A',
      postnummer: '0768'
    }
  },
  oppholdsadresse: {
    gyldigFraOgMed: '2022-01-01',
    gyldigTilOgMed: '2023-01-01',
    utenlandskAdresse: {
      landkode: 'FI'
    },
    vegadresse: {
      adressenavn: 'Adressenavn2',
      husnummer: '01',
      husbokstav: 'B',
      postnummer: '0768'
    }
  },
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
  doedsfall: null,
  familierelasjoner: [
    {
      relatertPersonsIdent: 'personBarnFnr',
      relatertPersonsRolle: 'BARN',
      minRolleForPerson: 'FAR'
    },
    {
      relatertPersonsIdent: 'personFarFnr',
      relatertPersonsRolle: 'FAR',
      minRolleForPerson: 'BARN'
    },
    {
      relatertPersonsIdent: 'personMorFnr',
      relatertPersonsRolle: 'MOR',
      minRolleForPerson: 'BARN'
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
