import {
  fetchBucParticipants,
  fetchBucs,
  fetchBucsInfoList,
  fetchBucsWithVedtakId,
  getRinaUrl,
  getSakType,
  setMode
} from 'actions/buc'
import { BUCIndex, BUCIndexDiv, BUCIndexProps, BUCIndexSelector, ContainerDiv, WindowDiv } from 'applications/BUC/index'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'
import { Buc } from 'declarations/buc'
import { AllowedLocaleString } from 'declarations/app.d'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import { stageSelector } from 'setupTests'

jest.mock('applications/BUC/components/BUCDetail/BUCDetail', () => () => (<div className='a-buc-bucdetail' />))

jest.mock('actions/buc', () => ({
  fetchBucs: jest.fn(),
  fetchBucsWithVedtakId: jest.fn(),
  fetchBucParticipants: jest.fn(),
  fetchBucsInfoList: jest.fn(),
  getSakType: jest.fn(),
  getSubjectAreaList: jest.fn(),
  getBucList: jest.fn(),
  getRinaUrl: jest.fn(),
  getTagList: jest.fn(),
  saveBucsInfo: jest.fn(),
  setMode: jest.fn()
}))

const _mockBucs: {[k: string]: Buc} = _.keyBy(mockBucs(), 'caseId')

Object.keys(_mockBucs).forEach(bucId => {
  _mockBucs[bucId].institusjon = undefined
})

const defaultSelector: BUCIndexSelector = {
  aktoerId: '123',
  bucs: _mockBucs,
  bucsInfo: mockBucsInfo,
  currentBuc: '195440',
  loading: {
    gettingBUCs: false
  },
  locale: 'nb' as AllowedLocaleString,
  pesysContext: VEDTAKSKONTEKST,
  rinaUrl: undefined,
  sakId: '456',
  sakType: 'Generell',
  vedtakId: undefined
}

describe('applications/BUC/index', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCIndexProps = {
    allowFullScreen: true,
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    waitForMount: false
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: getRinaUrl', () => {
    (getRinaUrl as jest.Mock).mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} waitForMount />)
    expect(getRinaUrl).toHaveBeenCalled()
  })

  it('UseEffect: fetchBucs, fetchBucsInfo', () => {
    (fetchBucs as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucs: undefined,
      pesysContext: BRUKERKONTEKST
    })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(fetchBucs).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
  })

  it('UseEffect: fetchBucsWithVedtakId, fetchBucsInfo', () => {
    (fetchBucsWithVedtakId as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucs: undefined,
      vedtakId: '789'
    })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(fetchBucsWithVedtakId).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
  })

  it('UseEffect: getting sakType', () => {
    (getSakType as jest.Mock).mockReset()
    stageSelector(defaultSelector, { sakType: undefined })
    wrapper = mount(<BUCIndex {...initialMockProps} waitForMount />)
    // -1 as there is one ErrorBuc in mockBucs
    expect(getSakType).toHaveBeenCalled()
  })

  it('UseEffect: when getting bucs list, get participants', () => {
    (fetchBucParticipants as jest.Mock).mockReset()
    wrapper = mount(<BUCIndex {...initialMockProps} waitForMount />)
    // -1 as there is one ErrorBuc in mockBucs
    expect(fetchBucParticipants).toBeCalledTimes(Object.keys(mockBucs()).length - 1)
  })

  it('Render: has proper HTML structure ', () => {
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-index\']')).toBeTruthy()
    expect(wrapper.exists(ContainerDiv)).toBeTruthy()
    expect(wrapper.exists(WindowDiv)).toBeTruthy()
  })

  it('Render: shows BUCEmpty when no sakId and aktoerId are given', () => {
    (setMode as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: undefined,
      aktoerId: undefined
    })
    wrapper = mount(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists(BUCEmpty)).toBeTruthy()
  })

/*  it('Calls fullFocus and ReplaceFocus functions', () => {
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
  }) */
})
