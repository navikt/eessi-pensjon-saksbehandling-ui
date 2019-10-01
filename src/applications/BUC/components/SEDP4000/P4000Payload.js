import _ from 'lodash'
import moment from 'moment'

export default class P4000Payload {
  constructor (pinfo, t) {
    this.pinfo = pinfo
    this.t = t
  }

  pinfoDateToDate (date) {
    if (!date || !date.year || !date.month) { return null }
    const day = parseInt(date.day) || 1
    const month = parseInt(date.month, 10) - 1
    const year = parseInt(date.year)
    return { year, month, day }
  }

  renderDate (date) {
    if (!date) {
      return this.t('ui:unknown')
    }
    const d = moment(this.pinfoDateToDate(date))
    return d.isValid() ? d.format('YYYY-MM-DD') : null
  }

  handleDate (period) {
    switch (period.dateType) {
      case 'both':
        return {
          lukketPeriode: {
            fom: this.renderDate(period.startDate),
            tom: this.renderDate(period.endDate)
          }
        }
      case 'onlyStartDate01':
        return {
          openPeriode: {
            extra: '01',
            fom: this.renderDate(period.startDate)
          }
        }
      case 'onlyStartDate98':
        return {
          openPeriode: {
            extra: '98',
            fom: this.renderDate(period.startDate)
          }
        }

      default:
        return null
    }
  }

  handleCountry (country) {
    return country.value
  }

  handleGenericPeriod (period) {
    const result = {}

    result.land = this.handleCountry(period.country)
    result.periode = this.handleDate(period)
    if (period.attachments) {
      result.vedlegg = period.attachments
    }
    if (period.insuranceName) {
      result.trygdeordningnavn = period.insuranceName
    }

    if (period.insuranceType) {
      result.medlemskap = period.insuranceType
    }

    if (period.insuranceId) {
      result.forsikkringEllerRegistreringNr = period.insuranceId
    }

    result.annenInformasjon = period.comment
    result.usikkerDatoIndikator = period.uncertainDate ? '1' : '0'
    return result
  }

  handleWorkPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.jobbUnderAnsattEllerSelvstendig = period.workActivity
    newPeriod.navnFirma = period.workName
    newPeriod.typePeriode = period.workType
    newPeriod.adresseFirma = {
      postnummer: period.workZipCode,
      by: period.workCity,
      land: this.handleCountry(period.country),
      gate: period.workStreet,
      region: period.workRegion
    }
    delete newPeriod.land
    return newPeriod
  }

  handleDailyPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.navnPaaInstitusjon = period.payingInstitution
    return newPeriod
  }

  handleSickPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.navnPaaInstitusjon = period.payingInstitution
    return newPeriod
  }

  handleHomePeriod (period) {
    return this.handleGenericPeriod(period)
  }

  handleBirthPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  handleVoluntaryPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  handleMilitaryPeriod (period) {
    return this.handleGenericPeriod(period)
  }

  handleOtherPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.typePeriode = period.otherType
    return newPeriod
  }

  handleChildPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.informasjonBarn = {
      etternavn: period.childLastName,
      foedseldato: this.renderDate(period.childBirthDate),
      fornavn: period.childFirstName,
      land: this.handleCountry(period.country)
    }
    delete newPeriod.land
    return newPeriod
  }

  handleLearnPeriod (period) {
    const newPeriod = this.handleGenericPeriod(period)
    newPeriod.navnPaaInstitusjon = period.learnInstitution
    return newPeriod
  }

  generatePayload () {
    return { periodeInfo: this.generatePeriods() }
  }

  generatePeriods () {
    const payload = {}
    this.pinfo.map(period => {
      switch (period.type) {
        case 'work':
          !_.has(payload, 'ansattSelvstendigPerioder')
            ? payload.ansattSelvstendigPerioder = [this.handleWorkPeriod(period)]
            : payload.ansattSelvstendigPerioder.push(this.handleWorkPeriod(period))
          break
        case 'home':
          !_.has(payload, 'boPerioder')
            ? payload.boPerioder = [this.handleHomePeriod(period)]
            : payload.boPerioder.push(this.handleHomePeriod(period))
          break
        case 'child':
          !_.has(payload, 'barnepassPerioder')
            ? payload.barnepassPerioder = [this.handleChildPeriod(period)]
            : payload.barnepassPerioder.push(this.handleChildPeriod(period))
          break
        case 'voluntary':
          !_.has(payload, 'frivilligPerioder')
            ? payload.frivilligPerioder = [this.handleVoluntaryPeriod(period)]
            : payload.frivilligPerioder.push(this.handleVoluntaryPeriod(period))
          break
        case 'military':
          !_.has(payload, 'forsvartjenestePerioder')
            ? payload.forsvartjenestePerioder = [this.handleMilitaryPeriod(period)]
            : payload.forsvartjenestePerioder.push(this.handleMilitaryPeriod(period))
          break
        case 'birth':
          !_.has(payload, 'foedselspermisjonPerioder')
            ? payload.foedselspermisjonPerioder = [this.handleBirthPeriod(period)]
            : payload.foedselspermisjonPerioder.push(this.handleBirthPeriod(period))
          break
        case 'learn':
          !_.has(payload, 'opplaeringPerioder')
            ? payload.opplaeringPerioder = [this.handleLearnPeriod(period)]
            : payload.opplaeringPerioder.push(this.handleLearnPeriod(period))
          break
        case 'daily':
          !_.has(payload, 'arbeidsledigPerioder')
            ? payload.arbeidsledigPerioder = [this.handleDailyPeriod(period)]
            : payload.arbeidsledigPerioder.push(this.handleDailyPeriod(period))
          break
        case 'sick':
          !_.has(payload, 'sykePerioder')
            ? payload.sykePerioder = [this.handleSickPeriod(period)]
            : payload.sykePerioder.push(this.handleSickPeriod(period))
          break
        case 'other':
          !_.has(payload, 'andrePerioder')
            ? payload.andrePerioder = [this.handleOtherPeriod(period)]
            : payload.andrePerioder.push(this.handleOtherPeriod(period))
          break
        default:
          return {}
      }
      return period
    })
    return payload
  }
}
