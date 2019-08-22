import React from 'react'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'

describe('store', () => {
  it('renders', () => {
    const wrapper = shallow(
      <StoreProvider initialState={initialState} reducer={reducer}>
        <div />
      </StoreProvider>)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })
})
