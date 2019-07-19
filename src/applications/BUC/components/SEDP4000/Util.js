import _ from 'lodash'
import moment from 'moment'
import { pinfoDateToDate } from 'utils/Date'

export default class Util {

  constructor (pinfo) {
    this.pinfo = pinfo
  }

  writeDate (date) {
    return moment(pinfoDateToDate(date)).format('DD.MM.YYYY')
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
      sted: period.place,
      trygdeordningnavn: period.insuranceName,
      medlemskap: period.insuranceType,
      forsikringId: period.insuranceId,
      firmaSted: period.workPlace,
      firmaLand: this.handleCountry(period.country),
      navnFirma: period.workName,
      jobbUnderAnsattEllerSelvstendig: period.workActivity,
      navnPaaInstitusjon: period.learnInstitution
    }
  }

  handleWorkPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  handleDailyOrSickPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.payingInstitution = period.payingInstitution
    return newPeriod
  }

  handleOtherPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.other = period.other
    return newPeriod
  }

  handleChildPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.barnEtternavn = period.childLastName
    newPeriod.barnFoedseldato = this.writeDate(period.childBirthDate)
    newPeriod.barnFornavn = period.childFirstName
    return newPeriod
  }

  handleLearnPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  generatePayload () {
    const result = {}
    result.periodeInfo = this.generatePeriods()
    return result
  }

  generatePeriods () {
    const payload = {}
    this.pinfo.map(period => {
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
            ? payload['arbeidsledigPerioder'] = [this.handleDailyOrSickPeriod(period)]
            : payload['arbeidsledigPerioder'].push(this.handleDailyOrSickPeriod(period))
          break
        case 'sick':
          !_.has(payload, 'sykePerioder')
            ? payload['sykePerioder'] = [this.handleDailyOrSickPeriod(period)]
            : payload['sykePerioder'].push(this.handleDailyOrSickPeriod(period))
          break
        case 'other':
          !_.has(payload, 'andrePerioder')
            ? payload['andrePerioder'] = [this.handleOtherPeriod(period)]
            : payload['andrePerioder'].push(this.handleOtherPeriod(period))
          break
        default:
          return {}
      }
      return period
    })
    return payload
  }
}
