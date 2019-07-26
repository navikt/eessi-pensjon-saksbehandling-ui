import React from 'react'
import FlagList from './FlagList'

describe('components/Flag/FlagList', () => {
  const initialMockProps = {
    items: [{
      country: 'NO'
    }, {
      country: 'SE'
    }, {
      country: 'DK'
    }],
    overflowLimit: 2,
    locale: 'nb'
  }

  it('Renders', () => {
    let wrapper = mount(<FlagList {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Displays correct number of flags', () => {
    let wrapper = mount(<FlagList {...initialMockProps} />)
    expect(wrapper.find('Flag').length).toEqual(2)
    expect(wrapper.exists('Normaltekst')).toBeTruthy()
    expect(wrapper.find('Normaltekst').render().text()).toEqual('+1')

    wrapper.setProps({ overflowLimit: 3 })
    expect(wrapper.find('Flag').length).toEqual(3)
    expect(wrapper.exists('Normaltekst')).toBeFalsy()
  })

  it('Assigns props to Flag', () => {
    let wrapper = mount(<FlagList {...initialMockProps} />)
    wrapper.find('Flag').forEach((flag, index) => {
      expect(flag.props().country).toEqual(initialMockProps.items[index].country)
    })
  })
})
