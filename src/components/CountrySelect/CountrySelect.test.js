import React from 'react'
import CountrySelect from './CountrySelect'
import { EEA } from './CountryFilter'

const testData = {
  value: 'NO',
  value3: 'NOR',
  label: 'Norge',
  currency: 'NOK',
  currencyLabel: 'Norsk Krone'
}

describe('components/CountrySelect', () => {
  let wrapper
  const initialMockParams = {
    id: 'react-select-test',
    classNamePrefix: 'test',
    locale: 'nb',
    includeList: EEA,
    value: testData,
    onSelect: jest.fn(),
    error: undefined,
    errorMessage: undefined
  }

  it('Renders', () => {
    wrapper = mount(<CountrySelect {...initialMockParams} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Opens and closes', () => {
    wrapper = mount(<CountrySelect {...initialMockParams} />)
    expect(wrapper.find('.c-countryOption').length).toEqual(0)

    wrapper.find('.c-countrySelect__select__dropdown-indicator').hostNodes().simulate('mouseDown', { button: 0 })
    expect(wrapper.find('.c-countryOption').length).toEqual(EEA.length)

    wrapper.find('.c-countrySelect__select__dropdown-indicator').hostNodes().simulate('mouseDown', { button: 0 })
    expect(wrapper.find('.c-countryOption').length).toEqual(0)

    wrapper.find('.c-countrySelect__select__control').hostNodes().simulate('keyDown', { key: 'ArrowDown' })
    expect(wrapper.find('.c-countryOption').length).toEqual(EEA.length)

    wrapper.find('.c-countrySelect__select__control').hostNodes().simulate('keyDown', { key: 'Escape' })
    expect(wrapper.find('.c-countryOption').length).toEqual(0)
  })

  it('Returns value when selected', () => {
    wrapper = mount(<CountrySelect {...initialMockParams} />)
    wrapper.find('.c-countrySelect__select__dropdown-indicator').hostNodes().simulate('keyDown', { key: 'ArrowDown' })
    wrapper.find('.c-countryOption').hostNodes().last().simulate('keyDown', { key: 'Enter' })
    expect(initialMockParams.onSelect).toBeCalledWith(testData, {
      action: 'select-option',
      name: undefined,
      option: undefined
    })
  })
})
