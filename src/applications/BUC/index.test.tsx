import { fetchBucParticipants, fetchBucs, fetchBucsInfoList, getRinaUrl, setMode } from 'actions/buc'
import { BUCIndex, BUCIndexProps, BUCIndexSelector } from 'applications/BUC/index'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import { stageSelector } from 'setupTests'

jest.mock('applications/BUC/pages/SEDNew/SEDNew', () => () => (<div className='a-buc-sednew' />))
jest.mock('applications/BUC/components/BUCDetail/BUCDetail', () => () => (<div className='a-buc-bucdetail' />))
jest.mock('applications/BUC/components/BUCCrumbs/BUCCrumbs', () =>
  ({ setMode }: { setMode: (e: string) => void }) => (
    <select className='mock-buccrumbs' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMode(e.target.value)} />
  ))
jest.mock('nav-frontend-popover', () => ({ children }: any) => (<div className='mock-popover'>{children}</div>))

jest.mock('actions/buc', () => ({
  saveBucsInfo: jest.fn(),
  getRinaUrl: jest.fn(),
  fetchBucs: jest.fn(),
  fetchBucParticipants: jest.fn(),
  fetchBucsInfoList: jest.fn(),
  setMode: jest.fn(),
  getSubjectAreaList: jest.fn(),
  getBucList: jest.fn(),
  getTagList: jest.fn()
}))

const _mockBucs = _.keyBy(mockBucs(), 'caseId')
Object.keys(_mockBucs).forEach(bucId => {
  delete _mockBucs[bucId].institusjon
})

const defaultSelector: BUCIndexSelector = {
  aktoerId: '123',
  bucs: _mockBucs,
  bucsInfo: mockBucsInfo,
  currentBuc: '195440',
  loading: {
    gettingBUCs: false
  },
  locale: 'nb',
  mode: 'buclist',
  person: undefined,
  rinaUrl: undefined,
  sakId: '456',
  sakType: undefined
}

describe('applications/BUC/index', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCIndexProps = {
    allowFullScreen: true,
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    waitForMount: false
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    stageSelector(defaultSelector, { mode: 'xxx' })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    // expect(wrapper).toMatchSnapshot()  // React.Tooltip generates uuid now
  })

  it('UseEffect: getRinaUrl', () => {
    stageSelector(defaultSelector, {
      aktoerId: '123',
      mode: 'xxx'
    })
    wrapper = mount(<BUCIndex {...initialMockProps} waitForMount />)
    expect(getRinaUrl).toHaveBeenCalledWith()
  })

  it('UseEffect: fetchBucs, fetchBucsInfo', () => {
    (fetchBucs as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: '123',
      aktoerId: '123',
      bucs: undefined,
      mode: 'xxx'
    })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(fetchBucs).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
  })

  it('UseEffect: when getting bucs list, get participants', () => {
    (fetchBucParticipants as jest.Mock).mockReset()
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCIndex {...initialMockProps} waitForMount />)
    // -1 as there is one ErrorBuc in mockBucs
    expect(fetchBucParticipants).toBeCalledTimes(Object.keys(mockBucs()).length - 1)
  })

  it('UseEffect: when getting BUCs, set mode to buclist', () => {
    (setMode as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      loading: { gettingBUCs: true },
      mode: 'bucnew'
    })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(setMode).toHaveBeenCalledWith('buclist')
  })

  it('Has proper HTML structure ', () => {
    stageSelector(defaultSelector, { mode: 'xxx' })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-widget')).toBeTruthy()
    expect(wrapper.exists('.a-buc-widget__header')).toBeTruthy()
    expect(wrapper.exists('.mock-buccrumbs')).toBeTruthy()
  })

  it('Has proper HTML structure in buclist mode', () => {
    stageSelector(defaultSelector, { mode: 'buclist' })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCList')).toBeTruthy()
  })

  it('Has proper HTML structure in bucedit mode', () => {
    stageSelector(defaultSelector, { mode: 'bucedit' })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCEdit')).toBeTruthy()
  })

  it('Has proper HTML structure in bucnew mode', () => {
    stageSelector(defaultSelector, { mode: 'bucnew' })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCNew')).toBeTruthy()
  })

  it('Has proper HTML structure in sednew mode', () => {
    stageSelector(defaultSelector, { mode: 'sednew' })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-sednew')).toBeTruthy()
  })

  it('Shows BUCEmpty when no sakId and aktoerId are given', () => {
    (setMode as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: undefined,
      aktoerId: undefined
    })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCEmpty')).toBeTruthy()
    wrapper.find('#a-buc-p-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(setMode).toHaveBeenCalledWith('bucnew')
  })

  it('Calls fullFocus and ReplaceFocus functions', () => {
    (initialMockProps.onFullFocus as jest.Mock).mockReset();
    (initialMockProps.onRestoreFocus as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: '456',
      aktoerId: '123'
    })
    wrapper = mount(<BUCIndex {...initialMockProps} allowFullScreen />)
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'bucnew' } })
    wrapper.update()
    expect(initialMockProps.onFullFocus).toHaveBeenCalled()
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'buclist' } })
    wrapper.setProps({ mode: 'buclist' })
    expect(initialMockProps.onRestoreFocus).toHaveBeenCalled()
  })
})
