import { within } from '@testing-library/dom'
import { createBuc } from 'actions/buc'
import BUCStart, { BUCStartProps, BUCStartSelector } from 'applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app'
import { SakTypeMap } from 'declarations/buc.d'
import { fireEvent, render, screen } from '@testing-library/react'
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
  let wrapper: any

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

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = within(screen.getByTestId('a_buc_c_BUCStart--buc-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })

    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // do not show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
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

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
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

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).toBeInTheDocument()
    expect(wrapper.find('[data-testid=\'a_buc_c_BUCStart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseAvdod'
    )
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()
  })
})
