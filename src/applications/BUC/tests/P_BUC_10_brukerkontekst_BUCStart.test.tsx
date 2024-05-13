import { within } from '@testing-library/dom'
import { createBuc } from 'src/actions/buc'
import BUCStart, { BUCStartProps } from 'src/applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'src/constants/constants'
import { AllowedLocaleString } from 'src/declarations/app'
import { SakTypeMap } from 'src/declarations/buc.d'
import { fireEvent, render, screen } from '@testing-library/react'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockSubjectAreaList from 'src/mocks/buc/subjectAreaList'
import mockTagsList from 'src/mocks/buc/tagsList'
import { stageSelector } from 'src/setupTests'
import {BUCStartSelector} from "src/applications/BUC/components/BUCStart/BUCStartIndex";

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

describe('P_BUC_10 for BUCStart, brukerkontekst', () => {
  let wrapper: any

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
      pesysContext: constants.BRUKERKONTEKST,
      sakType: SakTypeMap.ALDER
    })

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).toBeFalsy()

    // select P_BUC_02
    const select = within(screen.getByTestId('a_buc_c_BUCStart--buc-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })

    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_10 - buc:buc-P_BUC_10',
      value: 'P_BUC_10'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-input-id')).toBeTruthy()
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--avdod-input-id').hostNodes().simulate('change', { target: { value: '12345678901' } })
    wrapper.update()
    // show kravDato
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).toBeTruthy()
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--kravDato-input-id').hostNodes().simulate('change', { target: { value: '01-01-2000' } })
    wrapper.update()

    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_10',
      person: undefined,
      kravDato: '2000-01-01',
      avdodfnr: '12345678901'
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
      pesysContext: constants.BRUKERKONTEKST,
      sakType: SakTypeMap.GJENLEV
    })

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-input-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_10 - buc:buc-P_BUC_10',
      value: 'P_BUC_10'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-input-id')).toBeTruthy()
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--avdod-input-id').hostNodes().simulate('change', { target: { value: '12345678901' } })

    // show kravDato
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).toBeTruthy()
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--kravDato-input-id').hostNodes().simulate('change', { target: { value: '01-01-2000' } })

    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_10',
      person: undefined,
      kravDato: '2000-01-01',
      avdodfnr: '12345678901'
    })
  })
})
