import React from 'react'
import { Overview } from './Overview'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Overview/Overview', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      getPersonInfo: jest.fn()
    },
    aktoerId: '123',
    locale: 'nb',
    onUpdate: jest.fn(),
    person: samplePerson.person,
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      options: {
        collapsed: false,
        tabIndex: 0
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
    expect(wrapper.exists('PersonPanel')).toBeTruthy()
    expect(wrapper.exists('VarslerPanel')).toBeFalsy()

    wrapper.find('EkspanderbartpanelBase button.ekspanderbartPanel__hode').hostNodes().simulate('click')
    expect(wrapper.exists('PersonPanel')).toBeFalsy()
  })
})
