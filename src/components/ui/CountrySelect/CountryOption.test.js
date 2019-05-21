import React from 'react'
import CountryOption from './CountryOption'
import countries from './CountrySelectData'

describe('CountryOption Rendering', () => {
  it('Renders correctly', () => {
    let countryData = [...countries.en, ...countries.nb]
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
    expect(wrapper.isEmptyRender()).toEqual(false)

    for (let data of countryData) {
      wrapper.setProps({ label: data.label, selectProps: countrySelectProps, data: data })

      expect(wrapper.isEmptyRender()).toEqual(false)
      expect(wrapper.find('span').text()).toEqual(data.label)

      wrapper.setProps({ selectProps: currencySelectProps })

      expect(wrapper.find('span').text()).toEqual((data.currency ? data.currency + ' - ' : '') + data.currencyLabel)
    }
  })
})
