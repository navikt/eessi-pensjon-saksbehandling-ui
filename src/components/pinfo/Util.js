import _ from 'lodash'
import moment from 'moment'

class Util {
  writeDate (date) {
    return moment(date).format('DD.MM.YYYY')
  }

  handleDate (period) {
    let result = {
      lukketPeriode: null,
      openPeriode: null
    }
    if (period.endDate) {
      result.lukketPeriode = {
        fom: this.writeDate(period.startDate),
        tom: this.writeDate(period.endDate),
        extra: null
      }
    } else {
      result.openPeriode = {
        extra: '01',
        fom: this.writeDate(period.startDate),
        tom: null
      }
    }
    return result
  }

  handleGenericPeriod (period) {
    return {
      land: period.country.value,
      periode: this.handleDate(period),
      vedlegg: period.attachments
    }
  }

  handleWorkPeriod (period) {
    let newPeriod = this.handleGenericPeriod(period)
    newPeriod.addressFirma = {
      by: period.workCity,
      address: period.workAddress,
      region: period.workRegion,
      land: period.country
    }
    delete newPeriod.land
    newPeriod.forsikkringEllerRegistreringNr = period.workId
    newPeriod.jobbUnderAnsattEllerSelvstendig = period.workActivity
    newPeriod.navnFirma = period.workName
    return newPeriod
  }

  handleChildPeriod (period) {
    let newPeriod = this.handleGenericPeriod(period)
    newPeriod.informasjonBarn = {
      etternavn: period.childLastName,
      foedseldato: this.writeDate(period.childBirthDate),
      fornavn: period.childFirstName,
      land: period.country
    }
    delete newPeriod.land
    return newPeriod
  }

  handleLearnPeriod (period) {
    let newPeriod = this.handleGenericPeriod(period)
    newPeriod.navnPaaInstitusjon = period.learnInstitution
    return newPeriod
  }

  generatePayload (periods) {
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
