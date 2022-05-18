import {
  fetchBucParticipants,
  fetchBucsList,
  fetchBucsInfoList,
  fetchBucsListWithVedtakId,
  getRinaUrl,
  getSakType,
  setMode
} from 'actions/buc'
import { BUCIndex, BUCIndexProps, BUCIndexSelector, ContainerDiv, WindowDiv } from 'applications/BUC/index'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'
import { Buc } from 'declarations/buc'
import { render, screen } from '@testing-library/react'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'
import { stageSelector } from 'setupTests'

jest.mock('applications/BUC/components/BUCDetail/BUCDetail', () => () => (<div className='a-buc-bucdetail' />))

jest.mock('actions/buc', () => ({
  fetchBucs: jest.fn(),
  fetchBucsWithVedtakId: jest.fn(),
  fetchBucParticipants: jest.fn(),
  fetchBucsInfoList: jest.fn(),
  getSakType: jest.fn(),
  getSubjectAreaList: jest.fn(),
  getBucOptions: jest.fn(),
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
  bucsList: undefined,
  gettingBucs: false,
  gettingBucsList: false,
  gettingSakType: false,
  howManyBucLists: 0,
  pesysContext: VEDTAKSKONTEKST,
  rinaUrl: undefined,
  sakId: '456',
  sakType: 'Generell',
  vedtakId: undefined
}

describe('applications/BUC/index', () => {
  let wrapper: any
  const initialMockProps: BUCIndexProps = {
    allowFullScreen: true,
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    waitForMount: false
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: match snapshot', () => {
    const { container } = render(<BUCIndex {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('UseEffect: getRinaUrl', () => {
    (getRinaUrl as jest.Mock).mockReset()
    wrapper = render(<BUCIndex {...initialMockProps} waitForMount />)
    expect(getRinaUrl).toHaveBeenCalled()
  })

  it('UseEffect: fetchBucs, fetchBucsInfo', () => {
    (fetchBucsList as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucs: undefined,
      pesysContext: BRUKERKONTEKST
    })
    wrapper = render(<BUCIndex {...initialMockProps} />)
    expect(fetchBucsList).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
  })

  it('UseEffect: fetchBucsWithVedtakId, fetchBucsInfo', () => {
    (fetchBucsListWithVedtakId as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucs: undefined,
      vedtakId: '789'
    })
    wrapper = render(<BUCIndex {...initialMockProps} />)
    expect(fetchBucsListWithVedtakId).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
  })

  it('UseEffect: getting sakType', () => {
    (getSakType as jest.Mock).mockReset()
    stageSelector(defaultSelector, { sakType: undefined })
    wrapper = render(<BUCIndex {...initialMockProps} waitForMount />)
    // -1 as there is one ErrorBuc in mockBucs
    expect(getSakType).toHaveBeenCalled()
  })

  it('UseEffect: when getting bucs list, get participants', () => {
    (fetchBucParticipants as jest.Mock).mockReset()
    wrapper = render(<BUCIndex {...initialMockProps} waitForMount />)
    // -1 as there is one ErrorBuc in mockBucs
    expect(fetchBucParticipants).toBeCalledTimes(Object.keys(mockBucs()).length - 1)
  })

  it('Render: has proper HTML structure ', () => {
    wrapper = render(<BUCIndex {...initialMockProps} />)
    expect(screen.getByTestId('a-buc-index\']')).toBeInTheDocument()
    expect(wrapper.exists(ContainerDiv)).toBeTruthy()
    expect(wrapper.exists(WindowDiv)).toBeTruthy()
  })

  it('Render: shows BUCEmpty when no sakId and aktoerId are given', () => {
    (setMode as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: undefined,
      aktoerId: undefined
    })
    wrapper = render(<BUCIndex {...initialMockProps} />)
    expect(wrapper.exists(BUCEmpty)).toBeTruthy()
  })

/*  it('Calls fullFocus and ReplaceFocus functions', () => {
    (initialMockProps.onFullFocus as jest.Mock).mockReset();
    (initialMockProps.onRestoreFocus as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: '456',
      aktoerId: '123'
    })
    wrapper = render(<BUCIndex {...initialMockProps} allowFullScreen />)
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'bucnew' } })
    wrapper.update()
    expect(initialMockProps.onFullFocus).toHaveBeenCalled()
    wrapper.find('.mock-buccrumbs').simulate('change', { target: { value: 'buclist' } })
    wrapper.setProps({ mode: 'buclist' })
    expect(initialMockProps.onRestoreFocus).toHaveBeenCalled()
  }) */
})
