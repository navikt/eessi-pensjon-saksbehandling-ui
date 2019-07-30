import React from 'react'
import MultipleOption from './MultipleOption'

describe('components/MultipleSelect/MultipleOption', () => {
  const initialMockProps = {
    data: {
      label: 'mockLabel',
      value: 'mockValue'
    },
    selectProps: { selectProps: {} },
    innerProps: {},
    isSelected: false,
    isFocused: false
  }

  it('Renders', () => {
    const wrapper = mount(<MultipleOption {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = shallow(<MultipleOption {...initialMockProps} />)
    expect(wrapper.find('.c-multipleOption__checkbox').props().label).toEqual(initialMockProps.data.label)
  })
})
