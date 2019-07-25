import React from 'react'
import CountryOption from './CountryOption'
import CountryData from '../CountryData/CountryData'

describe('CountryOption Rendering', () => {

  let countryData = CountryData.getData('nb')
  let countrySelectProps = { selectProps: { type: 'country' } }
  let currencySelectProps = { selectProps: { type: 'currency' } }
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <CountryOption
        value=''
        label=''
        selectProps={{ selectProps: {} }}
        data={{}}
        innerProps={{}}
        isSelected={false}
        isFocused={false}
      />
    )
  })

  it('Renders correctly', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    for (let data of countryData) {
      wrapper.setProps({ label: data.label, selectProps: countrySelectProps, data: data })
      expect(wrapper.find('span').text()).toEqual(data.label)

      wrapper.setProps({ selectProps: currencySelectProps })
      expect(wrapper.find('span').text()).toEqual((data.currency ? data.currency + ' - ' : '') + data.currencyLabel)
    }
  })
})


