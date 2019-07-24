import React from 'react'
import { BUCWidgetIndex } from 'applications/BUC/widgets/'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/widgets/index', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {},
    aktoerId: '123',
    bucs: sampleBucs,
    buc: sampleBucs[0],
    loading: {},
    rinaUrl: 'http://mockUrl/rina',
    sakId: '456',
    t: t
  }

  it('Renders', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure ', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.exists('.a-buc-widget')).toBeTruthy()
    expect(wrapper.exists('.a-buc-widget__header')).toBeTruthy()
    expect(wrapper.exists('BUCCrumbs')).toBeTruthy()
    expect(wrapper.exists('BUCWebSocket')).toBeTruthy()
  })

  it('Has proper HTML structure in buclist mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.exists('BUCList')).toBeTruthy()
  })

  it('Has proper HTML structure in bucedit mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='bucedit' />)
    expect(wrapper.exists('BUCEdit')).toBeTruthy()
  })

  it('Has proper HTML structure in bucnew mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='bucnew' />)
    expect(wrapper.exists('BUCNew')).toBeTruthy()
  })

  it('Has proper HTML structure in sednew mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='sednew' />)
    expect(wrapper.exists('SEDNew')).toBeTruthy()
  })
})
