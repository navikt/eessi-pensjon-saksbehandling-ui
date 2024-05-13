import { within } from '@testing-library/dom'
import { SEDStart, SEDStartProps, SEDStartSelector } from 'src/applications/BUC/components/SEDStart/SEDStart'
import { BRUKERKONTEKST } from 'src/constants/constants'
import { Bucs, SakTypeMap } from 'src/declarations/buc.d'
import { fireEvent, render, screen } from '@testing-library/react'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import personAvdod from 'src/mocks/person/personAvdod'
import { stageSelector } from 'src/setupTests'

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
  featureToggles: mockFeatureToggles,
  gettingP6000: false,
  institutionList: {},
  institutionNames: {},
  kravDato: undefined,
  kravId: undefined,
  loading: {},
  locale: 'nb',
  p6000s: undefined,
  personAvdods: personAvdod(1),
  pesysContext: BRUKERKONTEKST,
  sakId: '123',
  sakType: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedsWithAttachments: {},
  sedList: undefined,
  vedtakId: undefined
}

describe('P_BUC_05 for SEDStart, brukerkontekst,', () => {
  let wrapper: any

  const mockBucList: Bucs = {
    NorwayIsCaseOwner: {
      type: 'P_BUC_05',
      readOnly: false,
      caseId: 'NorwayIsCaseOwner',
      creator: {
        country: 'NO',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07',
        acronym: 'NAVAT07'
      },
      sakType: null,
      status: 'open',
      startDate: 1571818162145,
      lastUpdate: 1571818216000,
      institusjon: [{
        country: 'NO',
        acronym: 'NAVAT07',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07'
      }],
      seds: [],
      error: null
    },
    NorwayIsNOTCaseOwner: {
      type: 'P_BUC_05',
      readOnly: false,
      caseId: 'NorwayIsNOTCaseOwner',
      creator: {
        country: 'SE',
        institution: 'SE:DEMOSE01',
        name: 'SE Demo 01',
        acronym: 'DEMOSE01'
      },
      sakType: null,
      status: 'open',
      startDate: 1571818162145,
      lastUpdate: 1571818216000,
      institusjon: [{
        country: 'NO',
        acronym: 'NAVAT07',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07'
      }, {
        country: 'SE',
        institution: 'SE:DEMOSE01',
        name: 'SE Demo 01',
        acronym: 'DEMOSE01'
      }],
      seds: [],
      error: null
    }
  } as Bucs
  const mockCurrentBuc: string = 'NorwayIsCaseOwner'
  const initialMockProps: SEDStartProps = {
    aktoerId: '123',
    bucs: mockBucList,
    currentBuc: mockCurrentBuc,
    initialAttachments: [],
    onSedChanged: jest.fn(),
    onSedCreated: jest.fn(),
    onSedCancelled: jest.fn(),
    currentSed: undefined,
    followUpSeds: undefined
  }

  /*
    EP 939: Scenario 1

    Gitt at saksbehandler navigerer fra PESYS via jordkloden i brukerkontekst
    OG sakstype er ALDER, UFOREP, GENRL, eller OMSORG
    OG saksbehandler velger å opprette en ny BUC
    Så vises P_BUC_05 i nedtrekkslista
    Slik at saksbehandler kan opprette P_BUC_05 i EP
    OG kan bestille SED P8000 i EP for denne BUC-en
   */
  it('EP-939 Scenario 1: Opprette P_BUC_05 - brukerkontekst', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST,
      sakType: SakTypeMap.ALDER,
      sedList: ['P2000', 'P8000'],
      personAvdods: []
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeFalsy()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does not show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeFalsy()
    // does not show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeFalsy()
    // does not show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeFalsy()
    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeFalsy()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })

  /*
    EP 939 Scenario 2

    Gitt at saksbehandler navigerer fra brukerkontekst
    OG sakstype er GJENLEV eller BARNEP,
    OG saksbehandler velger å opprette en ny BUC
    Så kan saksbehandler velge P_BUC_05 i nedtrekkslista i EP
    OG saksbehandler må legge inn avdødes fnr/dnr
    OG det stilles spørsmål om henvendelsen gjelder den avdøde eller bruker
    OG saksbehandler svarer at henvendelsen gjelder avdøde
    Slik at P_BUC_05 kan opprettes på avdøde i RINA
    OG saksbehandler kan bestille SED P8000
   */
  it('EP-939 Scenario 2: Opprette P_BUC_05 - brukerkontekst - etterlatteytelser (avdøde)', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST,
      sakType: SakTypeMap.GJENLEV,
      sedList: ['P2000', 'P8000'],
      personAvdods: []
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeFalsy()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeFalsy()
    // does not show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeFalsy()
    // does not show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeFalsy()
    // does show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeTruthy()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry' +
      'message:validation-chooseAvdodOrSoker'
    )
  })

  /*
   EP 939 Scenario 3

    Gitt at saksbehandler navigerer fra brukerkontekst
    OG sakstype er GJENLEV eller BARNEP,
    OG saksbehandler velger å opprette en ny BUC
    Så kan saksbehandler velge P_BUC_05 i nedtrekkslista i EP
    OG saksbehandler må legge inn avdødes fnr/dnr
    OG det stilles spørsmål om henvendelsen gjelder den avdøde eller bruker
    OG saksbehandler svarer at henvendelsen gjelder bruker/søker
    Slik at P_BUC_05 kan opprettes på avdøde i RINA
    OG saksbehandler kan bestille SED P8000
  */
  it('EP-939 Scenario 3: Opprette P_BUC_05 - brukerkontekst -etterlatteyteser (bruker)', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST,
      sakType: SakTypeMap.BARNEP,
      sedList: ['P2000', 'P8000'],
      personAvdods: []
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeFalsy()

    const select = within(screen.getByTestId('a_buc_c_sedstart--buc-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })

    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeFalsy()
    // does not show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeFalsy()
    // does not show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeFalsy()
    // does show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeTruthy()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry' +
       'message:validation-chooseAvdodOrSoker'
    )
  })
})
