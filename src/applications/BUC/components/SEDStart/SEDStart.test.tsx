import {
  createSed,
  getCountryList,
  getSedList,
  resetSed,
  setSedList
} from 'actions/buc'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { Bucs, Sed } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockFeatureToggles from 'mocks/app/featureToggles'
import personAvdod from 'mocks/app/personAvdod'
import mockBucs from 'mocks/buc/bucs'
import mockItems from 'mocks/joark/items'
import { stageSelector } from 'setupTests'
import { SEDStart, SEDStartDiv, SEDStartProps, SEDStartSelector } from './SEDStart'

jest.mock('actions/buc', () => ({
  createReplySed: jest.fn(),
  createSavingAttachmentJob: jest.fn(),
  createSed: jest.fn(),
  getCountryList: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn(),
  getSedList: jest.fn(),
  resetSavingAttachmentJob: jest.fn(),
  resetSed: jest.fn(),
  resetSedAttachments: jest.fn(),
  sendAttachmentToSed: jest.fn(),
  setSedList: jest.fn()
}))

const defaultSelector: SEDStartSelector = {
  attachmentsError: false,
  countryList: [],
  gettingP6000: false,
  featureToggles: mockFeatureToggles,
  highContrast: false,
  institutionList: {},
  institutionNames: {},
  kravDato: '1970-01-01',
  kravId: '456',
  loading: {},
  locale: 'nb',
  p6000s: undefined,
  personAvdods: personAvdod(1),
  pesysContext: VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedsWithAttachments: {},
  sedList: undefined,
  vedtakId: undefined
}

describe('applications/BUC/components/SEDStart/SEDStart', () => {
  let wrapper: ReactWrapper
  const mockBucList: Bucs = _.keyBy(mockBucs(), 'caseId')
  const mockCurrentBuc: string = '195440'
  const mockReplySed: Sed | undefined = _.find(mockBucList[mockCurrentBuc].seds, sed => sed.parentDocumentId !== undefined)
  const mockCurrentSed: Sed | undefined = _.find(mockBucList[mockCurrentBuc].seds, sed => sed.id === mockReplySed!.parentDocumentId)
  const initialMockProps: SEDStartProps = {
    aktoerId: '123',
    bucs: mockBucList,
    currentBuc: mockCurrentBuc,
    initialAttachments: mockItems,
    initialSed: 'P2000',
    onSedCreated: jest.fn(),
    onSedCancelled: jest.fn(),
    currentSed: undefined,
    replySed: undefined
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<SEDStart {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDStartDiv)).toBeTruthy()
  })

  it('UseEffect: getCountryList', () => {
    (getCountryList as jest.Mock).mockReset()
    stageSelector(defaultSelector, { countryList: undefined })
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(getCountryList).toHaveBeenCalled()
  })

  it('UseEffect: getSedList with no currentSed ', () => {
    (getSedList as jest.Mock).mockReset()
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(getSedList).toHaveBeenCalledWith(initialMockProps.bucs[initialMockProps.currentBuc])
  })

  it('UseEffect: getSedList with valid replySed ', () => {
    (setSedList as jest.Mock).mockReset()
    wrapper = mount(<SEDStart {...initialMockProps} replySed={mockReplySed} currentSed={mockCurrentSed} />)
    expect(setSedList).toHaveBeenCalledWith(['P6000'])
  })

  /* it('UseEffect: createSavingAttachmentJob', () => {
    (createSavingAttachmentJob as jest.Mock).mockReset()
    const mockSed: Sed = {
      id: '123',
      type: 'mockType',
      status: 'new',
      creationDate: 1,
      lastUpdate: 2,
      participants: [],
      attachments: [],
      firstVersion: {id: '1', date: 1},
      lastVersion: {id: '1', date: 1},
      allowsAttachments: true
    }
    stageSelector(defaultSelector, { sed: mockSed })
    wrapper = mount(<SEDStart {...initialMockProps} initialSendingAttachments={true} initialAttachments={mockItems} />)
    expect(createSavingAttachmentJob).toHaveBeenCalled()
  }) */

  it('Handling: with a BUC with SEDs that have NO participants, demand a institution', () => {
    const mockBucsWithNoParticipants: Bucs = _.keyBy(mockBucs(), 'caseId')
    mockBucsWithNoParticipants[initialMockProps.currentBuc!].institusjon = []
    mockBucsWithNoParticipants[initialMockProps.currentBuc!].seds = []
    wrapper = mount(<SEDStart {...initialMockProps} bucs={mockBucsWithNoParticipants} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']')).toBeFalsy()
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseInstitution' + 'buc:validation-chooseCountry'
    )
  })

  it('Handling: with a BUC with SEDs that have participants, no need to demand a institution', () => {
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']')).toBeFalsy()
  })

  it('Handling: Creates sed when forward button is clicked ', () => {
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    expect(createSed).toHaveBeenCalledWith(mockBucList[mockCurrentBuc], {
      aktoerId: '123',
      avdodfnr: 'personFarFnr',
      buc: 'P_BUC_02',
      euxCaseId: '195440',
      institutions: [],
      kravDato: '01-01-1970',
      sakId: '123',
      sed: 'P2000',
      subject: {
        avdod: {
          fnr: 'personFarFnr'
        },
        gjenlevende: {
          fnr: 'personFnr'
        }
      }
    })
  })

  it('Handling: Cancels sed when cancel button is clicked ', () => {
    wrapper.find('[data-test-id=\'a-buc-c-sedstart__cancel-button-id\']').hostNodes().simulate('click')
    expect(resetSed).toHaveBeenCalled()
  })
})
