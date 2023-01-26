import { fetchBucsInfo, setCurrentBuc } from 'actions/buc'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import { bucFilter, pbuc02filter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { VEDTAKSKONTEKST } from 'constants/constants'
import * as storage from 'constants/storage'
import { render, screen } from '@testing-library/react'
import _ from 'lodash'
import personAvdod from 'mocks/person/personAvdod'
import mockBucs from 'mocks/buc/bucs'
import mockBucsList from 'mocks/buc/bucsList'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import { stageSelector } from 'setupTests'
import BUCList, {
  BUCListProps,
  BUCListSelector
} from './BUCList'
import {BadBucDiv, BucLenkePanel, BUCListDiv, BUCLoadingDiv, BUCStartDiv} from "../../CommonBucComponents";

jest.mock('applications/BUC/components/BUCFooter/BUCFooter', () => () => <div className='mock-bucfooter' />)

jest.mock('applications/BUC/components/BUCStart/BUCStart', () => ({ classname }: any) => (
  <div className={'mock-bucstart' + (classname ? ' ' + classname : '')} />)
)

jest.mock('actions/buc', () => ({
  fetchBucsInfo: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn(),
  setCurrentBuc: jest.fn()
}))

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

const mockPersonAvdods = personAvdod(1)

const defaultSelector: BUCListSelector = {
  aktoerId: '123',
  bucs: _.keyBy(mockBucs(), 'caseId'),
  bucsList: mockBucsList('123', '456'),
  bucsInfo: mockBucsInfo,
  gettingBucsList: false,
  gettingBucs: false,
  locale: 'nb',
  newlyCreatedBuc: undefined,
  personAvdods: mockPersonAvdods,
  pesysContext: VEDTAKSKONTEKST
}

describe('applications/BUC/pages/BUCList/BUCList', () => {
  let wrapper: any

  const initialMockProps: BUCListProps = {
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<BUCList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<BUCList {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: loading BUCs', () => {
    stageSelector(defaultSelector, { loading: { gettingBucsList: true } })
    wrapper = render(<BUCList {...initialMockProps} />)
    expect(wrapper.exists(BUCLoadingDiv)).toBeTruthy()
  })

  it('UseEffect: fetch bucs info', () => {
    stageSelector(defaultSelector, {
      bucsInfoList: [
        defaultSelector.aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO
      ],
      bucsInfo: undefined
    })
    wrapper = render(
      <BUCList {...initialMockProps} />
    )
    expect(fetchBucsInfo).toHaveBeenCalledWith(defaultSelector.aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(BUCListDiv)).toBeTruthy()
    expect(screen.getByTestId('a-buc-p-buclist--newbuc-button-id')).toBeInTheDocument()
    expect(wrapper.find(BadBucDiv).length).toEqual(mockBucs().filter(buc => buc.error).length)
    expect(wrapper.find(BucLenkePanel).length).toEqual(mockBucs()
      .filter(bucFilter)
      .filter(pbuc02filter(VEDTAKSKONTEKST, mockPersonAvdods))
      .filter(buc => !buc.error).length)
    expect(wrapper.exists(BUCFooter)).toBeTruthy()
  })

  it('Handling: moves to open buc start when button pressed', () => {
    expect(wrapper.find(BUCStartDiv).props().className).toEqual('')
    wrapper.find('[data-testid=\'a-buc-p-buclist--newbuc-button-id').hostNodes().simulate('click')
    expect(wrapper.find(BUCStartDiv).props().className).toEqual('open')
  })

  it('Handling: moves to mode bucedit when button pressed', () => {
    (setCurrentBuc as jest.Mock).mockReset()
    wrapper.find(BucLenkePanel).first().simulate('click')
    expect(setCurrentBuc).toBeCalled()
  })
})
