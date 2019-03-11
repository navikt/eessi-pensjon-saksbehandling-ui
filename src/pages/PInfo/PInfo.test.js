import React from 'react'
import { createStore, combineReducers } from 'redux'
import PInfo from './PInfo'
import * as reducers from '../../reducers'
import { connect } from 'react-redux'

const t = jest.fn((translationString) => { return translationString })

const initialState = {
  app: {
    username: '12345678910'
  }
}

const reducer = combineReducers({
  ...reducers
})

describe('PInfo', () => {
  let store, wrapper, ConnectedPInfo

  beforeEach(() => {
    store = createStore(reducer, initialState)
    ConnectedPInfo = connect(null, null)(PInfo)
    wrapper = shallow(<ConnectedPInfo t={t} store={store} />).dive()
  })

  it('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
