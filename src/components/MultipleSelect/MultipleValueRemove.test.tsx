import { mount, ReactWrapper } from 'enzyme'
import { theme } from 'nav-styled-component-theme'
import React from 'react'
import MultipleValueRemove from './MultipleValueRemove'

describe('components/MultipleSelect/MultipleValueRemove', () => {
  let wrapper: ReactWrapper
  const initialMockProps = {
    selectProps: {
      selectProps: {
        theme: theme
      }
    }
  }

  beforeEach(() => {
    // @ts-ignore
    wrapper = mount(<MultipleValueRemove {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find('[data-test-id=\'c-multipleselect-multiplevalueremove\']')).toBeTruthy()
  })
})
