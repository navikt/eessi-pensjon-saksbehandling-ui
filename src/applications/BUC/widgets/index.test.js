import React from 'react'
import { BUCWidgetIndex } from 'applications/BUC/widgets/index'
import sampleBucs from 'resources/tests/sampleBucs'
jest.mock('applications/BUC/widgets/SEDNew/SEDNew', () => {
  return () => { return <div className='a-buc-sednew' /> }
})

const bucReducer = (currentBucs, newBuc) => {
  currentBucs[newBuc.caseId] = newBuc
  return currentBucs
}
const mockBucs = sampleBucs.reduce(bucReducer, {})

describe('applications/BUC/widgets/index', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {
      saveBucsInfo: jest.fn(),
      getInstitutionsListForBucAndCountry: jest.fn(),
      getBucList: jest.fn(),
      getTagList: jest.fn(),
      fetchBucs: jest.fn(),
      fetchBucsInfoList: jest.fn(),
      getSakType: jest.fn()
    },
    aktoerId: '123',
    bucs: mockBucs,
    buc: sampleBucs[0],
    currentBuc: '195440',
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
