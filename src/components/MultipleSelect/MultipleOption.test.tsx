import { mount, ReactWrapper } from 'enzyme'
import { theme } from 'nav-hoykontrast'
import MultipleOption, { MultipleOptionProps } from './MultipleOption'

describe('components/MultipleSelect/MultipleOption', () => {
  let wrapper: ReactWrapper
  const initialMockProps: MultipleOptionProps = {
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
    innerRef: null,
    data: {
      label: 'mockLabel',
      value: 'mockValue'
    },
    getStyles: jest.fn(),
    selectProps: {
      id: 'mockId',
      selectProps: {
        theme: theme
      }
    },
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
