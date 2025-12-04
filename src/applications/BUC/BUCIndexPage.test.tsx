import {
  fetchBucsList,
  fetchBucsInfoList,
  fetchBucsListWithVedtakId,
  getRinaUrl,
  getSakType,
  setMode
} from 'src/actions/buc'
import BUCIndexPage, { BUCIndexPageSelector} from 'src/applications/BUC/BUCIndexPage'
import BUCEmpty from 'src/applications/BUC/pages/BUCEmpty/BUCEmpty'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'src/constants/constants'
import { Buc } from 'src/declarations/buc'
import { render, screen } from '@testing-library/react'
import _ from 'lodash'
import mockBucs from 'src/mocks/buc/bucs'
import { stageSelector } from 'src/setupTests'

jest.mock('applications/BUC/components/BUCDetail/BUCDetail', () => () => (<div className='a-buc-bucdetail' />))

jest.mock('actions/buc', () => ({
  fetchBucs: jest.fn(),
  fetchBucsWithVedtakId: jest.fn(),
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

const defaultSelector: BUCIndexPageSelector = {
  aktoerId: '123',
  bucs: _mockBucs,
  bucsList: undefined,
  gettingBucs: false,
  gettingBucsList: false,
  howManyBucLists: 0,
  pesysContext: VEDTAKSKONTEKST,
  sakId: '456',
  vedtakId: undefined
}

describe('applications/BUC/index', () => {
  let wrapper: any

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('UseEffect: getRinaUrl', () => {
    (getRinaUrl as jest.Mock).mockReset()
    wrapper = render(<BUCIndexPage />)
    expect(getRinaUrl).toHaveBeenCalled()
  })

  it('UseEffect: fetchBucs, fetchBucsInfo', () => {
    (fetchBucsList as jest.Mock).mockReset();
    (fetchBucsInfoList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucs: undefined,
      pesysContext: BRUKERKONTEKST
    })
    wrapper = render(<BUCIndexPage />)
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
    wrapper = render(<BUCIndexPage />)
    expect(fetchBucsListWithVedtakId).toHaveBeenCalled()
    expect(fetchBucsInfoList).toHaveBeenCalled()
  })

  it('UseEffect: getting sakType', () => {
    (getSakType as jest.Mock).mockReset()
    stageSelector(defaultSelector, { sakType: undefined })
    wrapper = render(<BUCIndexPage />)
    // -1 as there is one ErrorBuc in mockBucs
    expect(getSakType).toHaveBeenCalled()
  })

  it('Render: has proper HTML structure ', () => {
    wrapper = render(<BUCIndexPage />)
    expect(screen.getByTestId('a-buc-index\']')).toBeInTheDocument()
  })

  it('Render: shows BUCEmptyGjenny when no sakId and aktoerId are given', () => {
    (setMode as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      sakId: undefined,
      aktoerId: undefined
    })
    wrapper = render(<BUCIndexPage />)
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
