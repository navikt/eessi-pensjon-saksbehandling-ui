import { mount, ReactWrapper } from 'enzyme'
import { OptionTypeBase } from 'react-select'
import MultipleSelect, { MultipleSelectProps } from './MultipleSelect'

describe('components/MultipleSelect/MultipleSelect', () => {
  let wrapper: ReactWrapper
  const options = [
    { label: 'mockLabel01', value: 'mockValue01' },
    { label: 'mockLabel02', value: 'mockValue02' }
  ] as Array<OptionTypeBase>

  const initialMockProps: MultipleSelectProps<OptionTypeBase> = {
    ariaLabel: 'mockAriaLabel',
    creatable: true,
    disabled: false,
    error: undefined,
    highContrast: false,
    hideSelectedOptions: false,
    id: 'mockMultipleSelectId',
    isLoading: false,
    label: 'mockLabel',
    onSelect: jest.fn(),
    options: options,
    placeholder: 'mockPlaceholder',
    values: [options[1]]
  }

  beforeEach(() => {
    wrapper = mount(<MultipleSelect {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find('c-multipleSelect')).toBeTruthy()
  })

  it('Handling: Triggers onSelect', () => {
    (initialMockProps.onSelect as jest.Mock).mockReset()
    wrapper.find('input').hostNodes().simulate('keyDown', { key: 'ArrowDown' })
    wrapper.find('input').hostNodes().first().simulate('keyDown', { key: 'Enter' })
    expect(initialMockProps.onSelect).toHaveBeenCalledWith([options[1], options[0]])
  })
})
