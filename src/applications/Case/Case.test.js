import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'

import { Case } from './Case'

const t = jest.fn((translationString) => { return translationString })

const mockHistory = {
  push: jest.fn()
}

const mockMatch = {
  params: {
    step: 99
  }
}

Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    origin: 'http://fake-url.nav.no/',
    pathname: '/_/case',
    search: '?sakId=123',
    href: 'http://fake-url.nav.no/_/case?sakId=123'
  }
})

describe('Case', () => {
  let store, wrapper, ConnectedCase

  beforeEach(() => {
    store = createStore(state => state)
    ConnectedCase = connect(null, null)(Case)
    wrapper = shallow(<ConnectedCase
      t={t} store={store} step={9}
      title='mockTitle' history={mockHistory} match={mockMatch} location={{}}>
      <div />
    </ConnectedCase>).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders and it changes URL to reflect the new step ', () => {
    wrapper.setProps({
      step: 90
    })
    expect(wrapper.instance().props.history.push).toBeCalledWith({
      pathname: '/_/case/91',
      search: '?sakId=123'
    })
  })
})
