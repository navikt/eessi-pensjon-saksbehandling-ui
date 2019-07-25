import React from 'react'
import { BUCWidgetIndex } from 'applications/BUC/widgets/index'
import sampleBucs from 'resources/tests/sampleBucs'
jest.mock('applications/BUC/widgets/SEDNew/SEDNew', () => {
  return () => {return <div className='a-buc-sednew'/>}
})

describe('applications/BUC/widgets/index', () => {

  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {
      verifyCaseNumber: jest.fn(),
      saveBucsInfo: jest.fn(),
      getInstitutionsListForBucAndCountry: jest.fn(),
      getTagList: jest.fn()
    },
    aktoerId: '123',
    bucs: sampleBucs,
    buc: sampleBucs[0],
    seds: sampleBucs[0].seds,
    loading: {},
    locale: 'nb',
    rinaUrl: 'http://mockUrl/rina',
    sakId: '456',
    subjectAreaList: ['mockSubjectArea1', 'mockSubjectArea2'],
    t: t,
    tagList: ['mockTag1', 'mockTag2'],
    waitForMount: false
  }

  it('Renders', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='xxx' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure ', () => {
    wrapper = mount(<BUCWidgetIndex {...initialMockProps} mode='xxx' />)
    expect(wrapper.exists('.a-buc-widget')).toBeTruthy()
    expect(wrapper.exists('.a-buc-widget__header')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buccrumbs')).toBeTruthy()
    expect(wrapper.exists('.a-buc-websocket')).toBeTruthy()
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
    expect(wrapper.exists('.a-buc-sednew')).toBeTruthy()
  })
})
