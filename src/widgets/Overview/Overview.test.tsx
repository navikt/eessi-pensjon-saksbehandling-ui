import { getPersonAvdodInfo, getPersonInfo } from 'actions/app'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'constants/constants'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import personAvdod from 'mocks/app/personAvdod'
import React from 'react'
import { stageSelector } from 'setupTests'
import { Overview, OverviewProps, OverviewSelector } from './Overview'

jest.mock('actions/app', () => ({
  getPersonInfo: jest.fn(),
  getPersonAvdodInfo: jest.fn()
}))

describe('widgets/Overview/Overview', () => {
  let wrapper: ReactWrapper

  const defaultSelector: OverviewSelector = {
    aktoerId: '123',
    featureToggles: {
      ...mockFeatureToggles,
      NR_AVDOD: 1
    },
    gettingPersonInfo: false,
    locale: 'nb',
    person: undefined,
    personAvdods: personAvdod(1),
    pesysContext: VEDTAKSKONTEKST,
    vedtakId: '345'
  }

  const initialMockProps: OverviewProps = {
    highContrast: false,
    onUpdate: jest.fn(),
    skipMount: false,
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
    wrapper = mount(<Overview {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: fetches person info when mounting: VEDTAKSKONTEKST', () => {
    expect(getPersonAvdodInfo).toHaveBeenCalled()
  })

  it('UseEffect: fetches person info when mounting: not VEDTAKSKONTEKST', () => {
    (getPersonAvdodInfo as jest.Mock).mockReset();
    (getPersonInfo as jest.Mock).mockReset()
    stageSelector(defaultSelector, { pesysContext: BRUKERKONTEKST })
    wrapper = mount(<Overview {...initialMockProps} />)
    expect(getPersonAvdodInfo).not.toHaveBeenCalled()
    expect(getPersonInfo).toHaveBeenCalled()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'w-overview-id\']')).toBeTruthy()
    expect(wrapper.exists('ExpandingPanel')).toBeTruthy()
    expect(wrapper.exists('PersonTitle')).toBeTruthy()
    expect(wrapper.exists('PersonPanel')).toBeTruthy()
  })

  it('Render: no aktoerId', () => {
    stageSelector(defaultSelector, ({ aktoerId: undefined }))
    wrapper = mount(<Overview {...initialMockProps} />)
    expect(wrapper.exists('[data-test-id=\'w-overview__alert\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'w-overview__alert\'] .alertstripe__tekst').hostNodes().render().text()).toEqual('buc:validation-noAktoerId')
  })

  it('Handling: Expandable', () => {
    (initialMockProps.onUpdate as jest.Mock).mockReset()
    stageSelector(defaultSelector, ({ aktoerId: '123' }))
    wrapper = mount(<Overview {...initialMockProps} skipMount />)
    wrapper.find('ExpandingPanel .ekspanderbartPanel__hode').simulate('click')
    expect(initialMockProps.onUpdate).toHaveBeenCalledWith(expect.objectContaining({
      options: {
        collapsed: false
      }
    }))
  })
})
