import React from 'react'
import CountryOption from './CountryOption'
import CountryData from '../CountryData/CountryData'

describe('CountryOption Rendering', () => {
  it('Renders correctly', () => {
    let countryData = CountryData.getData('nb')
    let countrySelectProps = { selectProps: { type: 'country' } }
    let currencySelectProps = { selectProps: { type: 'currency' } }

    let wrapper = shallow(
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
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toBeFalsy()

    for (let data of countryData) {
      wrapper.setProps({ label: data.label, selectProps: countrySelectProps, data: data })

      expect(wrapper.isEmptyRender()).toBeFalsy()
      expect(wrapper.find('span').text()).toEqual(data.label)

      wrapper.setProps({ selectProps: currencySelectProps })

      expect(wrapper.find('span').text()).toEqual((data.currency ? data.currency + ' - ' : '') + data.currencyLabel)
    }
  })
})
