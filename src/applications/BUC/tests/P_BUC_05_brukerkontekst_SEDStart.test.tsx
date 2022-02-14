import { SEDStart, SEDStartProps, SEDStartSelector } from 'applications/BUC/components/SEDStart/SEDStart'
import { BRUKERKONTEKST } from 'constants/constants'
import { Bucs, SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import personAvdod from 'mocks/person/personAvdod'
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
  let wrapper: ReactWrapper
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
    // does show avdodFnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeFalsy()
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
    // does show avdodFnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeFalsy()
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
