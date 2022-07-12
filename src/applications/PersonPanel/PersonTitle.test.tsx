import { render } from '@testing-library/react'
import PersonTitle, { PersonTitleProps, Title } from './PersonTitle'

import mockPerson from 'mocks/person/personPdl'

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

  it('Render: match snapshot', () => {
    const { container } = render(<PersonTitle {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: waiting spinner if no person is given', () => {
    wrapper = render(<PersonTitle {...initialMockProps} person={undefined} />)
    expect(wrapper.exists('PersonLoading')).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(Title)).toBeTruthy()
    expect(wrapper.find(Title).find('img').props().alt).toEqual('nav-man-icon')
    expect(wrapper.find(Title).find('h2').render().text()).toEqual('LEALAUS SAKS (41) - personFnr')
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
