import {
  // createSed,
  getSedList,
  // resetSed,
  setSedList
} from 'src/actions/buc'
import { VEDTAKSKONTEKST } from 'src/constants/constants'
import { Bucs, Sed } from 'src/declarations/buc'
import { fireEvent, render, screen } from '@testing-library/react'
import _ from 'lodash'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockCountryCodes from 'src/mocks/app/countryAndCurrencyCodes'
import personAvdod from 'src/mocks/person/personAvdod'
import mockBucs from 'src/mocks/buc/bucs'
import mockItems from 'src/mocks/joark/items'
import { stageSelector } from 'src/setupTests'
import SEDStart, { SEDStartProps, SEDStartSelector } from './SEDStart'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('src/actions/buc', () => ({
  createReplySed: jest.fn(),
  createSavingAttachmentJob: jest.fn(),
  createSed: jest.fn(),
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
  gettingP6000: false,
  featureToggles: mockFeatureToggles,
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
  let wrapper: any

  const _mockBucs: Bucs = _.keyBy(mockBucs(), 'caseId')
  const mockCurrentBuc: string = '195440'
  const mockFollowUpSeds: Array<Sed> | undefined = _.filter(_mockBucs[mockCurrentBuc].seds, sed => sed.parentDocumentId !== undefined)
  const mockCurrentSed: Sed | undefined = _.find(_mockBucs[mockCurrentBuc].seds, sed => sed.id === mockFollowUpSeds![0].parentDocumentId)
  const initialMockProps: SEDStartProps = {
    aktoerId: '123',
    bucs: _mockBucs,
    currentBuc: mockCurrentBuc,
    initialAttachments: mockItems,
    initialSed: 'P2000',
    onSedCreated: jest.fn(),
    onSedCancelled: jest.fn(),
    currentSed: undefined,
    followUpSeds: undefined
  }

  // State read by CountryDropdown through the shared mocked useSelector
  const countryDropdownState = { bucs: _mockBucs, currentBuc: mockCurrentBuc, countryCodes: mockCountryCodes }

  beforeEach(() => {
    stageSelector(defaultSelector, countryDropdownState)
    wrapper = render(<SEDStart {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByText("buc:form-chooseSed")).toBeTruthy()
  })

  const openCountrySelect = () => {
    const input = wrapper.container.querySelector('input#a_buc_c_sedstart--country-select-id, #a_buc_c_sedstart--country-select-id input')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
  }

  it('Country list: Norway as case owner gets euEftaLand for the BUC CDM version', () => {
    wrapper.unmount()
    wrapper = render(<SEDStart {...initialMockProps} initialSed={undefined} />)
    openCountrySelect()
    // DK is in euEftaLand but not a BUC participant; PT is a participant but not in euEftaLand
    expect(screen.getByText('Danmark')).toBeTruthy()
    expect(screen.queryByText('Portugal')).toBeNull()
  })

  it('Country list: foreign case owner gets only foreign BUC participants', () => {
    wrapper.unmount()
    const foreignOwnedBucs: Bucs = _.cloneDeep(_mockBucs)
    foreignOwnedBucs[mockCurrentBuc].creator = { country: 'SE', institution: 'SE:DEMOSE01', name: 'Swedish institution 01', acronym: 'DEMOSE01' }
    wrapper = render(<SEDStart {...initialMockProps} bucs={foreignOwnedBucs} initialSed={undefined} />)
    openCountrySelect()
    expect(screen.getByText('Portugal')).toBeTruthy()
    expect(screen.queryByText('Danmark')).toBeNull()
  })

  it('Country list: Norway as case owner with P8000 gets only the BUC receiver countries', () => {
    wrapper.unmount()
    const bucsWithDeltakere: Bucs = _.cloneDeep(_mockBucs)
    ;(bucsWithDeltakere[mockCurrentBuc] as any).deltakere = []
    stageSelector(defaultSelector, { ...countryDropdownState, institutionNames: undefined, sedList: ['P8000'] })
    wrapper = render(<SEDStart {...initialMockProps} bucs={bucsWithDeltakere} initialSed={undefined} />)
    openCountrySelect()
    // Receiver countries are also preselected, so Portugal appears both as value and option
    expect(screen.getAllByText('Portugal').length).toBeGreaterThan(0)
    expect(screen.queryByText('Danmark')).toBeNull()
  })

  it('Country list: Norway as case owner falls back to BUC participants when the CDM version has no country codes', () => {
    wrapper.unmount()
    const cdm44Bucs: Bucs = _.cloneDeep(_mockBucs)
    cdm44Bucs[mockCurrentBuc].cdm = '4.4'
    stageSelector(defaultSelector, { ...countryDropdownState, bucs: cdm44Bucs })
    wrapper = render(<SEDStart {...initialMockProps} bucs={cdm44Bucs} initialSed={undefined} />)
    openCountrySelect()
    expect(screen.getByText('Portugal')).toBeTruthy()
    expect(screen.queryByText('Danmark')).toBeNull()
  })

  it('UseEffect: getSedList with no currentSed ', () => {
    (getSedList as jest.Mock).mockReset()
    wrapper = render(<SEDStart {...initialMockProps} />)
    expect(getSedList).toHaveBeenCalledWith(initialMockProps.bucs[initialMockProps.currentBuc])
  })

  it('UseEffect: getSedList with valid replySed ', () => {
    (setSedList as jest.Mock).mockReset()
    wrapper = render(<SEDStart {...initialMockProps} followUpSeds={mockFollowUpSeds} currentSed={mockCurrentSed} />)
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
    stageSelector(defaultSelector, { ...countryDropdownState, sed: mockSed })
    wrapper = render(<SEDStart {...initialMockProps} initialSendingAttachments={true} initialAttachments={mockItems} />)
    expect(createSavingAttachmentJob).toHaveBeenCalled()
  }) */

/*  it('Handling: with a BUC with SEDs that have NO participants, demand a institution', () => {
    const mockBucsWithNoParticipants: Bucs = _.keyBy(mockBucs(), 'caseId')
    mockBucsWithNoParticipants[initialMockProps.currentBuc!].institusjon = []
    mockBucsWithNoParticipants[initialMockProps.currentBuc!].seds = []
    wrapper = render(<SEDStart {...initialMockProps} bucs={mockBucsWithNoParticipants} />)
    expect(screen.getByTestId('a_buc_c_sedstart--feiloppsummering-id')).toBeFalsy()
    wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })

  it('Handling: with a BUC with SEDs that have participants, no need to demand a institution', () => {
    wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    expect(screen.getByTestId('a_buc_c_sedstart--feiloppsummering-id')).toBeFalsy()
  })

  it('Handling: Creates sed when forward button is clicked ', () => {
    wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    expect(createSed).toHaveBeenCalledWith(_mockBucs[mockCurrentBuc], {
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
    wrapper.find('[data-testid=\'a_buc_c_sedstart--cancel-button-id').hostNodes().simulate('click')
    expect(resetSed).toHaveBeenCalled()
  })*/
})
