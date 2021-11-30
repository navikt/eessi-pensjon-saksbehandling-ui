import { Option } from 'declarations/app'
import { mount, ReactWrapper } from 'enzyme'
import MultipleOption, { MultipleOptionProps } from './MultipleOption'

describe('components/MultipleSelect/MultipleOption', () => {
  let wrapper: ReactWrapper
  const initialMockProps: MultipleOptionProps<Option> = {
    innerRef(): void {},
    // @ts-ignore
    selectProps: {},
    // @ts-ignore
    theme: undefined,
    id: undefined,
    isRtl: false,
    clearValue: jest.fn(),
    getValue: jest.fn(),
    setValue: jest.fn(),
    hasValue: false,
    selectOption: jest.fn(),
    options: [],
    isMulti: true,
    cx: jest.fn(),
    children: undefined,
    label: '',
    type: 'option',
    data: {
      label: 'mockLabel',
      value: 'mockValue'
    },
    getStyles: jest.fn(),
    innerProps: {
      onClick: jest.fn()
    } as any,
    isSelected: false,
    isFocused: false,
    isDisabled: false
  }

  beforeEach(() => {
    wrapper = mount(<MultipleOption {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'c-multipleoption__div-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'c-multipleoption__checkbox-mockId-mockValue\']')).toBeTruthy()
  })

  it('Handling: Triggers innerProps.onClick', () => {
    wrapper.find('[data-test-id=\'c-multipleoption__div-id\']').simulate('click')
    expect(initialMockProps.innerProps.onClick).toHaveBeenCalled()
  })
})
