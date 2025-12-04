import SEDStart, { SEDStartProps, SEDStartSelector } from 'src/applications/BUC/components/SEDStart/SEDStart'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'src/constants/constants'
import { Bucs, SakTypeMap } from 'src/declarations/buc.d'
import { render, screen } from '@testing-library/react'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import { stageSelector } from 'src/setupTests'
import mockPersonAvdods from 'src/mocks/person/personAvdod'

jest.mock('actions/buc', () => ({
  createReplySed: jest.fn(),
  createSavingAttachmentJob: jest.fn(),
  createSed: jest.fn(),
  fetchKravDato: jest.fn(),
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
  kravId: '123',
  kravDato: undefined,
  loading: {},
  locale: 'nb',
  p6000s: undefined,
  personAvdods: mockPersonAvdods(1),
  pesysContext: BRUKERKONTEKST,
  sakId: '123',
  sakType: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedsWithAttachments: {},
  sedList: undefined,
  vedtakId: '123'
}

describe('P_BUC_10 for SEDStart, vedtakskontekst,', () => {
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
      addedParams: {
        kravDato: '2020-12-15',
        subject: {
          avdod: {
            fnr: 'personFarFnr'
          },
          gjenlevende: {
            fnr: 'personFnr'
          }
        }
      },
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
      addedParams: {
        kravDato: '2020-12-15',
        subject: {
          avdod: {
            fnr: 'personFarFnr'
          },
          gjenlevende: {
            fnr: 'personFnr'
          }
        }
      },
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
    EP 1048: Scenario 2

    Gitt at saksbehandler har navigert fra vedtakskontekst
    OG sakstype er ALDER eller UFOREP
    OG saksbehandler har opprettet P_BUC_10
    Så kan saksbehandler bestille P15000
    OG kravdato er preutfylt (kan overskrives av saksbehandler)
    OG radioknapp "Krav om" preutfylles basert på hvilken sakstype saksbehandler kommer fra (Alderspensjon eller uføretrygd)
    OG saksbehandler må velge land og mottakerinstitusjon
    Slik at SED P15000 blir automatisk opprettet i Rina
    OG SED P15000 blir preutfylt med nødvendig informasjon (hentet fra Pesys, TPS og frontend)

   */
  it('EP-1048 Scenario 2 (frontend): Vedtakskontekst - AP eller UT', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: VEDTAKSKONTEKST,
      sakType: SakTypeMap.ALDER,
      sedList: ['P2000', 'P15000'],
      personAvdods: []
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeTruthy()
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
    // does show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).not.toBeInTheDocument()
    // does show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeTruthy()
    // does show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeTruthy()
    // prefills with Alderspensjon
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Alderspensjon')

    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs institution and country (krav dato is prefilled)
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })

  /*
    EP 1046: Scenario 4a

    Gitt at saksbehandler har navigert fra vedtakskontekst
    OG sakstype er GLENLEV eller BARNEP
    OG det er kun én avdøde i vedtaket
    OG saksbehandler velger å opprette P_BUC_10
    Så vises Avdødes f.nr./d.nr. i Start ny BUC-skjermbildet
    OG kravdato er preutfylt (kan overskrives av saksbehandler)
    OG saksbehandler kan opprette P_BUC_10
    SÅ kan saksbehandler bestille P15000
    OG Avdødes f.nr./d.nr. vises (kan ikke endres)
    OG radioknapp "Krav om" preutfylles med "Etterlatteytelser"
    OG saksbehandler må velge land og mottakerinstitusjon
    Slik at SED P15000 blir automatisk opprettet i Rina
    OG SED P15000 blir preutfylt med nødvendig informasjon (hentet fra Pesys, TPS og frontend)

   */
  it('EP-1046 Scenario 4a (frontend): Vedtakskontekst - etterlatteytelser - én avdøde', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: VEDTAKSKONTEKST,
      sakType: SakTypeMap.GJENLEV,
      sedList: ['P2000', 'P15000'],
      personAvdods: mockPersonAvdods(1)
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does show avdodFnr as read-only
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeTruthy()
    // does show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeTruthy()

    // does show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeTruthy()
    // prefills with Etterlatteytelser
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Etterlatteytelser')

    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs institution and country (krav dato is prefilled)
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })

  /*
    EP 1046: Scenario 4b

    Gitt at saksbehandler har navigert fra vedtakskontekst
    OG sakstype er GLENLEV eller BARNEP
    OG det er to avdøde i vedtaket
    OG saksbehandler velger å opprette P_BUC_10
    SÅ må saksbehandler velge hvilken avdøde skal P_BUC_10 opprettes på
    OG kravdato er preutfylt (kan overskrives av saksbehandler)
    OG saksbehandler kan opprette P_BUC_10
    SÅ kan saksbehandler kan bestille P15000
    OG Avdødes f.nr./d.nr. vises (kan ikke endres)
    OG radioknapp "Krav om" preutfylles med "Etterlatteytelser"
    OG saksbehandler må velge land og mottakerinstitusjon
    Slik at SED P15000 blir automatisk opprettet i Rina
    OG SED P15000 blir preutfylt med nødvendig informasjon (hentet fra Pesys, TPS og frontend)

   */
  it('EP-1046 Scenario 4b (frontend): Vedtakskontekst - etterlatteytelser - to avdøde', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: VEDTAKSKONTEKST,
      sakType: SakTypeMap.GJENLEV,
      sedList: ['P2000', 'P15000'],
      personAvdods: mockPersonAvdods(2)
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does show avdodFnr as read-only
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeTruthy()
    // does show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).toBeTruthy()
    // does show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).toBeTruthy()
    // prefills with Etterlatteytelser
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Etterlatteytelser')

    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeFalsy()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs institution and country (krav dato is prefilled)
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })
})
