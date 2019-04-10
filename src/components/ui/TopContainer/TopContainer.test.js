import React from 'react'

import TopContainer from './TopContainer'

import { createStore, combineReducers } from 'redux'
import * as reducers from '../../../reducers'

import * as constants from '../../../constants/constants'

const reducer = combineReducers({
  ...reducers
})

describe('renders', () => {
  let store = createStore(reducer, {})

  it('renders without crashing', () => {
    let wrapper = shallow(
      <TopContainer history={{}} userRole={constants.SAKSBEHANDLER}>
        <div id='TEST_CHILD' />
      </TopContainer>,
      { context: { store } }
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.exists('#TEST_CHILD')).toEqual(true)
    expect(wrapper.dive().exists({ header: 'TEST_HEADER' })).toEqual(false)

    wrapper.setProps({ header: 'TEST_HEADER' })
    expect(wrapper.dive().exists({ header: 'TEST_HEADER' })).toEqual(true)
  })
})
