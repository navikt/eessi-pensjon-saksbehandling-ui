import { render } from '@testing-library/react'
import PersonTitle, { PersonTitleProps } from './PersonTitle'

import mockPerson from 'src/mocks/person/personPdl'
import {HStack} from "@navikt/ds-react";

describe('applications/PersonPanel/PersonTitle', () => {
  let wrapper: any

  const initialMockProps: PersonTitleProps = {
    gettingPersonInfo: false,
    person: mockPerson
  }

  beforeEach(() => {
    wrapper = render(<PersonTitle {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(HStack)).toBeTruthy()
    expect(wrapper.find(HStack).find('img').props().alt).toEqual('nav-man-icon')
    expect(wrapper.find(HStack).find('h2').render().text()).toEqual('LEALAUS SAKS (41) - personFnr')
  })

  it('Render: different person icons', () => {
    mockPerson.kjoenn.kjoenn = 'MANN'
    wrapper.setProps({ person: mockPerson })
    expect(wrapper.find('[data-testid=\'w-persontitle--img\']').props().alt).toEqual('nav-man-icon')

    mockPerson.kjoenn.kjoenn = 'UKJENT'
    wrapper.setProps({ person: mockPerson })
    expect(wrapper.find('[data-testid=\'w-persontitle--img\']').props().alt).toEqual('nav-unknown-icon')

    mockPerson.kjoenn.kjoenn = 'KVINNE'
    wrapper.setProps({ person: mockPerson })
    expect(wrapper.find('[data-testid=\'w-persontitle--img\']').props().alt).toEqual('nav-woman-icon')
  })
})
