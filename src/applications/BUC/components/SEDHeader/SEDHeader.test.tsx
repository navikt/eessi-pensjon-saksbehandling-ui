import SEDHeader, {
  SEDHeaderPanel,
  SEDHeaderProps,
  SEDListSelector
} from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Buc, Bucs, Sed } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import mockBucs from 'mocks/buc/bucs'
import _ from 'lodash'
import { stageSelector } from 'setupTests'
import mockFeatureToggles from 'mocks/app/featureToggles'

jest.mock('components/Tooltip/Tooltip', () => ({ children }: any) => (
  <div data-test-id='mock-tooltip'>{children}</div>
))

const defaultSelector: SEDListSelector = {
  locale: 'nb',
  featureToggles: mockFeatureToggles,
  storageEntries: undefined
}

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const bucs: Bucs = _.keyBy(mockBucs(), 'caseId')
  const currentBuc: string = '195440'
  const buc: Buc = bucs[currentBuc]
  const mockFollowUpSeds: Array<Sed> = _.filter(bucs[currentBuc].seds, sed => sed.parentDocumentId !== undefined)
  const mockCurrentSed: Sed | undefined = _.find(bucs[currentBuc].seds, sed => sed.id === mockFollowUpSeds[0]!.parentDocumentId)

  const sed: Sed | undefined = _.find(buc.seds, sed => sed.parentDocumentId !== undefined)
  sed!.status = 'received'
  const initialMockProps: SEDHeaderProps = {
    buc,
    onFollowUpSed: jest.fn(),
    sed: mockCurrentSed!,
    setMode: jest.fn()
  }
  let wrapper: ReactWrapper

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<SEDHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDHeaderPanel)).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedheader__name-id\']').hostNodes().render().text()).toEqual('P2000 - buc:buc-P2000')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedheader__status-id\']').render().text()).toEqual('buc:status-' + sed!.status)
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedheader__version-date-id\']').hostNodes().render().text()).toEqual('29.05.2019')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedheader__version-id\']').hostNodes().render().text()).toEqual('ui:version: 5')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedheader__institutions-id\']').first().render().text()).toEqual('NO:DEMONO02')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedheader__institutions-id\']').last().render().text()).toEqual('NO:DEMONO01')

    const actions = wrapper.find('[data-test-id=\'a-buc-c-sedheader__actions-id\']').hostNodes()
    expect(actions.exists('FilledPaperClipIcon')).toBeTruthy()

    expect(actions.exists('[data-test-id=\'a-buc-c-sedheader__answer-button-id\']')).toBeTruthy()
  })

  it('Handling: handling answer button click', () => {
    (initialMockProps.onFollowUpSed as jest.Mock).mockReset()
    const replySedButton = wrapper.find('[data-test-id=\'a-buc-c-sedheader__answer-button-id\']').hostNodes().first()
    replySedButton.simulate('click')
    expect(initialMockProps.onFollowUpSed).toBeCalledWith(buc, mockCurrentSed, mockFollowUpSeds)
  })
})
