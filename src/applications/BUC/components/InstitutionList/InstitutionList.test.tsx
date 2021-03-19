import { mount, ReactWrapper } from 'enzyme'
import { stageSelector } from 'setupTests'
import InstitutionList, { InstitutionListProps } from './InstitutionList'

// InstitutionNames
const defaultSelector = {
  'NO:Mock1': 'Mock 1 institution',
  'NO:Mock2': 'Mock 2 institution'
}

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: InstitutionListProps = {
    institutions: [{
      country: 'NO',
      institution: 'Mock1'
    }, {
      country: 'NO',
      institution: 'Mock2'
    }],
    locale: 'nb'
  } as InstitutionListProps

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<InstitutionList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure with joined type', () => {
    expect(wrapper.find('[data-test-id=\'a-buc-c-institutionlist__div-id\']').hostNodes()).toHaveLength(1)
    expect(wrapper.find('[data-test-id=\'a-buc-c-institutionlist__div-id\']').hostNodes().render().text()).toEqual('Mock1, Mock2')
  })

  it('Render: Has proper HTML structure with separated type', () => {
    wrapper = mount(<InstitutionList {...initialMockProps} type='separated' />)
    expect(wrapper.find('[data-test-id=\'a-buc-c-institutionlist__div-id\']').hostNodes()).toHaveLength(2)
    expect(wrapper.find('[data-test-id=\'a-buc-c-institutionlist__div-id\']').hostNodes().first().render().text()).toEqual('Mock1')
    expect(wrapper.find('[data-test-id=\'a-buc-c-institutionlist__div-id\']').hostNodes().last().render().text()).toEqual('Mock2')
  })
})
