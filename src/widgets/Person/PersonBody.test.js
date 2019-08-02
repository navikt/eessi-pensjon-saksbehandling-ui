import React from 'react'
import PersonBody from './PersonBody'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Person/PersonBody', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    person: samplePerson.person
  }

  beforeEach(() => {
    wrapper = mount(<PersonBody {...initialMockProps} />)
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
    wrapper = mount(<PersonBody {...mockProps} />)
    expect(wrapper.find('#w-person-body__element-marital-status').render().text()).toEqual('ui:marital-status: MOCK (1970-1-1 - 1980-12-31)')
  })
})
