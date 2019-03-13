import React from 'react'
import { createStore, combineReducers } from 'redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Period, mapStateToProps } from './Period'
import _ from 'lodash'
import MD5 from 'md5.js'

import * as uiActions from '../../../actions/ui'
import * as pinfoActions from '../../../actions/pinfo'
import * as storageActions from '../../../actions/storage'
import * as attachmentActions from '../../../actions/attachment'
import * as reducers from '../../../reducers'

// mock actions that will be connected to the component
jest.mock('../../../actions/storage', () => ({
  ...jest.requireActual('../../../actions/storage'),
  postStorageFileWithNoNotification: jest.fn(() => ({
    type: 'STORAGE/POST/NO_NOTIF/SUCCESS',
    payload: { success: 'true' }
  }))
}))
jest.mock('../../../actions/attachment', () => ({
  ...jest.requireActual('../../../actions/attachment'),
  syncLocalStateWithStorage: jest.fn(() => ({
    type: 'MOCK_NULL_ACTION'
  }))
}))
jest.mock('../../../actions/ui', () => ({
  ...jest.requireActual('../../../actions/ui'),
  openModal: jest.fn(() => ({
    type: 'MOCK_NULL_ACTION'
  }))
}))

const initialState = {
  app: {
    username: '12345678910'
  }
}

const reducer = combineReducers({
  ...reducers
})

const t = jest.fn((translationString) => { return translationString })

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, storageActions, pinfoActions, uiActions, attachmentActions), dispatch) }
}

describe('Period', () => {
  let store,
    wrapper,
    editPeriod

  beforeEach(() => {
    store = createStore(reducer, initialState)
    editPeriod = jest.fn()
    let ConnectedPeriod = connect(
      mapStateToProps,
      mapDispatchToProps
    )(Period)
    wrapper = shallow(<ConnectedPeriod t={t} editPeriod={editPeriod} store={store} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('hasNoErrors() function', () => {
    expect(wrapper.instance().hasNoErrors({ foo: 'bar' })).toEqual(false)
    expect(wrapper.instance().hasNoErrors({})).toEqual(true)
  })

  it('hasSpecialCases() function', () => {
    let francePeriods = [{
      type: 'foo',
      country: { value: 'FR', label: 'Frankrike' }
    }]
    let norwayPeriods = [{
      type: 'foo',
      country: { value: 'NO', label: 'Norge' }
    }]
    expect(wrapper.instance().hasSpecialCases(francePeriods)).toEqual(true)
    expect(wrapper.instance().hasSpecialCases(norwayPeriods)).toEqual(false)
  })

  it('isASpecialCase() function', () => {
    let francePeriod = {
      type: 'foo',
      country: { value: 'FR', label: 'Frankrike' }
    }
    let spainPeriod = {
      type: 'foo',
      country: { value: 'ES', label: 'Spania' }
    }
    let norwayPeriod = {
      type: 'foo',
      country: { value: 'NO', label: 'Norge' }
    }
    expect(wrapper.instance().isASpecialCase(francePeriod)).toEqual(true)
    expect(wrapper.instance().isASpecialCase(spainPeriod)).toEqual(true)
    expect(wrapper.instance().isASpecialCase(norwayPeriod)).toEqual(false)
  })

  it('setAttachments() function', () => {
    let file = {
      type: 'application/pdf',
      name: 'test.pdf',
      size: 123,
      content: {
        base64: 'base64,qwerty'
      }
    }
    let mockFiles = [_.cloneDeep(file)]
    let md5Hash = new MD5().update('base64,qwerty').digest('hex')
    let mockLocalFile = [{
      ...file,
      content: {
        md5: md5Hash
      }
    }]
    wrapper.instance().setAttachments(mockFiles)
    expect(wrapper.instance().state._period.attachments).toEqual(mockLocalFile)
    expect(store.getState().attachment[md5Hash]).toEqual(file)
  })

  it('eventSetPerson() function', () => {
    let mockKey = 'mockKey'
    let mockValue = 'mockValue'
    wrapper.instance().eventSetPerson(mockKey, null, { target: { value: mockValue } })
    expect(store.getState().pinfo.person).toHaveProperty(mockKey, mockValue)
  })

  it('eventSetProperty() function', () => {
    let mockKey = 'mockKey'
    let mockValue = 'mockValue'
    wrapper.instance().eventSetProperty(mockKey, null, { target: { value: mockValue } })
    expect(wrapper.instance().state._period[mockKey]).toEqual(mockValue)
  })

  it('dateBlur() function with an invalid date', () => {
    let mockKey = 'mockKey'
    let mockValue = new Date()
    let mockDateValidationFn = () => { return 'pinfo:mockErrorMessage' }
    wrapper.instance().dateBlur(mockKey, mockDateValidationFn, mockValue)
    expect(wrapper.instance().state.localErrors).toHaveProperty(mockKey, 'pinfo:mockErrorMessage')
  })

  it('dateBlur() function with an valid date', () => {
    let mockKey = 'mockKey'
    let mockValue = new Date()
    let mockDateValidationFn = () => { return undefined }
    wrapper.instance().dateBlur(mockKey, mockDateValidationFn, mockValue)
    expect(wrapper.instance().state.localErrors).toHaveProperty(mockKey, undefined)
  })

  it('dateSetProperty() function', () => {
    let mockKey = 'mockKey'
    let mockValue = new Date()
    wrapper.instance().dateSetProperty(mockKey, null, mockValue)
    expect(wrapper.instance().state._period[mockKey]).toEqual(mockValue)
  })

  it('valueSetProperty() function', () => {
    let mockKey = 'mockKey'
    let mockValue = 'mockValue'
    wrapper.instance().dateSetProperty(mockKey, null, mockValue)
    expect(wrapper.instance().state._period[mockKey]).toEqual(mockValue)
  })

  it('validatePeriod() function', async () => {
    await wrapper.setProps({
      person: {}
    })
    await wrapper.instance().setState({
      _period: {
        type: 'work'
      }
    })
    let errors = wrapper.instance().validatePeriod()

    expect(errors).toHaveProperty('country', 'pinfo:validation-noCountry')
    expect(errors).toHaveProperty('startDate', 'pinfo:validation-noStartDate')
    expect(errors).toHaveProperty('endDate', 'pinfo:validation-noEndDate')
    expect(errors).toHaveProperty('place', 'pinfo:validation-noPlace')
    expect(errors).toHaveProperty('workActivity', 'pinfo:validation-noWorkActivity')
  })

  it('addInsuranceId() function', () => {
    let mockId = '123'
    wrapper.instance().addInsuranceId(mockId)
    expect(wrapper.instance().state._period.insuranceId).toEqual(mockId)
  })

  it('addInsuranceName() function', () => {
    let mockName = 'mockName'
    wrapper.instance().addInsuranceName(mockName)
    expect(wrapper.instance().state._period.insuranceName).toEqual(mockName)
  })

  it('saveNewPeriod() function', () => {
    let mockPeriod = {
      type: 'work',
      startDate: { day: '01', month: '01', year: '1970' },
      endDate: { day: '31', month: '12', year: '1979' },
      place: 'Oslo',
      country: 'NO',
      workActivity: 'Lærer'
    }
    wrapper.setProps({
      periods: []
    })
    wrapper.instance().setState({
      _period: mockPeriod
    })
    wrapper.instance().saveNewPeriod()
    expect(wrapper.instance().state._period).toEqual({})

    // adding auto-generated ID before comparing periods
    mockPeriod.id = store.getState().pinfo.stayAbroad[0].id
    expect(store.getState().pinfo.stayAbroad).toStrictEqual([mockPeriod])
  })

  it('requestEditPeriod() function', () => {
    let mockPeriod = {
      type: 'work',
      startDate: { day: '01', month: '01', year: '1970' },
      endDate: { day: '31', month: '12', year: '1979' },
      place: 'Oslo',
      country: 'NO',
      workActivity: 'Lærer',
      id: 123
    }
    wrapper.setProps({
      periods: [mockPeriod]
    })
    wrapper.instance().requestEditPeriod(mockPeriod)
    expect(editPeriod.mock.calls.length).toBe(1)
  })

  it('saveEditPeriod() function', () => {
    let mockPeriod = {
      type: 'work',
      startDate: { day: '01', month: '01', year: '1970' },
      endDate: { day: '31', month: '12', year: '1979' },
      place: 'Oslo',
      country: 'NO',
      workActivity: 'Lærer',
      id: 123
    }
    wrapper.setProps({
      periods: [mockPeriod]
    })
    // I have changes to save
    wrapper.instance().setState({
      _period: Object.assign({}, mockPeriod, { country: 'SE' })
    })
    wrapper.instance().saveEditPeriod()
    expect(wrapper.instance().state._period).toEqual({})

    mockPeriod.country = 'SE'
    mockPeriod.id = store.getState().pinfo.stayAbroad[0].id
    expect(store.getState().pinfo.stayAbroad).toStrictEqual([mockPeriod])
  })

  it('doCancelPeriod() function', () => {
    wrapper.instance().setState({
      _period: { foo: 'bar' }
    })
    wrapper.instance().doCancelPeriod()
    expect(wrapper.instance().state._period).toEqual({})
  })

  it('removePeriodRequest() function', () => {
    wrapper.instance().removePeriodRequest()
    expect(uiActions.openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        modalTitle: 'pinfo:alert-deletePeriod'
      })
    )
  })

  it('cancelPeriodRequest() function', () => {
    wrapper.instance().cancelPeriodRequest()
    expect(uiActions.openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        modalTitle: 'pinfo:alert-cancelPeriod'
      })
    )
  })

  it('doRemovePeriod() function', () => {
    let mockPeriod = {
      type: 'work',
      startDate: { day: '01', month: '01', year: '1970' },
      endDate: { day: '31', month: '12', year: '1979' },
      place: 'Oslo',
      country: 'NO',
      workActivity: 'Lærer',
      id: 123
    }
    wrapper.setProps({
      periods: [mockPeriod]
    })

    wrapper.instance().doRemovePeriod(mockPeriod)
    expect(wrapper.instance().state._period).toEqual({})
    expect(store.getState().pinfo.stayAbroad).toStrictEqual([])
  })

  it('errorMessage() function', () => {
    wrapper.instance().setState({})
    expect(wrapper.instance().errorMessage()).toBe(undefined)

    wrapper.instance().setState({
      localErrors: { a: 'b' },
      displayError: false
    })
    expect(wrapper.instance().errorMessage()).toBe(undefined)

    wrapper.instance().setState({
      localErrors: { a: 'b' },
      displayError: true
    })
    expect(wrapper.instance().errorMessage()).toBe('b')
  })

  it('getPeriodAttachments() function', () => {
    let mockPeriod = {
      type: 'work',
      attachments: [{
        content: { md5: 'md5_1' }
      }, {
        content: { md5: 'md5_3' }
      }]
    }
    wrapper.setProps({
      attachments: {
        md5_1: { name: 'attachment_1' },
        md5_2: { name: 'attachment_2' },
        md5_3: { name: 'attachment_3' },
        md5_4: { name: 'attachment_4' }
      }
    })
    let attachments = wrapper.instance().getPeriodAttachments(mockPeriod)
    expect(attachments).toEqual([{ name: 'attachment_1' }, { name: 'attachment_3' }])
  })

  it('renderTagsForInsuranceName() function', () => {
    wrapper.setProps({
      periods: [{
        insuranceName: 'mockInsuranceName1'
      }, {
        insuranceName: 'mockInsuranceName2'
      }, {
        insuranceName: 'mockInsuranceName3'
      }]
    })
    wrapper.instance().setState({
      _period: {
        insuranceName: 'mockInsuranceName2'
      }
    })
    let result = wrapper.instance().renderTagsForInsuranceName()
    expect(result.length).toBe(2)
    let content = result.map(res => {
      return mount(res).find('b').text()
    })
    expect(content).toEqual(['mockInsuranceName1', 'mockInsuranceName3'])
  })

  it('renderTagsForInsuranceId() function', () => {
    wrapper.setProps({
      periods: [{
        insuranceId: 'mockInsuranceId1'
      }, {
        insuranceId: 'mockInsuranceId2'
      }, {
        insuranceId: 'mockInsuranceId3'
      }]
    })
    wrapper.instance().setState({
      _period: {
        insuranceId: 'mockInsuranceId2'
      }
    })
    let result = wrapper.instance().renderTagsForInsuranceId()
    expect(result.length).toBe(2)
    let content = result.map(res => {
      return mount(res).find('b').text()
    })
    expect(content).toEqual(['mockInsuranceId1', 'mockInsuranceId3'])
  })
})
