import React from 'react'
import { store, connect, bindActionCreators } from 'store'
import * as reducers from '../../reducers'

import { PreviewCase, mapStateToProps, mapDispatchToProps } from './PreviewCase'

const t = jest.fn((translationString) => { return translationString })

jest.mock('../../actions/api', () => ({
  call: jest.fn((options) => ({
    type: options.type.success,
    payload: { foo: 'bar' }
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

const initialState = {
  case: {
    step: 50,
    previewData: {}
  }
}

const reducer = combineReducers({
  ...reducers
})

describe('PreviewCase', () => {
  let store, wrapper, ConnectedPreviewCase

  beforeEach(() => {
    store = createStore(reducer, initialState)
    ConnectedPreviewCase = connect(mapStateToProps, mapDispatchToProps)(PreviewCase)
    wrapper = shallow(<ConnectedPreviewCase t={t} store={store} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('onBackButtonClick(), back button reduces one step', () => {
    let currentStep = wrapper.instance().props.step
    wrapper.instance().onBackButtonClick()
    expect(store.getState().case.step).toEqual(currentStep - 1)
  })

  it('onPreviewButtonClick(), fetches more data', () => {
    wrapper.instance().onPreviewButtonClick()
    expect(store.getState().case.previewData).toEqual({ foo: 'bar' })
  })

  it('onForwardButtonClick(), sends data', () => {
    wrapper.instance().onForwardButtonClick()
    expect(store.getState().case.savedData).toEqual({ foo: 'bar' })
  })
})
