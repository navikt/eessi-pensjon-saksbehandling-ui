import { Familierelasjonsrolle, IdentGruppe, KjoennType, Sivilstandstype } from 'src/declarations/person'

export default {
  result: {
    identer: [
      {
        ident: 'personFnr',
        gruppe: 'FOLKEREGISTERIDENT' as IdentGruppe
      },
      {
        ident: 'personAktoerId',
        gruppe: 'AKTORID' as IdentGruppe
      }
    ],
    navn: {
      fornavn: 'LEALAUS',
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
        gyldigTilOgMed: undefined
      }
    ],
    foedselsdato:
    {
      foedselsdato: '1980-02-09',
    },
    foedested: {
      foedeland: undefined,
      foedested: undefined,
      folkeregistermetadata: {
        gyldighetstidspunkt: '2020-10-12T11:40:56'
      }
    },
    /*  foedsel: {
        foedselsdato: '1980-02-09',
        foedeland: undefined,
        foedested: undefined,
        folkeregistermetadata: {
          gyldighetstidspunkt: '2020-10-12T11:40:56'
        }
      },*/
    geografiskTilknytning: undefined,
    kjoenn: {
      kjoenn: 'MANN' as KjoennType,
      folkeregistermetadata: {
        gyldighetstidspunkt: '2020-10-12T11:40:56'
      }
    },
    doedsfall: {
      doedsdato: '2023-02-09',
    },
    familierelasjoner: [
      {
        relatertPersonsIdent: 'personBarnFnr',
        relatertPersonsRolle: 'BARN' as Familierelasjonsrolle,
        minRolleForPerson: 'FAR' as Familierelasjonsrolle
      },
      {
        relatertPersonsIdent: 'personFarFnr',
        relatertPersonsRolle: 'FAR' as Familierelasjonsrolle,
        minRolleForPerson: 'BARN' as Familierelasjonsrolle
      },
      {
        relatertPersonsIdent: 'personMorFnr',
        relatertPersonsRolle: 'MOR' as Familierelasjonsrolle,
        minRolleForPerson: 'BARN' as Familierelasjonsrolle
      }
    ],
    sivilstand: [
      {
        type: 'GIFT' as Sivilstandstype,
        gyldigFraOgMed: '2007-10-10',
        relatertVedSivilstand: '20047520887'
      }
    ]
  }
}
