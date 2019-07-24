import React from 'react'
import LanguageSelector from './LanguageSelector'

import * as reducers from '../../reducers'

const reducer = combineReducers({
  ...reducers
})

describe('Render LanguageSelector', () => {
  it('Renders without crashing', () => {
    let store = createStore(reducer, {})

    let wrapper = shallow(
      <LanguageSelector />,
      { context: { store } }
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
  })
})
