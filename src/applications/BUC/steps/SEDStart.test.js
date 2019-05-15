import React from 'react'
import { store, connect, bindActionCreators } from 'store'
import * as reducers from 'reducers'

import { SEDStart, mapStateToProps } from './SEDStart'

import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'
import * as bucActions from '../../actions/buc'

const t = jest.fn((translationString) => { return translationString })

jest.mock('../../actions/api', () => ({
  call: jest.fn((options) => ({
    type: options.type.success,
    payload: { foo: 'bar' }
  }))
}))

jest.mock('../../i18n')

// mock actions that will be connected to the component
jest.mock('../../actions/case', () => ({
  ...jest.requireActual('../../actions/case'),
  getCaseFromCaseNumber: jest.fn(() => ({
    type: 'CASE/GET_CASE_NUMBER/SUCCESS',
    payload: { casenumber: '123', pinid: '456' }
  })),
  getSubjectAreaList: jest.fn(() => ({
    type: 'CASE/GET_SUBJECT_AREA_LIST/SUCCESS',
    payload: ['mockSubjectArea']
  })),
  getSedList: jest.fn((buc) => ({
    type: 'CASE/GET_SED_LIST/SUCCESS',
    payload: [`mockSedFor${buc}1`, `mockSedFor${buc}2`]
  })),
  getInstitutionListForCountry: jest.fn((country) => ({
    type: 'CASE/GET_INSTITUTION_LIST/SUCCESS',
    payload: [`mockInstitutionFor${country}1`, `mockInstitutionFor${country}2`]
  }))
}))

Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    origin: 'http://fake-url.nav.no/',
    pathname: '/_/case',
    search: '?sakId=123',
    href: 'http://fake-url.nav.no/_/case?sakId=123'
  }
})

const reducer = combineReducers({
  ...reducers
})

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, bucActions, appActions, uiActions), dispatch) }
}

describe('SEDStart: mount without sakId and AktoerId', () => {
  let store, wrapper, ConnectedSEDStart
  const initialState = {
    case: {
      step: 0
    },
    status: {}
  }

  beforeEach(() => {
    store = createStore(reducer, initialState)
    ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
    wrapper = shallow(<ConnectedSEDStart t={t} store={store} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('onFetchCaseButtonClick() with state values triggers getCaseFromCaseNumber ', async (done) => {
    wrapper.instance().onFetchCaseButtonClick()
    expect(store.getState().case.currentCase).toEqual(undefined)
    expect(wrapper.instance().state.validation).toEqual({
      sakId: 'buc:validation-noSakId',
      aktoerId: 'buc:validation-noAktoerId'
    })

    wrapper.instance().setState({
      _sakId: '123',
      _aktoerId: '456',
      _rinaId: '789',
      validation: {}
    })

    wrapper.instance().onFetchCaseButtonClick()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(store.getState().case.currentCase).toEqual({ casenumber: '123', pinid: '456' })
        done()
      }, 500)
    })
  })
})

describe('SEDStart: mount with sakId and AktoerId', () => {
  let store, wrapper, ConnectedSEDStart
  const initialState = {
    case: {
      step: 0
    },
    status: {
      sakId: '123',
      aktoerId: '456'
    }
  }

  beforeEach(() => {
    store = createStore(reducer, initialState)
    ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
    wrapper = shallow(<ConnectedSEDStart t={t} store={store} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('Fetches currentCase when given sakId and aktoerId', () => {
    expect(store.getState().case.currentCase).toEqual({ casenumber: '123', pinid: '456' })
  })
})

describe('SEDStart: rest of functions', () => {
  let store, wrapper, ConnectedSEDStart
  const initialState = {
    case: {
      step: 0
    },
    status: {
      sakId: '123',
      aktoerId: '456'
    },
    ui: {
      locale: 'nb'
    }
  }

  beforeEach(() => {
    store = createStore(reducer, initialState)
    ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
    wrapper = shallow(<ConnectedSEDStart t={t} store={store} />).dive()
  })

  it('onSakIdChange()', () => {
    let mockSakId = 'mockSakId'
    let mockEvent = { target: { value: mockSakId } }
    wrapper.instance().onSakIdChange(mockEvent)
    expect(wrapper.instance().state._sakId).toEqual(mockSakId)
  })

  it('onRinaIdChange()', () => {
    let mockRinaId = 'mockRinaId'
    let mockEvent = { target: { value: mockRinaId } }
    wrapper.instance().onRinaIdChange(mockEvent)
    expect(wrapper.instance().state._rinaId).toEqual(mockRinaId)
  })

  it('onAktoerIdChange()', () => {
    let mockAktoerId = 'mockAktoerId'
    let mockEvent = { target: { value: mockAktoerId } }
    wrapper.instance().onAktoerIdChange(mockEvent)
    expect(wrapper.instance().state._aktoerId).toEqual(mockAktoerId)
  })

  it('onVedtakIdChange()', () => {
    let mockVedtakId = 'mockVedtakId'
    let mockEvent = { target: { value: mockVedtakId } }
    wrapper.instance().onVedtakIdChange(mockEvent)
    expect(wrapper.instance().state._vedtakId).toEqual(mockVedtakId)
  })

  it('parseMottak()', () => {
    expect(wrapper.instance().parseMottak(undefined)).toEqual(undefined)
    expect(wrapper.instance().parseMottak('invalid')).toEqual(undefined)
    expect(wrapper.instance().parseMottak('mockCountry/mockInstitution')).toEqual({
      institution: 'mockInstitution',
      country: 'mockCountry'
    })
  })

  it('onForwardButtonClick() triggers dataPreview and moves to next step ', () => {
    expect(store.getState().case.step).toEqual(0)
    expect(store.getState().case.previewData).toEqual(undefined)
    wrapper.instance().setState({
      _subjectArea: 'mockSubjectArea',
      _buc: 'mockBuc',
      _sed: 'mockSed',
      _institutions: [{ institution: 'mockInstitution', country: 'mockCountry' }]
    })
    wrapper.setProps({
      currentCase: {
        casenumber: '123',
        pinid: '456'
      }
    })
    wrapper.instance().onForwardButtonClick()
    expect(store.getState().case.step).toEqual(1)
    expect(store.getState().case.previewData).not.toEqual(undefined)
  })

  it('validateSubjectArea() with invalid subjectArea', () => {
    let invalidSubjectArea = ''
    wrapper.instance().validateSubjectArea(invalidSubjectArea)
    expect(wrapper.instance().state.validation).toEqual({
      'subjectAreaFail': 'buc:validation-chooseSubjectArea'
    })
  })

  it('validateSubjectArea() with valid subjectArea', () => {
    let validSubjectArea = 'Pensjon'
    wrapper.instance().validateSubjectArea(validSubjectArea)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('validateBuc() with invalid buc', () => {
    let invalidBuc = ''
    wrapper.instance().validateBuc(invalidBuc)
    expect(wrapper.instance().state.validation).toEqual({
      'bucFail': 'buc:validation-chooseBuc'
    })
  })

  it('validateBuc() with valid buc', () => {
    let validBuc = 'P_BUC_01'
    wrapper.instance().validateBuc(validBuc)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('validateSed() with invalid sed', () => {
    let invalidSed = ''
    wrapper.instance().validateSed(invalidSed)
    expect(wrapper.instance().state.validation).toEqual({
      'sedFail': 'buc:validation-chooseSed'
    })
  })

  it('validateSed() with valid sed', () => {
    let validSed = 'P2000'
    wrapper.instance().validateSed(validSed)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('validateInstitutions() with invalid institutions', () => {
    let invalidInstitutions = []
    wrapper.instance().validateInstitutions(invalidInstitutions)
    expect(wrapper.instance().state.validation).toEqual({
      'institutionsFail': 'buc:validation-chooseInstitutions'
    })
  })

  it('validateInstitutions() with valid institutions', () => {
    let validInstitutions = ['NAVT003']
    wrapper.instance().validateInstitutions(validInstitutions)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('validateInstitution() with invalid institution', () => {
    let invalidInstitution = ''
    wrapper.instance().validateInstitution(invalidInstitution)
    expect(wrapper.instance().state.validation).toEqual({
      'institutionFail': 'buc:validation-chooseInstitution'
    })
  })

  it('validateInstitution() with valid institution', () => {
    let validInstitution = 'NAVT003'
    wrapper.instance().validateInstitution(validInstitution)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('validateCountry() with invalid country', () => {
    let invalidCountry = ''
    wrapper.instance().validateCountry(invalidCountry)
    expect(wrapper.instance().state.validation).toEqual({
      'countryFail': 'buc:validation-chooseCountry'
    })
  })

  it('validateCountry() with valid institution', () => {
    let validCountry = 'NO'
    wrapper.instance().validateCountry(validCountry)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('onCreateInstitutionButtonClick()', () => {
    expect(wrapper.instance().state._institutions).toEqual([])
    wrapper.instance().setState({
      _institution: 'abc',
      _country: 'AA'
    })
    wrapper.instance().onCreateInstitutionButtonClick()
    expect(wrapper.instance().state._institutions).toEqual([{ institution: 'abc', country: 'AA' }])

    wrapper.instance().setState({
      _institution: 'def',
      _country: 'BB'
    })
    wrapper.instance().onCreateInstitutionButtonClick()
    expect(wrapper.instance().state._institutions).toEqual([{ institution: 'abc', country: 'AA' }, { institution: 'def', country: 'BB' }])
  })

  it('onRemoveInstitutionButtonClick()', () => {
    expect(wrapper.instance().state._institutions).toEqual([])
    wrapper.instance().setState({
      _institutions: [{ institution: 'abc', country: 'AA' }]
    })

    let institution = { institution: 'abc', country: 'AA' }
    wrapper.instance().onRemoveInstitutionButtonClick(institution)
    expect(wrapper.instance().state._institutions).toEqual([])

    wrapper.instance().onRemoveInstitutionButtonClick(institution)
    expect(wrapper.instance().state._institutions).toEqual([])
  })

  it('resetValidationState()', () => {
    expect(wrapper.instance().state.validation).toEqual({})
    wrapper.instance().setState({
      validation: { foo: 'bar', foo2: 'bar2' }
    })
    wrapper.instance().resetValidationState('foo')
    expect(wrapper.instance().state.validation).toEqual({ foo2: 'bar2' })
  })

  it('hasNoValidationErrors()', () => {
    expect(wrapper.instance().state.validation).toEqual({})
    expect(wrapper.instance().hasNoValidationErrors()).toEqual(true)
    wrapper.instance().setState({
      validation: { foo: 'bar' }
    })
    expect(wrapper.instance().hasNoValidationErrors()).toEqual(false)
  })

  it('setValidationState()', () => {
    expect(wrapper.instance().state.validation).toEqual({})
    wrapper.instance().setValidationState('mockKey', 'mockValue')
    expect(wrapper.instance().state.validation).toEqual({ mockKey: 'mockValue' })
  })

  it('onSubjectAreaChange()', () => {
    let mockSubjectArea = 'mockSubjectArea'
    let mockEvent = { target: { value: mockSubjectArea } }
    wrapper.instance().onSubjectAreaChange(mockEvent)
    expect(wrapper.instance().state._subjectArea).toEqual(mockSubjectArea)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('onBucChange()', () => {
    let mockBuc = 'MockBuc'
    let mockEvent = { target: { value: mockBuc } }
    wrapper.instance().onBucChange(mockEvent)
    expect(wrapper.instance().state._buc).toEqual(mockBuc)
    expect(wrapper.instance().state.validation).toEqual({})
    expect(store.getState().case.sedList).toEqual(['mockSedForMockBuc1', 'mockSedForMockBuc2'])
  })

  it('onSedChange()', () => {
    let mockSed = 'MockSed'
    let mockEvent = { target: { value: mockSed } }
    wrapper.instance().onSedChange(mockEvent)
    expect(wrapper.instance().state._sed).toEqual(mockSed)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('onInstitutionChange()', () => {
    let mockInstitution = 'MockInstitution'
    let mockEvent = { target: { value: mockInstitution } }
    wrapper.instance().onInstitutionChange(mockEvent)
    expect(wrapper.instance().state._institution).toEqual(mockInstitution)
    expect(wrapper.instance().state.validation).toEqual({})
  })

  it('onCountryChange()', () => {
    let mockCountry = 'MockCountry'
    let mockEvent = { value: mockCountry }
    wrapper.instance().onCountryChange(mockEvent)
    expect(wrapper.instance().state._country).toEqual(mockCountry)
    expect(wrapper.instance().state._institution).toEqual(undefined)
    expect(store.getState().case.institutionList).toEqual(['mockInstitutionForMockCountry1', 'mockInstitutionForMockCountry2'])
  })

  it('renderOptions()', () => {
    let mockMap = [
      { key: 'NO', value: 'Norge' },
      { key: 'SE', value: 'Sverige' },
      { key: 'DK', value: 'Danmark' },
      { key: 'FI', value: 'Finland' },
      { key: 'IS', value: 'Island' }
    ]
    let mockType = 'country'

    let result = wrapper.instance().renderOptions(mockMap, mockType)
    expect(result.length).toEqual(mockMap.length) // note: it is 6, not 5
    let html = result.map(res => { return mount(res).html() })
    expect(html).toEqual([ '<option value="buc:form-chooseCountry">buc:form-chooseCountry - buc:case-case.form-chooseCountry</option>',
      '<option value="NO">Norge - buc:case-Norge</option>',
      '<option value="SE">Sverige - buc:case-Sverige</option>',
      '<option value="DK">Danmark - buc:case-Danmark</option>',
      '<option value="FI">Finland - buc:case-Finland</option>',
      '<option value="IS">Island - buc:case-Island</option>' ])
  })

  it('getOptionLabel()', () => {
    let mockValue = 'mockValue'
    let label = wrapper.instance().getOptionLabel(mockValue)
    expect(label).toEqual('mockValue - buc:case-mockValue')
  })

  it('renderSubjectArea', () => {
    let mockSubjectAreaList = ['mockSubjectArea1', 'mockSubjectArea2']
    wrapper.setProps({
      subjectAreaList: mockSubjectAreaList
    })
    let result = mount(wrapper.instance().renderSubjectArea())
    expect(result.find('div.subjectAreaList').length).toEqual(1)
    expect(result.find('select.skjemaelement__input').length).toEqual(1)
    expect(result.find('select option').length).toEqual(mockSubjectAreaList.length)
    expect(result.find('select option').map(it => { return it.text() })).toEqual([
      'buc:form-chooseSubjectArea - buc:case-case.form-chooseSubjectArea',
      'mockSubjectArea1 - buc:case-mockSubjectArea1',
      'mockSubjectArea2 - buc:case-mockSubjectArea2'
    ])
  })

  it('renderCountry', async (done) => {
    let mockCountryList = ['NO', 'SE']
    wrapper.setProps({
      countryList: mockCountryList
    })
    let result = mount(wrapper.instance().renderCountry())
    expect(result.find('div.c-ui-countrySelect').length).toEqual(1)
    result.find('Select').simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })

    await new Promise(resolve => {
      setTimeout(() => {
        expect(result.find('div.c-ui-countryOption').length).toEqual(2)
        expect(result.find('div.c-ui-countryOption').map(it => { return it.text() })).toEqual(['Norge', 'Sverige'])
        done()
      }, 500)
    })
  })

  it('renderInstitution', () => {
    let mockInstitutionList = ['mockInstitution1', 'mockInstitution2']
    wrapper.setProps({
      institutionList: mockInstitutionList
    })
    let result = mount(wrapper.instance().renderInstitution())
    expect(result.find('div.institutionList').length).toEqual(1)
    expect(result.find('select.skjemaelement__input').length).toEqual(1)
    expect(result.find('select option').length).toEqual(mockInstitutionList.length)
    expect(result.find('select option').map(it => { return it.text() })).toEqual([
      'buc:form-chooseInstitution - buc:case-case.form-chooseInstitution',
      'mockInstitution1 - buc:case-mockInstitution1',
      'mockInstitution2 - buc:case-mockInstitution2'
    ])
  })

  it('renderBuc', () => {
    let mockBucList = ['mockBuc1', 'mockBuc2']
    wrapper.setProps({
      bucList: mockBucList
    })
    let result = mount(wrapper.instance().renderBuc())
    expect(result.find('div.bucList').length).toEqual(1)
    expect(result.find('select.skjemaelement__input').length).toEqual(1)
    expect(result.find('select option').length).toEqual(mockBucList.length)
    expect(result.find('select option').map(it => { return it.text() })).toEqual([
      'buc:form-chooseBuc - buc:case-case.form-chooseBuc',
      'mockBuc1 - buc:case-mockBuc1',
      'mockBuc2 - buc:case-mockBuc2'
    ])
  })

  it('renderSed', () => {
    let mockSedList = ['mockSed1', 'mockSed2']
    wrapper.setProps({
      sedList: mockSedList
    })
    let result = mount(wrapper.instance().renderSed())
    expect(result.find('div.sedList').length).toEqual(1)
    expect(result.find('select.skjemaelement__input').length).toEqual(1)
    expect(result.find('select option').length).toEqual(mockSedList.length)
    expect(result.find('select option').map(it => { return it.text() })).toEqual([
      'buc:form-chooseSed - buc:case-case.form-chooseSed',
      'mockSed1 - buc:case-mockSed1',
      'mockSed2 - buc:case-mockSed2'
    ])
  })

  it('getSpinner', () => {
    let mockText = 'mockText'
    let result = mount(wrapper.instance().getSpinner(mockText))
    expect(result.find('div.p-case-spinner').length).toEqual(1)
    expect(result.find('div.p-case-spinner').text()).toEqual('Venter...' + mockText)
  })

  it('renderChosenInstitution', () => {
    let mockInstitution = { institution: 'mockInstitution', country: 'mockCountry' }
    let result = render(wrapper.instance().renderChosenInstitution(mockInstitution))
    expect(result.find('div.renderedInstitution').length).toEqual(1)
    expect(result.find('div.renderedInstitution').text()).toEqual('mockCountry/mockInstitution')
    expect(result.find('button.removeInstitutionButton').length).toEqual(1)
  })

  it('renderInstitutions()', () => {
    let mockInstitutions = [
      { institution: 'mockInstitution1', country: 'mockCountry1' },
      { institution: 'mockInstitution2', country: 'mockCountry2' }
    ]
    wrapper.instance().setState({
      _institutions: mockInstitutions
    })
    let result = render(wrapper.instance().renderInstitutions())
    expect(result.find('div.renderedInstitutions').length).toEqual(mockInstitutions.length)
    expect(result.find('button.removeInstitutionButton').length).toEqual(mockInstitutions.length)
    expect(result.find('button.createInstitutionButton').length).toEqual(1)
  })

  it('allowedToForward() with a predefined sed and buc', () => {
    wrapper.setProps({
      sed: 'mockSed',
      buc: 'mockBuc'
    })
    expect(wrapper.instance().allowedToForward()).toEqual(false)
    wrapper.instance().setState({
      _institutions: [{ institution: 'mockInstitution', country: 'mockCountry' }]
    })
    expect(wrapper.instance().allowedToForward()).toEqual(true)
  })

  it('allowedToForward() with unknown sed and buc', () => {
    wrapper.instance().setState({
      _subjectArea: 'mockSubjectArea',
      _sed: 'mockSed',
      _buc: 'mockBuc',
      _institutions: [{ institution: 'mockInstitution', country: 'mockCountry' }],
      validation: { foo: 'bar' }
    })
    expect(wrapper.instance().allowedToForward()).toEqual(false)
    wrapper.instance().setState({
      validation: {}
    })
    expect(wrapper.instance().allowedToForward()).toEqual(true)
  })
})
