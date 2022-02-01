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
  kravDato: undefined,
  kravId: undefined,
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

describe('P_BUC_05 for BUCStart, brukerkontekst', () => {
  let wrapper: ReactWrapper

  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn(),
    onBucChanged: jest.fn()
  }

  /*
    EP 939 - Scenario 1:

    Gitt at saksbehandler navigerer fra PESYS via jordkloden i brukerkontekst
    OG sakstype er ALDER, UFOREP, GENRL, eller OMSORG
    OG saksbehandler velger å opprette en ny BUC
    Så vises P_BUC_05 i nedtrekkslista
    Slik at saksbehandler kan opprette P_BUC_05 i EP
    OG kan bestille SED P8000 i EP for denne BUC-en
   */
  it('EP-939 Scenario 1: Opprette P_BUC_05 - brukerkontekst', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: [],
      pesysContext: constants.BRUKERKONTEKST,
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_05',
      person: undefined
    })
  })

  /*
    EP 939 - Scenario 2:

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
  it('EP-939 Scenario 2: Opprette P_BUC_05 - brukerkontekst - etterlatteytelser (avdøde)**', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: [],
      pesysContext: constants.BRUKERKONTEKST,
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_05',
      person: undefined
    })
  })

  /*
   EP 939 - Scenario 3:

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
  it('EP-939 scenario 3: Opprette P_BUC_05 - brukerkontekst - etterlatteytelser (bruker)', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: [],
      pesysContext: constants.BRUKERKONTEKST,
      sakType: SakTypeMap.BARNEP
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_05',
      person: undefined
    })
  })
})
