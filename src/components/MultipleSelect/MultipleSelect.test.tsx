import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import MultipleSelect, { MultipleSelectProps } from './MultipleSelect'

describe('components/MultipleSelect/MultipleSelect', () => {
  let wrapper: ReactWrapper
  const options = [
    { label: 'mockLabel01', value: 'mockValue01' },
    { label: 'mockLabel02', value: 'mockValue02' }
  ]
  const initialMockProps: MultipleSelectProps<any> = {
    id: 'mockMultipleSelectId',
    ariaLabel: 'mockAriaLabel',
    label: 'mockLabel',
    creatable: true,
    error: undefined,
    hideSelectedOptions: false,
    onSelect: jest.fn(),
    options: options,
    placeholder: 'mockPlaceholder',
    values: [options[1]]
  }

  beforeEach(() => {
    wrapper = mount(<MultipleSelect {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.find('c-multipleSelect')).toBeTruthy()
  })

  it('Triggers onSelect', () => {
    (initialMockProps.onSelect as jest.Mock).mockReset()
    wrapper.find('input').hostNodes().simulate('keyDown', { key: 'ArrowDown' })
    wrapper.find('input').hostNodes().first().simulate('keyDown', { key: 'Enter' })
    expect(initialMockProps.onSelect).toHaveBeenCalledWith([options[1], options[0]])
  })
})
