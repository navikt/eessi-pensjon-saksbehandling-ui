import { fetchAvdodBucs, fetchBucs, fetchBucsInfoList, getRinaUrl, setMode } from 'actions/buc'
import { BUCIndex, BUCIndexProps, BUCIndexSelector } from 'applications/BUC/index'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

jest.mock('applications/BUC/pages/SEDNew/SEDNew', () => () => (<div className='a-buc-sednew' />))
jest.mock('applications/BUC/components/BUCCrumbs/BUCCrumbs', () =>
  ({ setMode }: { setMode: (e: string) => void }) => (
    <select className='mock-buccrumbs' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMode(e.target.value)} />
  ))
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

jest.mock('actions/buc', () => ({
  saveBucsInfo: jest.fn(),
  getRinaUrl: jest.fn(),
  fetchAvdodBucs: jest.fn(),
  fetchBucs: jest.fn(),
  fetchBucsInfoList: jest.fn(),
  setMode: jest.fn(),
  getSubjectAreaList: jest.fn(),
  getBucList: jest.fn(),
  getTagList: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const mockBucs = _.keyBy(sampleBucs, 'caseId')

const defaultSelector: BUCIndexSelector = {
  aktoerId: '123',
  avdodfnr: undefined,
  avdodBucs: undefined,
  bucs: mockBucs,
  bucsInfo: sampleBucsInfo,
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
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('applications/BUC/index', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCIndexProps = {
    allowFullScreen: true,
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    waitForMount: false
  }

  it('Renders', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      mode: 'xxx'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: getRinaUrl', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      aktoerId: '123',
      mode: 'xxx'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} waitForMount />)
    expect(getRinaUrl).toHaveBeenCalledWith()
  })

  it('UseEffect: fetchBucs, fetchBucsInfo, fetchAvdodBucs', () => {
    (fetchBucs as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset();
    (fetchAvdodBucs as jest.Mock).mockReset();
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      avdodfnr: '567',
      sakId: '123',
      aktoerId: '123',
      bucs: undefined,
      mode: 'xxx'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(fetchBucs).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
    expect(fetchAvdodBucs).toHaveBeenCalled()
  })

  it('UseEffect: when getting BUCs, set mode to buclist', () => {
    (setMode as jest.Mock).mockReset();
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      loading: { gettingBUCs: true },
      mode: 'bucnew'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(setMode).toHaveBeenCalledWith('buclist')
  })

  it('Has proper HTML structure ', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      mode: 'xxx'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-widget')).toBeTruthy()
    expect(wrapper.exists('.a-buc-widget__header')).toBeTruthy()
    expect(wrapper.exists('.mock-buccrumbs')).toBeTruthy()
  })

  it('Has proper HTML structure in buclist mode', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      mode: 'buclist'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCList')).toBeTruthy()
  })

  it('Has proper HTML structure in bucedit mode', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      mode: 'bucedit'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCEdit')).toBeTruthy()
  })

  it('Has proper HTML structure in bucnew mode', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      mode: 'bucnew'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCNew')).toBeTruthy()
  })

  it('Has proper HTML structure in sednew mode', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      mode: 'sednew'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-sednew')).toBeTruthy()
  })

  it('Shows BUCEmpty when no sakId and aktoerId are given', () => {
    (setMode as jest.Mock).mockReset();
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      sakId: undefined,
      aktoerId: undefined
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('BUCEmpty')).toBeTruthy()
    wrapper.find('#a-buc-p-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(setMode).toHaveBeenCalledWith('bucnew')
  })

  it('Calls fullFocus and ReplaceFocus functions', () => {
    (initialMockProps.onFullFocus as jest.Mock).mockReset();
    (initialMockProps.onRestoreFocus as jest.Mock).mockReset();
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      sakId: '456',
      aktoerId: '123'
    }))
    wrapper = mount(<BUCIndex {...initialMockProps} allowFullScreen />)
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'bucnew' } })
    wrapper.update()
    expect(initialMockProps.onFullFocus).toHaveBeenCalled()
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'buclist' } })
    wrapper.setProps({ mode: 'buclist' })
    expect(initialMockProps.onRestoreFocus).toHaveBeenCalled()
  })
})
