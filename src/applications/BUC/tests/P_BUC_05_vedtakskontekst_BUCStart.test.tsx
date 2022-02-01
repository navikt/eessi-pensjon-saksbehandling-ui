import { createBuc } from 'actions/buc'
import BUCStart, { BUCStartProps, BUCStartSelector } from 'applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app'
import { SakTypeMap } from 'declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockPersonAvdods from 'mocks/person/personAvdod'
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
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  kravDato: undefined,
  kravId: undefined,
  newlyCreatedBuc: undefined,
  personPdl: undefined,
  personAvdods: [],
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  subjectAreaList: mockSubjectAreaList,
  tagList: mockTagsList
}

describe('P_BUC_05 for BUCStart, vedtakskontekst', () => {
  let wrapper: ReactWrapper

  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn(),
    onBucChanged: jest.fn()
  }

  /*
    EP 943 - Scenario 1:

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
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // do not show avdod fnr select
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
    EP 943 - Scenario 2:

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
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      avdod: mockPersonAvdods(1)![0],
      buc: 'P_BUC_05',
      person: undefined
    })
  })

  /*
   EP 943 - Scenario 3:

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
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: mockPersonAvdods(2),
      pesysContext: constants.VEDTAKSKONTEKST,
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
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseAvdod'
    )
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()
  })
})
