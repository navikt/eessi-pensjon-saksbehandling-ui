import _ from 'lodash'
import sampleP4000info from 'resources/tests/sampleP4000info'
import targetP4000info from 'resources/tests/targetP4000info'
import { T } from 'types'
import { Period, PeriodDate } from '../../declarations/period'
import P4000Payload from './P4000Payload'

describe('applications/BUC/components/SEDP4000/P4000Payload - empty payload', () => {
  let util: P4000Payload
  const t: T = jest.fn(t => t)
  const mockPeriod: Period = {
    startDate: { day: '1', month: '1', year: '1970' },
    endDate: { day: '1', month: '1', year: '1980' },
    dateType: 'both',
    uncertainDate: false,
    comment: '',
    type: 'work',
    country: { label: 'Norge', value: 'NO' }
  } as Period

  beforeAll(() => {
    util = new P4000Payload([], t)
  })

  it('Initializes', () => {
    const mockPinfo = [sampleP4000info.stayAbroad[0]] as Array<Period>
    util = new P4000Payload(mockPinfo, t)
    expect(util.pinfo).toEqual(mockPinfo)
  })

  it('handleDate(): both', () => {
    expect(util.handleDate(mockPeriod)).toEqual({
      lukketPeriode: {
        fom: '01.01.1970',
        tom: '01.01.1980'
      }
    })
  })

  it('handleDate(): start date 01', () => {
    expect(util.handleDate({
      ...mockPeriod,
      dateType: 'onlyStartDate01'
    })).toEqual({
      openPeriode: {
        fom: '01.01.1970',
        extra: '01'
      }
    })
  })

  it('handleDate(): start date 98', () => {
    expect(util.handleDate({
      ...mockPeriod,
      dateType: 'onlyStartDate98'
    })).toEqual({
      openPeriode: {
        fom: '01.01.1970',
        extra: '98'
      }
    })
  })

  it('renderDate invalid date', () => {
    expect(util.renderDate(null)).toEqual('ui:unknown')
  })

  it('renderDate valid date', () => {
    const date = { year: '2020', month: '12', day: '17' }
    expect(util.renderDate(date)).toEqual('17.12.2020')
  })

  it('pinfoDateToDate invalid date', () => {
    expect(P4000Payload.pinfoDateToDate(null)).toEqual(null)
  })

  it('pinfoDateToDate valid date', () => {
    // @ts-ignore
    const date: PeriodDate = { month: '11', year: '2020' }
    const generatedDate: Date | null = P4000Payload.pinfoDateToDate(date)
    expect(generatedDate!.getDay()).toEqual(1)
    expect(generatedDate!.getMonth()).toEqual(10)
    expect(generatedDate!.getFullYear()).toEqual(2020)
  })

  it('handleCountry()', () => {
    expect(util.handleCountry({ label: 'mockCountryLabel', value: 'mockCountryValue' })).toEqual('mockCountryValue')
  })

  it('handleWorkPeriod()', () => {
    const sourcePeriod: Period = _.find(sampleP4000info.stayAbroad, it => it.type === 'work')!
    const targetPeriod = targetP4000info.trygdetid.ansattSelvstendigPerioder[0]
    const transformedPeriod = util.handleWorkPeriod(sourcePeriod!)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleHomePeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'home')!
    const targetPeriod = targetP4000info.trygdetid.boPerioder[0]
    const transformedPeriod = util.handleHomePeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleChildPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'child')!
    const targetPeriod = targetP4000info.trygdetid.barnepassPerioder[0]
    const transformedPeriod = util.handleChildPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })
})

describe('applications/BUC/components/SEDP4000/P4000Payload - with payload', () => {
  let util: P4000Payload
  const t = jest.fn(t => t)

  beforeAll(() => {
    util = new P4000Payload(sampleP4000info.stayAbroad, t)
  })

  it('handleLearnPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'learn')!
    const targetPeriod = targetP4000info.trygdetid.opplaeringPerioder[0]
    const transformedPeriod = util.handleLearnPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleBirthPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'birth')!
    const targetPeriod = targetP4000info.trygdetid.foedselspermisjonPerioder[0]
    const transformedPeriod = util.handleBirthPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleVoluntaryPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'voluntary')!
    const targetPeriod = targetP4000info.trygdetid.frivilligPerioder[0]
    const transformedPeriod = util.handleVoluntaryPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleMilitaryPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'military')!
    const targetPeriod = targetP4000info.trygdetid.forsvartjenestePerioder[0]
    const transformedPeriod = util.handleMilitaryPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleDailyPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'daily')!
    const targetPeriod = targetP4000info.trygdetid.arbeidsledigPerioder[0]
    const transformedPeriod = util.handleDailyPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleSickPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'sick')!
    const targetPeriod = targetP4000info.trygdetid.sykePerioder[0]
    const transformedPeriod = util.handleSickPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })

  it('handleOtherPeriod()', () => {
    const sourcePeriod: Period = _(sampleP4000info.stayAbroad).find(it => it.type === 'other')!
    const targetPeriod = targetP4000info.trygdetid.andrePerioder[0]
    const transformedPeriod = util.handleOtherPeriod(sourcePeriod)
    expect(transformedPeriod).toEqual(targetPeriod)
  })
})

describe('applications/BUC/components/SEDP4000/P4000Payload - with payload', () => {
  let util: P4000Payload
  const t = jest.fn(t => t)

  beforeAll(() => {
    util = new P4000Payload(sampleP4000info.stayAbroad, t)
  })

  it('generatePayload', () => {
    const result = util.generatePayload()
    expect(result).toHaveProperty('periodeInfo')
    expect(result.periodeInfo).toEqual(targetP4000info.trygdetid)
  })
})
