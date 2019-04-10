import React from 'react'

import ConnectedFooter, { Footer } from './Footer'

import { createStore, combineReducers } from 'redux'
import * as reducers from '../../../reducers'

const reducer = combineReducers({
  ...reducers
})

describe('Render File', () => {
  it('Render without crashing', () => {
    let wrapper = shallow(<Footer />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
  })

  it('Toggles open/closed with props', () => {
    let wrapper = shallow(<Footer />)

    expect(wrapper.exists('div.footerButtonClosed'))

    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('div.footerButtonOpen'))
  })

  it('Calls OnClick', () => {
    let store = createStore(reducer, {})

    let wrapper = shallow(
      <ConnectedFooter />,
      { context: { store } }
    )
    expect(store.getState().ui.footerOpen).toEqual(undefined)
    wrapper.dive().find('div.footerButtonClosed').simulate('click')
    expect(store.getState().ui.footerOpen).toEqual(true)
  })
})
