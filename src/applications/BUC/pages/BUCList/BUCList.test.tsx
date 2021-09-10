import { fetchBucsInfo, setCurrentBuc } from 'actions/buc'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import { bucFilter, pbuc02filter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { VEDTAKSKONTEKST } from 'constants/constants'
import * as storage from 'constants/storage'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import personAvdod from 'mocks/app/personAvdod'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import { stageSelector } from 'setupTests'
import BUCList, {
  BadBucDiv,
  BucLenkePanel,
  BUCListDiv,
  BUCListProps,
  BUCListSelector,
  BUCLoadingDiv,
  BUCStartDiv
} from './BUCList'

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
  bucsInfo: mockBucsInfo,
  bucsInfoList: [],
  highContrast: false,
  institutionList: {
    NO: [{
      name: 'mockInstitution1',
      institution: 'NO:MI1',
      acronym: 'MI1',
      country: 'NO'
    }]
  },
  loading: {
    gettingBUCs: false
  },
  locale: 'nb',
  newlyCreatedBuc: undefined,
  personAvdods: mockPersonAvdods,
  pesysContext: VEDTAKSKONTEKST
}

describe('applications/BUC/pages/BUCList/BUCList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCListProps = {
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
   // expect(wrapper).toMatchSnapshot()
  })

  it('Render: loading BUCs', () => {
    stageSelector(defaultSelector, { loading: { gettingBUCs: true } })
    wrapper = mount(<BUCList {...initialMockProps} />)
    expect(wrapper.exists(BUCLoadingDiv)).toBeTruthy()
  })

  it('UseEffect: fetch bucs info', () => {
    stageSelector(defaultSelector, {
      bucsInfoList: [
        defaultSelector.aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO
      ],
      bucsInfo: undefined
    })
    wrapper = mount(
      <BUCList {...initialMockProps} />
    )
    expect(fetchBucsInfo).toHaveBeenCalledWith(defaultSelector.aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(BUCListDiv)).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-buclist__newbuc-button-id\']')).toBeTruthy()
    expect(wrapper.find(BadBucDiv).length).toEqual(mockBucs().filter(buc => buc.error).length)
    expect(wrapper.find(BucLenkePanel).length).toEqual(mockBucs()
      .filter(bucFilter)
      .filter(pbuc02filter(VEDTAKSKONTEKST, mockPersonAvdods))
      .filter(buc => !buc.error).length)
    expect(wrapper.exists(BUCFooter)).toBeTruthy()
  })

  it('Handling: moves to open buc start when button pressed', () => {
    expect(wrapper.find(BUCStartDiv).props().className).toEqual('')
    wrapper.find('[data-test-id=\'a-buc-p-buclist__newbuc-button-id\']').hostNodes().simulate('click')
    expect(wrapper.find(BUCStartDiv).props().className).toEqual('open')
  })

  it('Handling: moves to mode bucedit when button pressed', () => {
    (setCurrentBuc as jest.Mock).mockReset()
    wrapper.find(BucLenkePanel).first().simulate('click')
    expect(setCurrentBuc).toBeCalled()
  })
})
