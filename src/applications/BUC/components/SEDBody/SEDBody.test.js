import React from 'react'
import SEDBody from './SEDBody'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDBody/SEDBody', () => {

  const t = jest.fn((translationString) => { return translationString })
  const buc = sampleBucs[0]
  const seds = buc.seds
  const initialMockProps = {
    t: t,
    seds: seds,
    rinaUrl: 'http://fakeurl.com/rina/',
    buc: buc,
    locale: 'nb'
  }
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SEDBody {...initialMockProps} />)
  })

  it('Renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render()', () => {
    expect(wrapper.find('SEDRow').length).toEqual(seds.filter(sed => sed.status !== 'empty').length)
    expect(wrapper.exists('.a-buc-c-sedbody__footer')).toEqual(true)
    const rinaLink = wrapper.find('#a-buc-c-sedbody__gotorina-link').hostNodes()
    expect(rinaLink.props().href).toEqual(initialMockProps.rinaUrl + initialMockProps.buc.caseId)
    expect(rinaLink.props().target).toEqual('rinaWindow')
  })
})
