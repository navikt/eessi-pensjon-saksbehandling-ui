import { SEDStart, SEDStartProps, SEDStartSelector } from 'applications/BUC/components/SEDStart/SEDStart'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { Bucs, SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockPersonAvdods from 'mocks/person/personAvdod'
import mockPerson from 'mocks/person/personPdl'
import { stageSelector } from 'setupTests'

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
  let wrapper: ReactWrapper
  const mockBucs: Bucs = {
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
    replySed: undefined
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

    wrapper = mount(<SEDStart {...initialMockProps} />)

    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    const select = wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does not show avdodFnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeFalsy()
    // does not show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    // does not show kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()
    // does not show avdodOrSoker
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
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

    wrapper = mount(<SEDStart {...initialMockProps} />)

    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    const select = wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does show avdodFnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeTruthy()
    // does not show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    // does not show kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()
    // does show avdodOrSoker
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeTruthy()

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
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

    wrapper = mount(<SEDStart {...initialMockProps} />)

    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    const select = wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P8000')
    // does show avdodFnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeTruthy()
    // does not show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    // does not show kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()
    // does show avdodOrSoker
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeTruthy()

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // needs instituion and country
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseInstitution' + 'message:validation-chooseCountry' +
      'message:validation-chooseAvdodOrSoker'
    )
  })
})
