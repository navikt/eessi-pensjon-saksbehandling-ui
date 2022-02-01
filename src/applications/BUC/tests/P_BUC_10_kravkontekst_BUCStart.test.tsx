import { createBuc } from 'actions/buc'
import BUCStart, { BUCStartProps, BUCStartSelector } from 'applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app'
import { SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import mockTagsList from 'mocks/buc/tagsList'
import { stageSelector } from 'setupTests'

jest.mock('actions/buc', () => ({
  cleanNewlyCreatedBuc: jest.fn(),
  createBuc: jest.fn()
}))

const defaultSelector: BUCStartSelector = {
  bucOptions: [],
  bucParam: undefined,
  bucs: {},
  bucsInfo: undefined,
  currentBuc: undefined,
  featureToggles: mockFeatureToggles,
  kravId: '123',
  kravDato: undefined,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  newlyCreatedBuc: undefined,
  personPdl: undefined,
  personAvdods: [],
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  subjectAreaList: mockSubjectAreaList,
  tagList: mockTagsList
}

describe('P_BUC_10 for BUCStart, kravkontekst', () => {
  let wrapper: ReactWrapper

  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn(),
    onBucChanged: jest.fn()
  }

  /*
    EP 1047 - Scenario 1:

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
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_10'],
      personAvdods: [],
      pesysContext: constants.KRAVKONTEKST,
      sakType: SakTypeMap.ALDER
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-input-id\']')).toBeFalsy()
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
    EP 1045 - Scenario 3:

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
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_10'],
      personAvdods: [],
      pesysContext: constants.KRAVKONTEKST,
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
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-input-id\']')).toBeTruthy()
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__avdod-input-id\']').hostNodes().simulate('change', { target: { value: '12345678901' } })

    // keep kravDato input hidden
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
})
