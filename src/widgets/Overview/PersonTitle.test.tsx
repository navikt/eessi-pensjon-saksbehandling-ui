import React from 'react'
import PersonTitle, { PersonTitleProps, Title } from './PersonTitle'
import { mount, ReactWrapper } from 'enzyme'
import mockPerson from 'mocks/app/person'

describe('widgets/Overview/PersonTitle', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonTitleProps = {
    gettingPersonInfo: false,
    person: mockPerson.person
  }

  beforeEach(() => {
    wrapper = mount(<PersonTitle {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: waiting spinner if no person is given', () => {
    wrapper = mount(<PersonTitle {...initialMockProps} person={undefined} />)
    expect(wrapper.exists('PersonLoading')).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(Title)).toBeTruthy()
    expect(wrapper.find(Title).find('img').props().alt).toEqual('nav-woman-icon')
    expect(wrapper.find(Title).find('h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (89) - 27072942618')
  })

  it('Render: different person icons', () => {
    mockPerson.person.kjoenn.kjoenn.value = 'M'
    wrapper.setProps({ person: mockPerson.person })
    expect(wrapper.find('[data-test-id=\'w-persontitle__img\']').props().alt).toEqual('nav-man-icon')

    mockPerson.person.kjoenn.kjoenn.value = 'X'
    wrapper.setProps({ person: mockPerson.person })
    expect(wrapper.find('[data-test-id=\'w-persontitle__img\']').props().alt).toEqual('nav-unknown-icon')

    mockPerson.person.kjoenn.kjoenn.value = 'K'
    wrapper.setProps({ person: mockPerson.person })
    expect(wrapper.find('[data-test-id=\'w-persontitle__img\']').props().alt).toEqual('nav-woman-icon')
  })
})
