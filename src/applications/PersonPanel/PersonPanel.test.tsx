import { render, screen } from '@testing-library/react'
import { getPersonAvdodInfo, getPersonInfo } from 'src/actions/person'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'src/constants/constants'

import mockFeatureToggles from 'src/mocks/app/featureToggles'
import personAvdod from 'src/mocks/person/personAvdod'
import { stageSelector } from 'src/setupTests'
import { PersonPanel, PersonPanelSelector } from './PersonPanel'

jest.mock('src/actions/person', () => ({
  getPersonInfo: jest.fn(),
  getPersonAvdodInfo: jest.fn()
}))

describe('src/applications/PersonPanel/PersonPanel', () => {
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
  })
})
