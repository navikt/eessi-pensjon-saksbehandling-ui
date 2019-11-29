import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Overview, OverviewProps } from './Overview'

describe('widgets/Overview/Overview', () => {
  let wrapper: ReactWrapper
  const initialMockProps: OverviewProps = {
    actions: {
      getPersonInfo: jest.fn()
    },
    aktoerId: '123',
    highContrast: false,
    locale: 'nb',
    onUpdate: jest.fn(),
    t: jest.fn(t => t),
    widget: {
      options: {
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<Overview {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('UseEffect: fetches person info when mounting', () => {
    expect(initialMockProps.actions.getPersonInfo).toHaveBeenCalled()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-overview')).toBeTruthy()
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('PersonTitle')).toBeTruthy()
    expect(wrapper.exists('PersonPanel')).toBeTruthy()
  })

  it('With no aktoerId', () => {
    wrapper = mount(<Overview {...initialMockProps} aktoerId={undefined} />)
    expect(wrapper.exists('.w-overview__alert')).toBeTruthy()
    expect(wrapper.find('.w-overview__alert').hostNodes().render().text()).toEqual('buc:validation-noAktoerId')
  })

  it('Expandable ', () => {
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(initialMockProps.onUpdate).toHaveBeenCalledWith({
      options: {
        collapsed: true
      }
    })
  })
})
