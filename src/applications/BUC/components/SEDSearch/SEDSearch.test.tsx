import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import SEDSearch, { SEDSearchProps } from './SEDSearch'

describe('applications/BUC/components/SEDSearch/SEDSearch', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDSearchProps = {
    highContrast: false,
    onSearch: jest.fn(),
    onStatusSearch: jest.fn(),
    value: undefined
  }

  beforeEach(() => {
    wrapper = mount(<SEDSearch {...initialMockProps} />)
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedsearch__panel-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedsearch__query-input-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedsearch__status-select-id\']')).toBeTruthy()
  })

  it('Handling: query change', () => {
    (initialMockProps.onSearch as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'a-buc-c-sedsearch__query-input-id\']').hostNodes().simulate('change', { target: { value: 'mockSearch' } })
    expect(initialMockProps.onSearch).toBeCalledWith('mockSearch')
  })

  it('Handling: status change', () => {
    (initialMockProps.onStatusSearch as jest.Mock).mockReset()
    const statusSelect = wrapper.find('[data-test-id=\'a-buc-c-sedsearch__status-select-id\'] input').hostNodes()
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onStatusSearch).toBeCalledWith([{ label: 'ui:cancelled', value: 'cancelled' }])
  })
})
