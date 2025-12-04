import SEDStart, { SEDStartProps, SEDStartSelector } from 'src/applications/BUC/components/SEDStart/SEDStart'
import { VEDTAKSKONTEKST } from 'src/constants/constants'
import { Bucs, SakTypeMap } from 'src/declarations/buc.d'
import { render, screen } from '@testing-library/react'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockPersonAvdods from 'src/mocks/person/personAvdod'
import mockPerson from 'src/mocks/person/personPdl'
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
  kravDato: undefined,
  kravId: undefined,
  institutionNames: {},
  institutionList: {},
  loading: {},
  locale: 'nb',
  p6000s: undefined,
  personAvdods: mockPersonAvdods(1),
  pesysContext: VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedsWithAttachments: {},
  sedList: undefined,
  vedtakId: undefined
}

describe('P_BUC_05 for SEDStart, vedtakskontekst,', () => {
  let wrapper: any

  const mockBucs: Bucs = {
    NorwayIsCaseOwner: {
      cdm: "4.2",
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
      addedParams: {
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
      addedParams: {
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
    bucs: mockBucs,
    currentBuc: mockCurrentBuc,
    initialAttachments: [],
    onSedChanged: jest.fn(),
    onSedCreated: jest.fn(),
    onSedCancelled: jest.fn(),
    currentSed: undefined,
    followUpSeds: undefined
  }

  /*
    EP 943 - Scenario 1

    Gitt at saksbehandler navigerer fra vedtakskontekst
    OG EESSI-Pensjon har informasjon om sakId og vedtaksid
    SÅ finner EP (backend) hvilken sakstype denne saken gjelder
    OG sakstype er ALDER, UFOREP, eller OMSORG
    OG det kun er bruker/forsikrede i vedtaket (ingen avdøde)
    OG saksbehandler velger å opprette en ny BUC
    Så vises P_BUC_05 i nedtrekkslista
    Slik at saksbehandler kan opprette P_BUC_05 i EP
    OG kan bestille SED P8000 i EP for denne BUC-en
   */
  it('EP-943 Scenario 1: Opprette P_BUC_05 - vedtakskontekst', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: VEDTAKSKONTEKST,
      sakType: SakTypeMap.ALDER,
      sedList: ['P2000', 'P8000'],
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
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does not show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).not.toBeInTheDocument()
    // does not show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    // does not show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    // does not show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry'
    )
  })

  /*
    EP 943 - Scenario 2

    Gitt at saksbehandler navigerer fra vedtakskontekst
    OG EESSI-Pensjon har informasjon om sakId og vedtaksid
    SÅ finner EP (backend) hvilken sakstype denne saken gjelder
    OG sakstype er GJENLEV, BARNEP, ALDER eller UFØREP
    OG det er én avdøde i vedtaket
    OG saksbehandler velger å opprette en ny BUC
    Så kan saksbehandler velge P_BUC_05 i nedtrekkslista i EP
    OG det vises avdødes navn og fnr/dnr (som i P_BUC_02)
    OG saksbehandler kan bestille P8000
    OG det stilles spørsmål om henvendelsen gjelder den avdøde eller bruker
    Slik at P8000 kan preutfylles med riktig informasjon
   */
  it('EP-943 Scenario 2: Opprette P_BUC_05 - vedtakskontekst - etterlatteytelser (én avdøde)', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: VEDTAKSKONTEKST,
      sakType: SakTypeMap.GJENLEV,
      sedList: ['P2000', 'P8000'],
      person: mockPerson,
      personAvdods: mockPersonAvdods(1)
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeInTheDocument()
    // does not show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    // does not show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    // does show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry' +
       'message:validation-chooseAvdodOrSoker'
    )
  })

  /*
   EP 943 - Scenario 3

    Gitt at saksbehandler navigerer fra vedtakskontekst
    OG EESSI-Pensjon har informasjon om sakId og vedtaksid
    SÅ finner EP (backend) hvilken sakstype denne saken gjelder
    OG sakstype er BARNEP,
    OG det er to avdøde i vedtaket
    OG saksbehandler velger å opprette en ny BUC
    Så kan saksbehandler velge P_BUC_05 i nedtrekkslista i EP
    OG det vises en nedtrekkslite med avdødes navn og fnr/dnr (som i P_BUC_02)
    OG saksbehandler må velge en avdøde
    SÅ kan saksbehandler bestille P8000
    OG det stilles spørsmål om henvendelsen gjelder den avdøde eller bruker
    Slik at P8000 kan preutfylles med riktig informasjon

  */
  it('EP-943 Scenario 3: Opprette P_BUC_05 - vedtakskontekst - barnep (to avdøde)', () => {
    (initialMockProps.onSedChanged as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      pesysContext: VEDTAKSKONTEKST,
      sakType: SakTypeMap.BARNEP,
      sedList: ['P2000', 'P8000'],
      personAvdods: mockPersonAvdods(2)
    })

    wrapper = render(<SEDStart {...initialMockProps} />)

    expect(screen.getByTestId('a_buc_c_sedstart--sed-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).not.toBeInTheDocument()

    const select = wrapper.find('[data-testid=\'a_buc_c_sedstart--sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does show avdodFnr
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedstart--avdod-div-id')).toBeInTheDocument()
    // does not show kravDato
    expect(screen.getByTestId('a_buc_c_sedstart--kravDato-input-id')).not.toBeInTheDocument()
    // does not show kravOm
    expect(screen.getByTestId('a_buc_c_sedstart--kravOm-radiogroup-id')).not.toBeInTheDocument()
    // does show avdodOrSoker
    expect(screen.getByTestId('a_buc_c_sedstart--avdodorsoker-radiogroup-id')).toBeInTheDocument()

    wrapper.find('[data-testid=\'a_buc_c_sedstart--forward-button-id').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-testid=\'a_buc_c_sedstart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry' +
      'message:validation-chooseAvdodOrSoker'
    )
  })
})
