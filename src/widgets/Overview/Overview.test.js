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
    person: samplePerson.person,
    t: jest.fn((translationString) => { return translationString })
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
    expect(wrapper.exists('.w-person')).toBeTruthy()
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('PersonHeader')).toBeTruthy()
    expect(wrapper.exists('PersonBody')).toBeFalsy()

    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(wrapper.exists('PersonBody')).toBeTruthy()
  })
})
