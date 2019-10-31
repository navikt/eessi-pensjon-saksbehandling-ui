import React from 'react'
import { BUCIndex } from 'applications/BUC'
import sampleBucs from 'resources/tests/sampleBucs'
jest.mock('applications/BUC/pages/SEDNew/SEDNew', () => {
  return () => { return <div className='a-buc-sednew' /> }
})
jest.mock('applications/BUC/components/BUCCrumbs/BUCCrumbs', () => {
  return ({ setMode }) => (<div className='mock-buccrumbs' onChange={(e) => setMode(e.target.value)} />)
})
const bucReducer = (currentBucs, newBuc) => {
  currentBucs[newBuc.caseId] = newBuc
  return currentBucs
}
const mockBucs = sampleBucs.reduce(bucReducer, {})

describe('applications/BUC/index', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      saveBucsInfo: jest.fn(),
      getInstitutionsListForBucAndCountry: jest.fn(),
      getBucList: jest.fn(),
      getTagList: jest.fn(),
      fetchBucs: jest.fn(),
      fetchBucsInfoList: jest.fn(),
      fetchAvdodBucs: jest.fn(),
      getSakType: jest.fn(),
      getRinaUrl: jest.fn(),
      setMode: jest.fn()
    },
    aktoerId: '123',
    bucs: mockBucs,
    currentBuc: '195440',
    loading: {},
    locale: 'nb',
    mode: 'buclist',
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    rinaUrl: 'http://mockUrl/rina',
    sakId: '456',
    subjectAreaList: ['mockSubjectArea1', 'mockSubjectArea2'],
    t: jest.fn(t => t),
    tagList: ['mockTag1', 'mockTag2'],
    waitForMount: false
  }

  it('Renders', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} mode='xxx' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: getRinaUrl', () => {
    const mockActions = { getRinaUrl: jest.fn() }
    wrapper = mount(<BUCIndex waitForMount loading={{}} actions={mockActions} t={initialMockProps.t} aktoerId='123' mode='xxx' />)
    expect(mockActions.getRinaUrl).toHaveBeenCalledWith()
  })

  it('UseEffect: fetchBucs, fetchBucsInfo, fetchAvdodBucs', () => {
    initialMockProps.actions.fetchBucs.mockReset()
    initialMockProps.actions.fetchBucsInfoList.mockReset()
    initialMockProps.actions.fetchAvdodBucs.mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} mode='xxx' bucs={undefined} avdodfnr='567' />)
    expect(initialMockProps.actions.fetchBucs).toHaveBeenCalled()
    expect(initialMockProps.actions.fetchBucsInfoList).toHaveBeenCalled()
    expect(initialMockProps.actions.fetchAvdodBucs).toHaveBeenCalled()
  })

  it('UseEffect: when getting BUCs, set mode to buclist', () => {
    initialMockProps.actions.setMode.mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} mode='bucnew' loading={{ gettingBUCs: true }} />)
    expect(initialMockProps.actions.setMode).toHaveBeenCalledWith('buclist')
  })

  it('Has proper HTML structure ', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} mode='xxx' />)
    expect(wrapper.exists('.a-buc-widget')).toBeTruthy()
    expect(wrapper.exists('.a-buc-widget__header')).toBeTruthy()
    expect(wrapper.exists('.mock-buccrumbs')).toBeTruthy()
  })

  it('Has proper HTML structure in buclist mode', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} mode='buclist' />)
    expect(wrapper.exists('BUCList')).toBeTruthy()
  })

  it('Has proper HTML structure in bucedit mode', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} mode='bucedit' />)
    expect(wrapper.exists('BUCEdit')).toBeTruthy()
  })

  it('Has proper HTML structure in bucnew mode', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} mode='bucnew' />)
    expect(wrapper.exists('BUCNew')).toBeTruthy()
  })

  it('Has proper HTML structure in sednew mode', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} mode='sednew' />)
    expect(wrapper.exists('.a-buc-sednew')).toBeTruthy()
  })

  it('HShows BUCEmpty when no sakId and aktoerId are given', () => {
    initialMockProps.actions.setMode.mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} sakId={undefined} aktoerId={undefined} />)
    expect(wrapper.exists('BUCEmpty')).toBeTruthy()
    wrapper.find('#a-buc-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(initialMockProps.actions.setMode).toHaveBeenCalledWith('bucnew')
  })

  it('Calls fullFocus and ReplaceFocus functions', () => {
    initialMockProps.onFullFocus.mockReset()
    initialMockProps.onRestoreFocus.mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} allowFullScreen={true} />)
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'bucnew' } })
    wrapper.update()
    expect(initialMockProps.onFullFocus).toHaveBeenCalled()
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'buclist' } })
    wrapper.setProps({ mode: 'buclist' })
    expect(initialMockProps.onRestoreFocus).toHaveBeenCalled()
  })
})
