import React from 'react'
import SEDBody from './SEDBody'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper
  const initialMockProps = {
    buc: sampleBucs[0],
    locale: 'nb',
    onSEDNew: jest.fn(),
    rinaUrl: 'http://fakeurl.com/rina/',
    seds: sampleBucs[0].seds,
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<SEDBody {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.find('SEDRow').length).toEqual(
      initialMockProps.seds.filter(sed => sed.status !== 'empty').length
    )
    expect(wrapper.exists('.a-buc-c-sedbody__footer')).toBeTruthy()
    const rinaLink = wrapper.find('#a-buc-c-sedbody__gotorina-link').hostNodes()
    expect(rinaLink.props().href).toEqual(initialMockProps.rinaUrl + initialMockProps.buc.caseId)
    expect(rinaLink.props().target).toEqual('rinaWindow')
  })

  it('With no seds', () => {
    wrapper = mount(<SEDBody {...initialMockProps} seds={null} />)
    expect(wrapper.find('SEDRow').length).toEqual(0)
  })
})
