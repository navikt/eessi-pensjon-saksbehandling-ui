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

  it('renders successfully', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders BUCWidgetIndex ', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.exists('.a-buc-widget')).toEqual(true)
    expect(wrapper.exists('.a-buc-widget__header')).toEqual(true)
    expect(wrapper.exists('BUCCrumbs')).toEqual(true)
    expect(wrapper.exists('BUCWebSocket')).toEqual(true)
  })

  it('renders BUCWidgetIndex in buclist mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.exists('BUCList')).toEqual(true)
  })

  it('renders BUCWidgetIndex in bucedit mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='bucedit' />)
    expect(wrapper.exists('BUCEdit')).toEqual(true)
  })

  it('renders BUCWidgetIndex in bucnew mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='bucnew' />)
    expect(wrapper.exists('BUCNew')).toEqual(true)
  })

  it('renders BUCWidgetIndex in sednew mode', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='sednew' />)
    expect(wrapper.exists('SEDNew')).toEqual(true)
  })
})
