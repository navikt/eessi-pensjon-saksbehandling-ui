import React from 'react'
import PersonPanel from './PersonPanel'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Overview/PersonPanel', () => {
  let wrapper
  const initialMockProps = {
    aktoerId: '10293847565',
    gettingPersonInfo: false,
    person: samplePerson.person,
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<PersonPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-person-body')).toBeTruthy()
    expect(wrapper.exists('.w-overview-personPanel')).toBeTruthy()
    expect(wrapper.exists('.w-overview-personPanel__title')).toBeTruthy()
    expect(wrapper.find('.w-overview-personPanel__title img').props().kind).toEqual('nav-woman-icon')
    expect(wrapper.find('.w-overview-personPanel__title h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (90) - 27072942618')
  })

  it('gets dates converted properly', () => {
    const newSivilstand = {
      sivilstand: {
        value: 'MOCK',
        kodeRef: null,
        kodeverksRef: 'http://nav.no/kodeverk/Kodeverk/Sivilstander'
      },
      fomGyldighetsperiode: '1970-01-01T09:00:00.000+0000',
      tomGyldighetsperiode: '1980-12-31T09:00:00.000+0000',
      endringstidspunkt: null,
      endretAv: null,
      endringstype: null
    }
    const mockProps = {
      t: initialMockProps.t,
      person: {
        ...samplePerson.person,
        sivilstand: newSivilstand
      }
    }
    wrapper = mount(<PersonPanel {...mockProps} />)
    expect(wrapper.find('#w-person-body__element-marital-status').render().text()).toEqual('ui:marital-status: MOCK (1970-1-1 - 1980-12-31)')
  })
})
