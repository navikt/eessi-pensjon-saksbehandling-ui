import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import PInfo from './PInfo'
import * as reducers from '../../reducers'

const initialState = {
  app: {
    username: '12345678910'
  }
}

const reducer = combineReducers({
  ...reducers
})

describe('PInfo', () => {

  let store, wrapper

  beforeEach(async () => {
    store = createStore(reducer, initialState)
    wrapper = await shallow(<PInfo store={store}/>).dive()
  })

  it('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
