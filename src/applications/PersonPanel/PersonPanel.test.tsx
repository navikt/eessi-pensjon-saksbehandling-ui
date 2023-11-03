import { render, screen } from '@testing-library/react'
import { getPersonAvdodInfo, getPersonInfo } from 'actions/person'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'

import mockFeatureToggles from 'mocks/app/featureToggles'
import personAvdod from 'mocks/person/personAvdod'
import { stageSelector } from 'setupTests'
import { PersonPanel, PersonPanelSelector } from './PersonPanel'

jest.mock('actions/app', () => ({
  getPersonInfo: jest.fn(),
  getPersonAvdodInfo: jest.fn()
}))

describe('applications/PersonPanel/PersonPanel', () => {
  let wrapper: any

  const defaultSelector: PersonPanelSelector = {
    aktoerId: '123',
    avdodAktoerId: undefined,
    featureToggles: {
      ...mockFeatureToggles,
      NR_AVDOD: 1
    },
    gettingPersonInfo: false,
    locale: 'nb',
    personPdl: undefined,
    personAvdods: personAvdod(1),
    pesysContext: VEDTAKSKONTEKST,
    vedtakId: '345'
  }
  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<PersonPanel />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<PersonPanel />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('UseEffect: fetches person info when mounting: VEDTAKSKONTEKST', () => {
    expect(getPersonAvdodInfo).toHaveBeenCalled()
  })

  it('UseEffect: fetches person info when mounting: not VEDTAKSKONTEKST', () => {
    (getPersonAvdodInfo as jest.Mock).mockReset();
    (getPersonInfo as jest.Mock).mockReset()
    stageSelector(defaultSelector, { pesysContext: BRUKERKONTEKST })
    wrapper = render(<PersonPanel />)
    expect(getPersonAvdodInfo).not.toHaveBeenCalled()
    expect(getPersonInfo).toHaveBeenCalled()
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId('w-PersonPanel-id')).toBeTruthy()
    expect(wrapper.exists('ExpandingPanel')).toBeTruthy()
    expect(wrapper.exists('PersonTitle')).toBeTruthy()
    expect(wrapper.exists('PersonPanel')).toBeTruthy()
  })

  it('Render: no aktoerId', () => {
    stageSelector(defaultSelector, ({ aktoerId: undefined }))
    wrapper = render(<PersonPanel />)
    expect(screen.getByTestId('w-PersonPanel--alert\']')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'w-PersonPanel--alert\'] .alertstripe--tekst').hostNodes().render().text()).toEqual('message:validation-noAktoerId')
  })
})
