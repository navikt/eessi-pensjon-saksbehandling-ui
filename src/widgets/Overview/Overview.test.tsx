import { render, screen } from '@testing-library/react'
import { getPersonAvdodInfo, getPersonInfo } from 'actions/person'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'

import mockFeatureToggles from 'mocks/app/featureToggles'
import personAvdod from 'mocks/person/personAvdod'
import { stageSelector } from 'setupTests'
import { Overview, OverviewProps, OverviewSelector } from './Overview'

jest.mock('actions/app', () => ({
  getPersonInfo: jest.fn(),
  getPersonAvdodInfo: jest.fn()
}))

describe('widgets/Overview/Overview', () => {
  let wrapper: any

  const defaultSelector: OverviewSelector = {
    aktoerId: '123',
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

  const initialMockProps: OverviewProps = {
    onUpdate: jest.fn(),
    widget: {
      i: 'i',
      type: 'foo',
      visible: true,
      title: 'foo',
      options: {
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<Overview {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<Overview {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('UseEffect: fetches person info when mounting: VEDTAKSKONTEKST', () => {
    expect(getPersonAvdodInfo).toHaveBeenCalled()
  })

  it('UseEffect: fetches person info when mounting: not VEDTAKSKONTEKST', () => {
    (getPersonAvdodInfo as jest.Mock).mockReset();
    (getPersonInfo as jest.Mock).mockReset()
    stageSelector(defaultSelector, { pesysContext: BRUKERKONTEKST })
    wrapper = render(<Overview {...initialMockProps} />)
    expect(getPersonAvdodInfo).not.toHaveBeenCalled()
    expect(getPersonInfo).toHaveBeenCalled()
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId('w-overview-id')).toBeTruthy()
    expect(wrapper.exists('ExpandingPanel')).toBeTruthy()
    expect(wrapper.exists('PersonTitle')).toBeTruthy()
    expect(wrapper.exists('PersonPanel')).toBeTruthy()
  })

  it('Render: no aktoerId', () => {
    stageSelector(defaultSelector, ({ aktoerId: undefined }))
    wrapper = render(<Overview {...initialMockProps} />)
    expect(screen.getByTestId('w-overview--alert\']')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'w-overview--alert\'] .alertstripe--tekst').hostNodes().render().text()).toEqual('message:validation-noAktoerId')
  })

  it('Handling: Expandable', () => {
    (initialMockProps.onUpdate as jest.Mock).mockReset()
    stageSelector(defaultSelector, ({ aktoerId: '123' }))
    wrapper = render(<Overview {...initialMockProps} />)
    wrapper.find('ExpandingPanel .ekspanderbartPanel--hode').simulate('click')
    expect(initialMockProps.onUpdate).toHaveBeenCalledWith(expect.objectContaining({
      options: {
        collapsed: false
      }
    }))
  })
})
