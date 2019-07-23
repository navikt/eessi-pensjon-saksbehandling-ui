import Util from './Util'
import _ from 'lodash'

describe('applications/BUC/components/SEDP4000/Util', () => {

   const mockPeriods = [{
     type: 'work',
     startDate: {day: '1', month: '1', year: '1970'},
     endDate: {day: '1', month: '1', year: '1971'},
     country: {value: 'mockCountry'},
     workActivity: 'mockWorkActivity',
     workName: 'mockWorkName',
     workPlace: 'mockWorkPlace',
     comment: 'mockWorkComment',
     insuranceName: 'mockInsuranceName',
     insuranceType: 'mockInsuranceType',
     insuranceId: 'mockInsuranceId'
   }, {
     type: 'home',
     startDate: {day: '1', month: '1', year: '1971'},
     endDate: {day: '1', month: '1', year: '1972'},
     country: {value: 'mockCountry'},
     place: 'mockPlace',
     comment: 'mockHomeComment'
   }, {
     type: 'learn',
     startDate: {day: '1', month: '1', year: '1972'},
     endDate: {day: '1', month: '1', year: '1973'},
     country: {value: 'mockCountry'},
     comment: 'mockLearnComment',
     learnInstitution: 'mockLearnInstitution'
   }, {
     type: 'military',
     startDate: {day: '1', month: '1', year: '1973'},
     endDate: {day: '1', month: '1', year: '1974'},
     country: {value: 'mockCountry'},
     comment: 'mockMilitaryComment'
   }, {
     type: 'voluntary',
     startDate: {day: '1', month: '1', year: '1974'},
     endDate: {day: '1', month: '1', year: '1975'},
     country: {value: 'mockCountry'},
     comment: 'mockVoluntaryComment'
   }, {
     type: 'birth',
     startDate: {day: '1', month: '1', year: '1975'},
     endDate: {day: '1', month: '1', year: '1976'},
     country: {value: 'mockCountry'},
     comment: 'mockBirthComment'
   }, {
     type: 'child',
     startDate: {day: '1', month: '1', year: '1976'},
     endDate: {day: '1', month: '1', year: '1977'},
     country: {value: 'mockCountry'},
     comment: 'mockChildComment',
     childFirstName: 'mockChildFirstName',
     childLastName: 'mockChildLastName',
     childBirthDate: {day: '1', month: '1', year: '1976'}
  }, {
     type: 'daily',
     startDate: {day: '1', month: '1', year: '1977'},
     endDate: {day: '1', month: '1', year: '1978'},
     country: {value: 'mockCountry'},
     comment: 'mockDailyComment',
     payingInstitution: 'mockPayingInstitution'
  }, {
     type: 'sick',
     startDate: {day: '1', month: '1', year: '1978'},
     endDate: {day: '1', month: '1', year: '1979'},
     country: {value: 'mockCountry'},
     comment: 'mockSickComment',
     payingInstitution: 'mockPayingInstitution'
  }, {
     type: 'other',
     startDate: {day: '1', month: '1', year: '1979'},
     endDate: {day: '1', month: '1', year: '1980'},
     country: {value: 'mockCountry'},
     comment: 'mockOtherComment',
     otherType: 'mockOtherType'
  }]

  it ('Initializes', () => {
     const mockPinfo = {foo: 'bar'}
     const util = new Util(mockPinfo)
     expect(util.pinfo).toEqual(mockPinfo)
  })

  it ('writeDate()', () => {
    const util = new Util({})
    const mockDate = {day: '20', month: '10', year: '1980'}
    expect(util.writeDate(mockDate)).toEqual('20.10.1980')
  })

  it ('handleDate()', () => {

    const util = new Util({})
    const mockPeriod = {
      startDate: {day: '1', month: '1', year: '1970'},
      endDate: {day: '1', month: '1', year: '1980'}
    }
    expect(util.handleDate(mockPeriod)).toEqual({
      fom: '01.01.1970',
      tom: '01.01.1980'
    })
  })

  it ('handleCountry()', () => {
    const util = new Util({})
    expect(util.handleCountry({value: 'mockCountry'})).toEqual('mockCountry')
  })

  it ('handleGenericPeriod()', () => {
    const util = new Util({})
    const period = util.handleGenericPeriod(mockPeriods[0])
    expect(period.land).toEqual('mockCountry')
    expect(period.periode).toEqual({
      fom: '01.01.1970',
      tom: '01.01.1971'
    })
    expect(period.vedlegg).toEqual(undefined)
    expect(period.sted).toEqual(undefined)
    expect(period.trygdeordningnavn).toEqual('mockInsuranceName')
    expect(period.medlemskap).toEqual('mockInsuranceType')
    expect(period.forsikringId).toEqual('mockInsuranceId')
    expect(period.firmaSted).toEqual('mockWorkPlace')
    expect(period.firmaLand).toEqual('mockCountry')
    expect(period.navnFirma).toEqual('mockWorkName')
    expect(period.jobbUnderAnsattEllerSelvstendig).toEqual('mockWorkActivity')
    expect(period.navnPaaInstitusjon).toEqual(undefined)
  })

  it ('handleWorkPeriod()', () => {
     const util = new Util({})
     const period = util.handleWorkPeriod(_(mockPeriods).find(it => it.type === 'work'))
     const genericPeriod = util.handleGenericPeriod(_(mockPeriods).find(it => it.type === 'work'))
     expect(period).toEqual(genericPeriod)
  })

  it ('handleDailyOrSickPeriod()', () => {
     const util = new Util({})
     const period = util.handleDailyOrSickPeriod(_(mockPeriods).find(it => it.type === 'daily'))
     expect(period.payingInstitution).toEqual('mockPayingInstitution')
  })

  it ('handleOtherPeriod()', () => {
     const util = new Util({})
     const period = util.handleOtherPeriod(_(mockPeriods).find(it => it.type === 'other'))
     expect(period.otherType).toEqual('mockOtherType')
  })

  it ('handleOtherPeriod()', () => {
     const util = new Util({})
     const period = util.handleChildPeriod(_(mockPeriods).find(it => it.type === 'child'))
     expect(period.barnEtternavn).toEqual('mockChildLastName')
     expect(period.barnFornavn).toEqual('mockChildFirstName')
     expect(period.barnFoedseldato).toEqual('01.01.1976')
  })

  it ('handleLearnPeriod()', () => {
     const util = new Util({})
     const period = util.handleLearnPeriod(_(mockPeriods).find(it => it.type === 'learn'))
     expect(period.navnPaaInstitusjon).toEqual('mockLearnInstitution')
  })

  it ('generatePayload()', () => {
    const util = new Util(mockPeriods)
    const result = util.generatePayload()
    expect(result).toHaveProperty('periodeInfo')
  })

  it ('generatePeriods()', () => {
    const util = new Util(mockPeriods)
    const result = util.generatePayload()
    expect(result.periodeInfo).toHaveProperty('ansattSelvstendigPerioder')
    expect(result.periodeInfo.ansattSelvstendigPerioder[0]).toHaveProperty('comment', 'mockWorkComment')
    expect(result.periodeInfo).toHaveProperty('boPerioder')
    expect(result.periodeInfo.boPerioder[0]).toHaveProperty('comment', 'mockHomeComment')
    expect(result.periodeInfo).toHaveProperty('barnepassPerioder')
    expect(result.periodeInfo.barnepassPerioder[0]).toHaveProperty('comment', 'mockChildComment')
    expect(result.periodeInfo).toHaveProperty('frivilligPerioder')
    expect(result.periodeInfo.frivilligPerioder[0]).toHaveProperty('comment', 'mockVoluntaryComment')
    expect(result.periodeInfo).toHaveProperty('forsvartjenestePerioder')
    expect(result.periodeInfo.forsvartjenestePerioder[0]).toHaveProperty('comment', 'mockMilitaryComment')
    expect(result.periodeInfo).toHaveProperty('foedselspermisjonPerioder')
    expect(result.periodeInfo.foedselspermisjonPerioder[0]).toHaveProperty('comment', 'mockBirthComment')
    expect(result.periodeInfo).toHaveProperty('opplaeringPerioder')
    expect(result.periodeInfo.opplaeringPerioder[0]).toHaveProperty('comment', 'mockLearnComment')
    expect(result.periodeInfo).toHaveProperty('arbeidsledigPerioder')
    expect(result.periodeInfo.arbeidsledigPerioder[0]).toHaveProperty('comment', 'mockDailyComment')
    expect(result.periodeInfo).toHaveProperty('sykePerioder')
    expect(result.periodeInfo.sykePerioder[0]).toHaveProperty('comment', 'mockSickComment')
    expect(result.periodeInfo).toHaveProperty('andrePerioder')
    expect(result.periodeInfo.andrePerioder[0]).toHaveProperty('comment', 'mockOtherComment')
  })
})
