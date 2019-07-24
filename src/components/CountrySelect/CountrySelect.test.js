import React from 'react'
import CountrySelect from './CountrySelect'
import { EEA } from './CountryFilter'

const testData = {
  'value': 'NO',
  'label': 'Norway',
  'currency': 'NOK',
  'currencyLabel': 'Norwegian Kroner'
}

describe('CountrySelect Rendering', () => {
  it('Renders correctly', () => {
    let wrapper = shallow(<CountrySelect
      id='react-select-test'
      classNamePrefix='test'
      locale='nb'
      includeList={EEA}
      value={testData}
      onSelect={() => {}}
      error={undefined}
      errorMessage={undefined}
    />)

    expect(wrapper).toMatchSnapshot()
  })
})

describe('Countryselect Behaviour', () => {
  it('Opens and closes', () => {
    let wrapper = mount(<CountrySelect
      id='react-select-test'
      locale='nb'
      includeList={EEA}
      value={testData}
      onSelect={() => {}}
      error={undefined}
      errorMessage={undefined}
    />)

    expect(wrapper.find('.c-countryOption').length).toEqual(0)
    wrapper.find('.CountrySelect__dropdown-indicator').simulate('mouseDown', { button: 0 })

    expect(wrapper.find('.c-countryOption').length).toEqual(EEA.length)

    wrapper.find('.CountrySelect__dropdown-indicator').simulate('mouseDown', { button: 0 })

    expect(wrapper.find('.c-countryOption').length).toEqual(0)

    wrapper.find('.CountrySelect__control').simulate('keyDown', { key: 'ArrowDown' })

    expect(wrapper.find('.c-countryOption').length).toEqual(EEA.length)

    wrapper.find('.CountrySelect__control').simulate('keyDown', { key: 'Escape' })

    expect(wrapper.find('.c-countryOption').length).toEqual(0)

    wrapper.unmount()
  })

  it('Returns value when selected', (done) => {
    const testOnSelect = (value) => {
      expect(value.label).toEqual(wrapper.find('.c-countryOption').last().text())
      expect(value).not.toEqual('something')
      done()
    }
    let wrapper = mount(<CountrySelect
      id='react-select-test'
      locale='nb'
      includeList={EEA}
      value={testData}
      onSelect={testOnSelect}
      error={undefined}
      errorMessage={undefined}
    />)
    wrapper.find('.CountrySelect__dropdown-indicator').simulate('mouseDown', { button: 0 })
    wrapper.find('.c-countryOption').last().simulate('click')
  })
})
