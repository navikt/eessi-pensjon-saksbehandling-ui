import React from 'react'
import { StoreProvider, connect, bindActionCreators } from 'store'
import reducer, { initialState } from 'reducer'

describe('store', () => {
  it('renders', () => {
    let wrapper = shallow(<StoreProvider initialState={initialState} reducer={reducer}>
      <div/>
    </StoreProvider>)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })
})
