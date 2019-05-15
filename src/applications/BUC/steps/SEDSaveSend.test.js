import React from 'react'
import { store, connect, bindActionCreators } from 'store'
import * as reducers from '../../reducers'

import { SaveSendCase, mapStateToProps } from './SaveSendCase'

import * as statusActions from '../../actions/status'
import * as appActions from '../../actions/app'
import * as bucActions from '../../actions/buc'

const t = jest.fn((translationString) => { return translationString })

jest.mock('../../actions/api', () => ({
  call: jest.fn((options) => ({
    type: options.type.success,
    payload: { foo: 'bar' }
  }))
}))

// mock actions that will be connected to the component
jest.mock('../../actions/case', () => ({
  ...jest.requireActual('../../actions/case'),
  getRinaUrl: jest.fn(() => ({
    type: 'RINA/GET_URL/SUCCESS',
    payload: { rinaUrl: 'http://mock-url.nav.no/rinaUrl' }
  })),
  sendSed: jest.fn(() => ({
    type: 'CASE/SEND_SED/SUCCESS'
  }))
}))

const initialState = {
  case: {
    step: 2,
    savedData: {
      foo: 'bar'
    }
  },
  status: {
    sakId: '123',
    aktoerId: '456',
    rinaId: '789'
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, statusActions, bucActions, appActions), dispatch) }
}

const reducer = combineReducers({
  ...reducers
})

describe('PreviewCase', () => {
  let store, wrapper, ConnectedSaveSendCase

  beforeEach(() => {
    store = createStore(reducer, initialState)
    ConnectedSaveSendCase = connect(mapStateToProps, mapDispatchToProps)(SaveSendCase)
    wrapper = shallow(<ConnectedSaveSendCase t={t} store={store} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('fetches RinaUrl on componentDidMount', () => {
    expect(store.getState().case.rinaUrl).toEqual('http://mock-url.nav.no/rinaUrl')
  })

  it('onSendButtonClick(), back button reduces one step', () => {
    wrapper.instance().onSendButtonClick()
    expect(store.getState().alert).toEqual({
      clientErrorStatus: 'OK',
      clientErrorMessage: 'buc:alert-sentData'
    })
  })

  it('onCreateNewUnsetRinaIdButtonClick()', () => {
    expect(store.getState().status).toEqual({
      sakId: '123',
      aktoerId: '456',
      rinaId: '789'
    })
    expect(store.getState().case.savedData).toEqual({
      foo: 'bar'
    })
    wrapper.instance().onCreateNewUnsetRinaIdButtonClick()
    expect(store.getState().status).toEqual({
      sakId: '123',
      aktoerId: '456'
    })
    expect(store.getState().case.savedData).toEqual(undefined)
  })

  it('onCreateNewUnsetSakIdAktoerIdButtonClick()', () => {
    expect(store.getState().status).toEqual({
      sakId: '123',
      aktoerId: '456',
      rinaId: '789'
    })
    expect(store.getState().case.savedData).toEqual({
      foo: 'bar'
    })
    wrapper.instance().onCreateNewUnsetSakIdAktoerIdButtonClick()
    expect(store.getState().status).toEqual({
      rinaId: '789'
    })
    expect(store.getState().case.savedData).toEqual(undefined)
  })
})
