import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import MultipleOption, { MultipleOptionProps } from './MultipleOption'

describe('components/MultipleSelect/MultipleOption', () => {
  let wrapper: ReactWrapper
  const initialMockProps: MultipleOptionProps = {
    clearValue: jest.fn(),
    getValue: jest.fn(),
    setValue: jest.fn(),
    hasValue: false,
    selectOption: jest.fn(),
    options: [],
    isMulti: true,
    cx: jest.fn(),
    children: undefined,
    label: '',
    type: 'option',
    innerRef: null,
    data: {
      label: 'mockLabel',
      value: 'mockValue'
    },
    getStyles: jest.fn(),
    selectProps: { selectProps: {} },
    innerProps: {
      onClick: jest.fn()
    } as any,
    isSelected: false,
    isFocused: false,
    isDisabled: false
  }

  beforeEach(() => {
    wrapper = mount(<MultipleOption {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-multipleOption__checkbox')).toBeTruthy()
  })

  it('Triggers innerProps.onClick', () => {
    wrapper.find('.c-multipleOption').simulate('click')
    expect(initialMockProps.innerProps.onClick).toHaveBeenCalled()
  })

  it('Checkbox change triggers innerProps.onClick', () => {
    wrapper.find('Checkbox input').simulate('change')
    expect(initialMockProps.innerProps.onClick).toHaveBeenCalled()
  })
})
