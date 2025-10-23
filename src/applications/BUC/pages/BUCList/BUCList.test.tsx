import { fetchBucsInfo, setCurrentBuc } from 'src/actions/buc'
import BUCFooter from 'src/applications/BUC/components/BUCFooter/BUCFooter'
//import { bucFilter, pbuc02filter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import { VEDTAKSKONTEKST } from 'src/constants/constants'
import * as storage from 'src/constants/storage'
import { render, screen } from '@testing-library/react'
import _ from 'lodash'
import personAvdod from 'src/mocks/person/personAvdod'
import mockBucs from 'src/mocks/buc/bucs'
import mockBucsList from 'src/mocks/buc/bucsList'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import { stageSelector } from 'src/setupTests'
import BUCList, {
  BUCListProps,
  BUCListSelector
} from './BUCList'
//import {BucLenkePanel, BUCStartDiv} from "../../CommonBucComponents";

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
  sakType: undefined,
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

  it('Render: loading BUCs', () => {
    stageSelector(defaultSelector, { loading: { gettingBucsList: true } })
    wrapper = render(<BUCList {...initialMockProps} />)
    //expect(wrapper.exists(BUCLoadingDiv)).toBeTruthy()  //Disabled, as BUCLoadingDiv does no longer exist in BUCList
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
    //expect(wrapper.exists(BUCListDiv)).toBeTruthy()    //Disabled, as BUCListDiv does no longer exist in BUCList
    expect(screen.getByTestId('a-buc-p-buclist--newbuc-button-id')).toBeInTheDocument()
    //expect(wrapper.find(BadBucDiv).length).toEqual(mockBucs().filter(buc => buc.error).length)    //Disabled, as BadBucDiv does no longer exist in BUCList
/*    expect(wrapper.find(BucLenkePanel).length).toEqual(mockBucs()    //Disabled, as BucLenkePanel does no longer exist in BUCList
      .filter(bucFilter)
      .filter(pbuc02filter(VEDTAKSKONTEKST, mockPersonAvdods))
      .filter(buc => !buc.error).length)*/
    expect(wrapper.exists(BUCFooter)).toBeTruthy()
  })

  it('Handling: moves to open buc start when button pressed', () => {
    //expect(wrapper.find(BUCStartDiv).props().className).toEqual('')    //Disabled, as BUCStartDiv does no longer exist in BUCList
    wrapper.find('[data-testid=\'a-buc-p-buclist--newbuc-button-id').hostNodes().simulate('click')
    //expect(wrapper.find(BUCStartDiv).props().className).toEqual('open')    //Disabled, as BUCStartDiv does no longer exist in BUCList
  })

  it('Handling: moves to mode bucedit when button pressed', () => {
    (setCurrentBuc as jest.Mock).mockReset()
    //wrapper.find(BucLenkePanel).first().simulate('click')    //Disabled, as BucLenkePanel does no longer exist in BUCList
    expect(setCurrentBuc).toBeCalled()
  })
})
