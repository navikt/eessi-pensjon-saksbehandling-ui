import React from 'react'
import CountryValue from './CountryValue'

describe('components/CountrySelect/CountryValue', () => {
  const initialMockProps = {
    selectProps: { selectProps: { type: 'country' } },
    data: {
      value: 'NO',
      value3: 'NOR',
      label: 'Norway',
      currency: 'NOK',
      currencyLabel: 'Norsk Krone'
    }
  }

  it('Renders', () => {
    const wrapper = mount(<CountryValue {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure: country select', () => {
    const wrapper = mount(<CountryValue {...initialMockProps} />)
    expect(wrapper.children().hostNodes().length).toEqual(1)
    expect(wrapper.render().text()).toEqual('Norway')
  })

  it('Has proper HTML structure: currency select', () => {
    const wrapper = mount(<CountryValue {...initialMockProps} selectProps={{ selectProps: { type: 'currency' } }} />)
    expect(wrapper.children().hostNodes().length).toEqual(1)
    expect(wrapper.render().text()).toEqual('NOK - Norsk Krone')
  })
})
