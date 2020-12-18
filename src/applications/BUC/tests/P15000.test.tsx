import { KRAVKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'
import { Bucs, SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import personAvdod from 'mocks/app/personAvdod'
import React from 'react'
import { stageSelector } from 'setupTests'
import { SEDStart, SEDStartProps, SEDStartSelector } from 'applications/BUC/components/SEDStart/SEDStart'

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
  highContrast: false,
  institutionList: {},
  loading: {},
  locale: 'nb',
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

describe('P15000', () => {
  let wrapper: ReactWrapper
  const mockBucList: Bucs = {
    1: {
      type: 'P_BUC_10',
      readOnly: false,
      caseId: '1',
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
    }
  } as Bucs
  const mockCurrentBuc: string = '1'
  const initialMockProps: SEDStartProps = {
    aktoerId: '123',
    bucs: mockBucList,
    currentBuc: mockCurrentBuc,
    initialAttachments: [],
    onSedCreated: jest.fn(),
    onSedCancelled: jest.fn(),
    currentSed: undefined,
    replySed: undefined
  }

  /*
    EP 1045

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
  it('EP-1045: KRAVKONTEKST, GJENLEV', () => {

    stageSelector(defaultSelector, {
      pesysContext: KRAVKONTEKST,
      sakType: SakTypeMap.GJENLEV,
      sedList: ['P2000', 'P15000'],
      personAvdods: []
    })

    wrapper = mount(<SEDStart {...initialMockProps} />)

    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeFalsy()

    let select = wrapper.find('[data-test-id=\'a-buc-c-sedstart__sed-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })


    wrapper.update()
    // shows avdod fnr
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__avdod-input-id\']')).toBeTruthy()
    // shows krav dato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravDato-input-id\']')).toBeTruthy()
    // shows kravOm
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\']')).toBeTruthy()
    // defaults to Etterlatteytelser

    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__kravOm-radiogroup-id\'] input[aria-checked=true]').props().value).toEqual('Etterlatteytelser')

    wrapper.find('[data-test-id=\'a-buc-c-sedstart__forward-button-id\']').hostNodes().simulate('click')
    // avdodfnr and kravdato on mandatory fields
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseInstitution' + 'buc:validation-chooseCountry' +
      'buc:validation-chooseAvdodFnr' + 'buc:validation-chooseKravDato'
    )

  })
})


/*const mockBucList: Bucs = {
    NorwayIsCaseOwner: {
      type: 'P_BUC_02',
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
      type: 'P_BUC_02',
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
  } as Bucs*/
