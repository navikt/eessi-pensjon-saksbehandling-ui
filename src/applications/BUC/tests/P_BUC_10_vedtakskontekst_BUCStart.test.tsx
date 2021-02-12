import { createBuc } from 'actions/buc'
import BUCStart, { BUCStartProps, BUCStartSelector } from 'applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app'
import { SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import mockTagsList from 'mocks/buc/tagsList'
import React from 'react'
import { stageSelector } from 'setupTests'
import mockPersonAvdods from 'mocks/app/personAvdod'

jest.mock('actions/buc', () => ({
  cleanNewlyCreatedBuc: jest.fn(),
  createBuc: jest.fn(),
  fetchKravDato: jest.fn()
}))

const defaultSelector: BUCStartSelector = {
  bucList: [],
  bucParam: undefined,
  bucs: {},
  bucsInfo: undefined,
  currentBuc: undefined,
  featureToggles: mockFeatureToggles,
  highContrast: false,
  kravId: '123',
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  newlyCreatedBuc: undefined,
  person: undefined,
  personAvdods: [],
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  subjectAreaList: mockSubjectAreaList,
  tagList: mockTagsList
}

describe('P_BUC_10 for BUCStart, vedtakkontekst', () => {
  let wrapper: ReactWrapper

  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn(),
    onBucChanged: jest.fn()
  }

  /*
    EP 1048 - Scenario 2:

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
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucList: ['P_BUC_02', 'P_BUC_10'],
      personAvdods: [],
      pesysContext: constants.VEDTAKSKONTEKST,
      sakType: SakTypeMap.ALDER
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_10 - buc:buc-P_BUC_10',
      value: 'P_BUC_10'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-input-id\']')).toBeTruthy()
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__avdod-input-id\']').hostNodes().simulate('change', { target: { value: '12345678901' } })

    // show kravDato
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeTruthy()
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']').hostNodes().simulate('change', { target: { value: '01-01-2000' } })
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_10',
      person: undefined,
      avdodfnr: '12345678901',
      kravDato: '2000-01-01'
    })
  })

  /*
    EP 1046 - Scenario 4a:

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
  it('Scenario 4 a (frontend): Vedtakskontekst - etterlatteytelser - én avdøde', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucList: ['P_BUC_02', 'P_BUC_10'],
      personAvdods: mockPersonAvdods(1),
      pesysContext: constants.VEDTAKSKONTEKST,
      sakType: SakTypeMap.GJENLEV
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_10 - buc:buc-P_BUC_10',
      value: 'P_BUC_10'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeTruthy()
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']').hostNodes().simulate('change', { target: { value: '15-12-2020' } })
    wrapper.update()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      avdod: mockPersonAvdods(1)![0],
      kravDato: '2020-12-15',
      buc: 'P_BUC_10',
      person: undefined
    })
  })

  /*
    EP 1046 - Scenario 4b:

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
  it('Scenario 4 a (frontend): Vedtakskontekst - etterlatteytelser - to avdøde', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucList: ['P_BUC_02', 'P_BUC_10'],
      personAvdods: mockPersonAvdods(2),
      pesysContext: constants.VEDTAKSKONTEKST,
      sakType: SakTypeMap.GJENLEV
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_10 - buc:buc-P_BUC_10',
      value: 'P_BUC_10'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeTruthy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseAvdod' + 'buc:validation-chooseKravDato'
    )
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()
  })
})
