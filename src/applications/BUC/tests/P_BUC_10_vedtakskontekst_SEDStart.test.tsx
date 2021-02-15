import { SEDStart, SEDStartProps, SEDStartSelector } from 'applications/BUC/components/SEDStart/SEDStart'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'
import { Bucs, SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import React from 'react'
import { stageSelector } from 'setupTests'
import mockPerson from 'mocks/app/person'
import mockPersonAvdods from 'mocks/app/personAvdod'

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
  highContrast: false,
  institutionList: {},
  institutionNames: {},
  kravId: '123',
  kravDato: undefined,
  loading: {},
  locale: 'nb',
  person: mockPerson,
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
  let wrapper: ReactWrapper
  const mockBucList: Bucs = {
    NorwayIsCaseOwner: {
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
    replySed: undefined
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
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does show avdodFnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeFalsy()
    // does show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeTruthy()
    // does show kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeTruthy()
    // prefills with Alderspensjon
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Alderspensjon')

    // does not show avdodOrSoker
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // needs institution and country (krav dato is prefilled)
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseInstitution' + 'buc:validation-chooseCountry'
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
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does show avdodFnr as read-only
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeTruthy()
    // does show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeTruthy()

    // does show kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeTruthy()
    // prefills with Etterlatteytelser
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Etterlatteytelser')

    // does not show avdodOrSoker
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // needs institution and country (krav dato is prefilled)
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseInstitution' + 'buc:validation-chooseCountry'
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
    expect(initialMockProps.onSedChanged).toHaveBeenCalledWith('P15000')
    // does show avdodFnr as read-only
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-div-id\']')).toBeTruthy()
    // does show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeTruthy()
    // does show kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeTruthy()
    // prefills with Etterlatteytelser
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Etterlatteytelser')

    // does not show avdodOrSoker
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdodorsoker-radiogroup-id\']')).toBeFalsy()

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // needs institution and country (krav dato is prefilled)
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseInstitution' + 'buc:validation-chooseCountry'
    )
  })
})
