import React from 'react'
import InstitutionList from './InstitutionList'

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  let wrapper
  const initialMockProps = {
    institutions: [{
      country: 'XX',
      institution: 'Mock1',
      id: 'XX:Mock1'
    }, {
      country: 'XX',
      institution: 'Mock2',
      id: 'XX:Mock2'
    }],
    institutionNames: {
      'XX:Mock1': 'Mock 1 institution',
      'XX:Mock2': 'Mock 2 institution'
    },
    locale: 'nb',
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<InstitutionList {...initialMockProps} type='joined' />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure with joined type', () => {
    expect(wrapper.find('.a-buc-c-institution').hostNodes()).toHaveLength(1)
    expect(wrapper.find('.a-buc-c-institution').hostNodes().render().text()).toEqual('Demoland: Mock 1 institution, Mock 2 institution')
  })

  it('Has proper HTML structure with separated type', () => {
    wrapper = mount(<InstitutionList {...initialMockProps} type='separated' />)
    expect(wrapper.find('.a-buc-c-institution').hostNodes()).toHaveLength(2)
    expect(wrapper.find('.a-buc-c-institution:first-child').hostNodes().render().text()).toEqual('Demoland: Mock 1 institution')
    expect(wrapper.find('.a-buc-c-institution:last-child').hostNodes().render().text()).toEqual('Demoland: Mock 2 institution')
  })
})
