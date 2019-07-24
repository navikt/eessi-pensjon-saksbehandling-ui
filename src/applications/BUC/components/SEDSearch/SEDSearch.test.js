import React from 'react'
import SEDSearch from './SEDSearch'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDSearch/SEDSearch', () => {
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    onSearch: jest.fn(),
    onCountrySearch: jest.fn(),
    onStatusSearch: jest.fn(),
    locale: 'nb',
    seds: sampleBucs[0].seds,
    t: t
  }
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SEDSearch {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedsearch')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedsearch__query-input-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedsearch__status-select-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedsearch__country-select-id')).toBeTruthy()
  })

  it('Handles query', () => {
    wrapper.find('#a-buc-c-sedsearch__query-input-id').hostNodes().simulate('change', { target: { value: 'mockSearch' } })
    expect(initialMockProps.onSearch).toBeCalledWith('mockSearch')
  })

  it('Handles search by status', () => {
    let statusSelect = wrapper.find('#a-buc-c-sedsearch__status-select-id input').hostNodes()
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onStatusSearch).toBeCalledWith([{ 'label': 'ui:new', 'value': 'new' }])
  })

  it('Handles search by country', () => {
    let countrySelect = wrapper.find('#a-buc-c-sedsearch__country-select-id input').hostNodes()
    countrySelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    countrySelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onCountrySearch).toBeCalledWith([{ label: 'Norge', value: 'NO' }])
  })
})
