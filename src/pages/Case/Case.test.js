import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'

import { Case } from './Case'

const t = jest.fn((translationString) => { return translationString })

describe('Case', () => {
  let store, wrapper, ConnectedCase

  beforeEach(() => {
    store = createStore(state => state)
    ConnectedCase = connect(null, null)(Case)
    wrapper = shallow(<ConnectedCase
      t={t} store={store} step={0}
      title='mockTitle' history={{}} location={{}}>
       <div/>
    </ConnectedCase>).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
