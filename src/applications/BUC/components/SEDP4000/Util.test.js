import Util from './Util'
import _ from 'lodash'
import sampleP4000info from 'resources/tests/sampleP4000info'
import targetP4000info from 'resources/tests/targetP4000info'

describe('applications/BUC/components/SEDP4000/Util - empty payload', () => {
  let util

  beforeAll(() => {
    util = new Util({})
  })

  it('Initializes', () => {
    const mockPinfo = { foo: 'bar' }
    util = new Util(mockPinfo)
    expect(util.pinfo).toEqual(mockPinfo)
  })

  it('writeDate()', () => {
    const mockDate = { day: '20', month: '10', year: '1980' }
    expect(util.writeDate(mockDate)).toEqual('1980-10-20')
  })

  it('handleDate(): both', () => {
    const mockPeriod = {
      startDate: { day: '1', month: '1', year: '1970' },
      endDate: { day: '1', month: '1', year: '1980' },
      dateType: 'both'
    }
    expect(util.handleDate(mockPeriod)).toEqual({
      lukketPeriode: {
        fom: '1970-01-01',
        tom: '1980-01-01'
      }
    })
  })

  it('handleDate(): start date 01', () => {
    const mockPeriod = {
      startDate: { day: '1', month: '1', year: '1970' },
      endDate: { day: '1', month: '1', year: '1980' },
      dateType: 'onlyStartDate01'
    }
    expect(util.handleDate(mockPeriod)).toEqual({
      openPeriode: {
        fom: '1970-01-01',
        extra: '01'
      }
    })
  })

  it('handleDate(): start date 98', () => {
    const mockPeriod = {
      startDate: { day: '1', month: '1', year: '1970' },
      endDate: { day: '1', month: '1', year: '1980' },
      dateType: 'onlyStartDate98'
    }
    expect(util.handleDate(mockPeriod)).toEqual({
      openPeriode: {
        fom: '1970-01-01',
        extra: '98'
      }
    })
  })

  it('handleCountry()', () => {
    expect(util.handleCountry({ value: 'mockCountry' })).toEqual('mockCountry')
  })

  it('handleWorkPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'work')
    const targetPeriod = targetP4000info.trygdetid.ansattSelvstendigPerioder[0]
    const transformedPeriod = util.handleWorkPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleHomePeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'home')
    const targetPeriod = targetP4000info.trygdetid.boPerioder[0]
    const transformedPeriod = util.handleHomePeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleChildPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'child')
    const targetPeriod = targetP4000info.trygdetid.barnepassPerioder[0]
    const transformedPeriod = util.handleChildPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })
})

describe('applications/BUC/components/SEDP4000/Util - with payload', () => {
  let util

  beforeAll(() => {
    util = new Util(sampleP4000info.stayAbroad)
  })

  it('handleLearnPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'learn')
    const targetPeriod = targetP4000info.trygdetid.opplaeringPerioder[0]
    const transformedPeriod = util.handleLearnPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleBirthPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'birth')
    const targetPeriod = targetP4000info.trygdetid.foedselspermisjonPerioder[0]
    const transformedPeriod = util.handleBirthPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleVoluntaryPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'voluntary')
    const targetPeriod = targetP4000info.trygdetid.frivilligPerioder[0]
    const transformedPeriod = util.handleVoluntaryPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleMilitaryPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'military')
    const targetPeriod = targetP4000info.trygdetid.forsvartjenestePerioder[0]
    const transformedPeriod = util.handleMilitaryPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleDailyPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'daily')
    const targetPeriod = targetP4000info.trygdetid.arbeidsledigPerioder[0]
    const transformedPeriod = util.handleDailyPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleSickPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'sick')
    const targetPeriod = targetP4000info.trygdetid.sykePerioder[0]
    const transformedPeriod = util.handleSickPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleOtherPeriod()', () => {
    const sourcePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'other')
    const targetPeriod = targetP4000info.trygdetid.andrePerioder[0]
    const transformedPeriod = util.handleOtherPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })
})

describe('applications/BUC/components/SEDP4000/Util - with payload', () => {
  let util

  beforeAll(() => {
    util = new Util(sampleP4000info.stayAbroad)
  })

  it('generatePayload', () => {
    const result = util.generatePayload()
    expect(result).toHaveProperty('periodeInfo')
    expect(result.periodeInfo).toEqual(targetP4000info.trygdetid)
  })
})
