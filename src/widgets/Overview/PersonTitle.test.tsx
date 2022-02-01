import PersonTitle, { PersonTitleProps, Title } from './PersonTitle'
import { mount, ReactWrapper } from 'enzyme'
import mockPerson from 'mocks/person/personPdl'

describe('widgets/Overview/PersonTitle', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonTitleProps = {
    gettingPersonInfo: false,
    person: mockPerson
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
    expect(wrapper.find(Title).find('img').props().alt).toEqual('nav-man-icon')
    expect(wrapper.find(Title).find('h2').render().text()).toEqual('LEALAUS SAKS (41) - personFnr')
  })

  it('Render: different person icons', () => {
    mockPerson.kjoenn.kjoenn = 'MANN'
    wrapper.setProps({ person: mockPerson })
    expect(wrapper.find('[data-test-id=\'w-persontitle__img\']').props().alt).toEqual('nav-man-icon')

    mockPerson.kjoenn.kjoenn = 'UKJENT'
    wrapper.setProps({ person: mockPerson })
    expect(wrapper.find('[data-test-id=\'w-persontitle__img\']').props().alt).toEqual('nav-unknown-icon')

    mockPerson.kjoenn.kjoenn = 'KVINNE'
    wrapper.setProps({ person: mockPerson })
    expect(wrapper.find('[data-test-id=\'w-persontitle__img\']').props().alt).toEqual('nav-woman-icon')
  })
})
