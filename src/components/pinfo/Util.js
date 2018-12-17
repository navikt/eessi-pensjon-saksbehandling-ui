import _ from 'lodash'
import moment from 'moment'

class Util {
  writeDate (date) {
    return moment(date).format('DD.MM.YYYY')
  }

  handleDate (period) {
    return {
      fom: period.startDate ? this.writeDate(period.startDate) : null,
      tom: period.endDate ? this.writeDate(period.endDate) : null
    }
  }

  handleCountry (country) {
    return country.value
  }

  handleGenericPeriod (period) {
    return {
      land: this.handleCountry(period.country),
      periode: this.handleDate(period),
      vedlegg: period.attachments,
      adresse: period.address,
      by: period.city,
      region: period.region,
      trygdeordningnavn: period.insuranceName,
      medlemskap: period.insuranceType,
      forsikringId: period.insuranceId,
      firmaBy: period.workCity,
      firmaAddress: period.workAddress,
      firmaRegion: period.workRegion,
      firmaLand: this.handleCountry(period.country),
      navnFirma: period.workName,
      jobbUnderAnsattEllerSelvstendig: period.workActivity,
      forsikringEllerRegistreringNr: period.workId,
      navnPaaInstitusjon: period.learnInstitution,
      farsNavn: period.fatherName,
      morsNavn: period.motherName
    }
  }

  handleWorkPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  handleChildPeriod (period) {
    let newPeriod = this.handleGenericPeriod(period)
    newPeriod.barnEtternavn = period.childLastName
    newPeriod.barnFoedseldato = this.writeDate(period.childBirthDate)
    newPeriod.barnFornavn = period.childFirstName
    return newPeriod
  }

  handleLearnPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  generatePayload (pinfo) {
    let result = {}
    result.periodeInfo = this.generatePeriods(pinfo.stayAbroad)
    result.personInfo = this.generatePerson(pinfo.person)
    result.bankinfo = this.generateBank(pinfo.bank)
    return result
  }

  generatePerson (person) {
    return {
      'etternavnVedFodsel': person.nameAtBirth,
      'tidligereNavn': person.previousName,
      'fodestedBy': person.city,
      'fodestedLand': person.country ? this.handleCountry(person.country) : null,
      'provinsEllerDepartement': person.region,
      'telefonnummer': person.phone,
      'epost': person.email
    }
  }

  generateBank (bank) {
    return {
      'navn': bank.bankName,
      'land': this.handleCountry(bank.bankCountry),
      'adresse': bank.bankAddress,
      'bicEllerSwift': bank.bankBicSwift,
      'kontonummerEllerIban': bank.bankIban
    }
  }

  generatePeriods (periods) {
    let payload = {}
    periods.map(period => {
      switch (period.type) {
        case 'work':
          !_.has(payload, 'ansattSelvstendigPerioder')
            ? payload['ansattSelvstendigPerioder'] = [this.handleWorkPeriod(period)]
            : payload['ansattSelvstendigPerioder'].push(this.handleWorkPeriod(period))
          break
        case 'home':
          !_.has(payload, 'boPerioder')
            ? payload['boPerioder'] = [this.handleGenericPeriod(period)]
            : payload['boPerioder'].push(this.handleGenericPeriod(period))
          break
        case 'child':
          !_.has(payload, 'barnepassPerioder')
            ? payload['barnepassPerioder'] = [this.handleChildPeriod(period)]
            : payload['barnepassPerioder'].push(this.handleChildPeriod(period))
          break
        case 'voluntary':
          !_.has(payload, 'frivilligPerioder')
            ? payload['frivilligPerioder'] = [this.handleGenericPeriod(period)]
            : payload['frivilligPerioder'].push(this.handleGenericPeriod(period))
          break
        case 'military':
          !_.has(payload, 'forsvartjenestePerioder')
            ? payload['forsvartjenestePerioder'] = [this.handleGenericPeriod(period)]
            : payload['forsvartjenestePerioder'].push(this.handleGenericPeriod(period))
          break
        case 'birth':
          !_.has(payload, 'foedselspermisjonPerioder')
            ? payload['foedselspermisjonPerioder'] = [this.handleGenericPeriod(period)]
            : payload['foedselspermisjonPerioder'].push(this.handleGenericPeriod(period))
          break
        case 'learn':
          !_.has(payload, 'opplaeringPerioder')
            ? payload['opplaeringPerioder'] = [this.handleLearnPeriod(period)]
            : payload['opplaeringPerioder'].push(this.handleLearnPeriod(period))
          break
        case 'daily':
          !_.has(payload, 'arbeidsledigPerioder')
            ? payload['arbeidsledigPerioder'] = [this.handleGenericPeriod(period)]
            : payload['arbeidsledigPerioder'].push(this.handleGenericPeriod(period))
          break
        case 'sick':
          !_.has(payload, 'sykePerioder')
            ? payload['sykePerioder'] = [this.handleGenericPeriod(period)]
            : payload['sykePerioder'].push(this.handleGenericPeriod(period))
          break
        case 'other':
          !_.has(payload, 'andrePerioder')
            ? payload['andrePerioder'] = [this.handleGenericPeriod(period)]
            : payload['andrePerioder'].push(this.handleGenericPeriod(period))
          break
        default:
          return {}
      }
      return period
    })
    return payload
  }
}

const instance = new Util()
Object.freeze(instance)
export default instance
