import SEDStart, { SEDStartProps, SEDStartSelector } from 'src/applications/BUC/components/SEDStart/SEDStart'
import { BRUKERKONTEKST } from 'src/constants/constants'
import { Bucs, SakTypeMap } from 'src/declarations/buc.d'
import { render, screen } from '@testing-library/react'
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
  institutionNames: {},
  institutionList: {},
  kravDato: undefined,
  kravId: undefined,
  loading: {},
  locale: 'nb',
  personAvdods: personAvdod(1),
  pesysContext: BRUKERKONTEKST,
  p6000s: undefined,
  sakId: '123',
  sakType: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedsWithAttachments: {},
  sedList: undefined,
  vedtakId: undefined
}

describe('P_BUC_10 for SEDStart, brukerkontekst,', () => {
  let wrapper: any

  const mockBucList: Bucs = {
    NorwayIsCaseOwner: {
      cdm: "4.2",
      type: 'P_BUC_10',
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
      cdm: "4.2",
      type: 'P_BUC_10',
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
    EP 1047: Scenario 1

    Gitt at saksbehandler har navigert fra krav- eller brukerkontekst
    OG sakstype er ALDER eller UFOREP
    OG saksbehandler har opprettet P_BUC_10
    Så kan saksbehandler bestille P15000
    OG må legge inn kravdato
    OG radioknapp "Krav om" preutfylles basert på hvilken sakstype saksbehandler kommer fra (Alderspensjon eller uføretrygd)
    OG saksbehandler må velge land og mottakerinstitusjon
    Slik at SED P15000 blir automatisk opprettet i Rina
    OG SED P15000 blir preutfylt med nødvendig informasjon (hentet fra Pesys, TPS og frontend)

   */
  it('EP-1047 Scenario 1 (frontend): Brukerkontekst - AP eller UT', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST,
      sakType: SakTypeMap.ALDER,
      sedList: ['P2000', 'P15000'],
      personAvdods: []
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does not show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).not.toBeInTheDocument()
    // does show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeInTheDocument()
    // does show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeInTheDocument()

    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country and krav dato (not prefilled)
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })

  /*
    EP 1045: Scenario 3

    Gitt at saksbehandler har navigert fra krav- eller brukerkontekst
    OG sakstype er GLENLEV eller BARNEP
    OG saksbehandler har opprettet P_BUC_10
    Så kan saksbehandler bestille P15000
    OG må legge inn Avdødes f.nr./d.nr.
    OG må legge inn kravdato
    OG radioknapp "Krav om" preutfylles med "Etterlatteytelser"
    OG saksbehandler må velge land og mottakerinstitusjon
    Slik at SED P15000 blir automatisk opprettet i Rina
    OG SED P15000 kan preutfylles med nødvendig informasjon (hentet fra Pesys, TPS og frontend)
   */
  it('EP-1045 Scenario 3 (frontend): Krav- eller brukerkontekst - etterlatteytelser', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST,
      sakType: SakTypeMap.GJENLEV,
      sedList: ['P2000', 'P15000'],
      personAvdods: []
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does not show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).not.toBeInTheDocument()
    // does show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeInTheDocument()
    // does show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeInTheDocument()

    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs institution and country and avdodFnr and krav dato (not prefilled)
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })
})
