import { BUCIndex, BUCIndexProps } from 'applications/BUC/index'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React, { ChangeEvent } from 'react'
import sampleBucs from 'resources/tests/sampleBucs'

jest.mock('applications/BUC/pages/SEDNew/SEDNew', () => () => (<div className='a-buc-sednew' />))
jest.mock('applications/BUC/components/BUCCrumbs/BUCCrumbs', () => ({ setMode }: { setMode: (e: ChangeEvent) => void}) => (<select className='mock-buccrumbs' onChange={(e: ChangeEvent) => setMode(e.target.value)} />))
jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui').default
  return {
    ...Ui,
    Nav: {
      ...Ui.Nav,
      Popover: ({ children }: any) => (<div className='mock-popover'>{children}</div>)
    }
  }
})

describe('applications/BUC/index', () => {
  let wrapper: ReactWrapper
  const mockBucs = _.keyBy(sampleBucs, 'caseId')
  const initialMockProps: BUCIndexProps = {
    actions: {
      saveBucsInfo: jest.fn(),
      getInstitutionsListForBucAndCountry: jest.fn(),
      getSubjectAreaList: jest.fn(),
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
    attachments: {},
    avdodBucs: undefined,
    avdodfnr: undefined,
    bucs: mockBucs,
    bucsInfo: undefined,
    bucsInfoList: undefined,
    countryList: [],
    currentBuc: '195440',
    institutionList: {},
    institutionNames: {},
    loading: {},
    locale: 'nb',
    mode: 'buclist',
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    p4000info: { person: {}, bank: {}, stayAbroad: [] },
    person: {},
    rinaUrl: 'http://mockUrl/rina',
    sakId: '456',
    sed: undefined,
    sedList: undefined,
    t: jest.fn(t => t),
    tagList: ['mockTag1', 'mockTag2'],
    vedtakId: undefined,
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
    (initialMockProps.actions.fetchBucs as jest.Mock).mockReset();
    (initialMockProps.actions.fetchBucsInfoList as jest.Mock).mockReset();
    (initialMockProps.actions.fetchAvdodBucs as jest.Mock).mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} mode='xxx' bucs={undefined} avdodfnr='567' />)
    expect(initialMockProps.actions.fetchBucs).toHaveBeenCalled()
    expect(initialMockProps.actions.fetchBucsInfoList).toHaveBeenCalled()
    expect(initialMockProps.actions.fetchAvdodBucs).toHaveBeenCalled()
  })

  it('UseEffect: when getting BUCs, set mode to buclist', () => {
    (initialMockProps.actions.setMode as jest.Mock).mockReset()
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
    (initialMockProps.actions.setMode as jest.Mock).mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} sakId={undefined} aktoerId={undefined} />)
    expect(wrapper.exists('BUCEmpty')).toBeTruthy()
    wrapper.find('#a-buc-p-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(initialMockProps.actions.setMode).toHaveBeenCalledWith('bucnew')
  })

  it('Calls fullFocus and ReplaceFocus functions', () => {
    (initialMockProps.onFullFocus as jest.Mock).mockReset();
    (initialMockProps.onRestoreFocus as jest.Mock).mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} allowFullScreen />)
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'bucnew' } })
    wrapper.update()
    expect(initialMockProps.onFullFocus).toHaveBeenCalled()
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'buclist' } })
    wrapper.setProps({ mode: 'buclist' })
    expect(initialMockProps.onRestoreFocus).toHaveBeenCalled()
  })
})
