import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'

describe('components/MultipleSelect/MultipleValueLabel', () => {
  let wrapper: ReactWrapper
  const initialMockProps = {
    data: {
      label: 'mockLabel'
    }
  }

  beforeEach(() => {
    // @ts-ignore
    wrapper = mount(<MultipleValueLabel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find('[data-test-id=\'c-multipleselect-multivaluelabel\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'c-multipleselect-multivaluelabel\']').render().text().trim()).toEqual(
      initialMockProps.data.label
    )
  })
})
