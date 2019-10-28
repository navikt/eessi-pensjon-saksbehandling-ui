import React from 'react'
import SEDSearch from './SEDSearch'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDSearch/SEDSearch', () => {
  let wrapper
  const initialMockProps = {
    onSearch: jest.fn(),
    onStatusSearch: jest.fn(),
    locale: 'nb',
    seds: sampleBucs[0].seds,
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<SEDSearch {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedsearch')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedsearch__query-input-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedsearch__status-select-id')).toBeTruthy()
  })

  it('Handles query', () => {
    wrapper.find('#a-buc-c-sedsearch__query-input-id').hostNodes().simulate('change', { target: { value: 'mockSearch' } })
    expect(initialMockProps.onSearch).toBeCalledWith('mockSearch')
  })

  it('Handles search by status', () => {
    const statusSelect = wrapper.find('#a-buc-c-sedsearch__status-select-id input').hostNodes()
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onStatusSearch).toBeCalledWith([{ label: 'ui:cancelled', value: 'cancelled' }])
  })
})
