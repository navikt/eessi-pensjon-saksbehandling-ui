import React from 'react'
import OverviewHeader from './OverviewHeader'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Overview/OverviewHeader', () => {
  let wrapper
  const initialMockProps = {
    aktoerId: '10293847565',
    gettingPersonInfo: false,
    t: jest.fn((translationString) => { return translationString }),
    person: samplePerson.person
  }

  beforeEach(() => {
    wrapper = mount(<OverviewHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-overview-header')).toBeTruthy()
    expect(wrapper.exists('.w-overview-header__content')).toBeTruthy()
    expect(wrapper.find('.w-overview-header__content img').props().kind).toEqual('nav-woman-icon')
    expect(wrapper.find('.w-overview-header__content h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (90) - 27072942618')
  })
})
