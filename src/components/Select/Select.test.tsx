import Select from 'components/Select/Select'
import { mount, ReactWrapper } from 'enzyme'
import ReactSelect from 'react-select'

describe('components/Select/Select', () => {
  let wrapper: ReactWrapper
  const initialMockProps = {
    error: undefined
  }

  beforeEach(() => {
    wrapper = mount(<Select {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(ReactSelect)).toBeTruthy()
  })
})
