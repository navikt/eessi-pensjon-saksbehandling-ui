import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import InstitutionList, { InstitutionListProps } from './InstitutionList'

// InstitutionNames
const mockSelectors = {
  'NO:Mock1': 'Mock 1 institution',
  'NO:Mock2': 'Mock 2 institution'
}

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => mockSelectors)
}))

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: InstitutionListProps = {
    institutions: [{
      country: 'NO',
      institution: 'Mock1'
    }, {
      country: 'NO',
      institution: 'Mock2'
    }],
    locale: 'nb'
  }

  beforeEach(() => {
    wrapper = mount(<InstitutionList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure with joined type', () => {
    expect(wrapper.find('.a-buc-c-institutionlist__institution')).toHaveLength(1)
    expect(wrapper.find('.a-buc-c-institutionlist__institution').hostNodes().render().text()).toEqual('Mock1, Mock2')
  })

  it('Has proper HTML structure with separated type', () => {
    wrapper = mount(<InstitutionList {...initialMockProps} type='separated' />)
    expect(wrapper.find('.a-buc-c-institutionlist__institution').hostNodes()).toHaveLength(2)
    expect(wrapper.find('.a-buc-c-institutionlist__institution:first-child').hostNodes().render().text()).toEqual('Mock1')
    expect(wrapper.find('.a-buc-c-institutionlist__institution:last-child').hostNodes().render().text()).toEqual('Mock2')
  })
})
