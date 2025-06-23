import { Option } from 'src/declarations/app'
import { render, screen } from '@testing-library/react'
import MultipleOption, { MultipleOptionProps } from './MultipleOption'

describe('components/MultipleSelect/MultipleOption', () => {
  const initialMockProps: MultipleOptionProps<Option> = {
    innerRef (): void {},
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

  it('Render: has proper HTML structure', () => {
    render(<MultipleOption {...initialMockProps} />)
    expect(screen.getByTestId('c-multipleoption--checkbox--mockValue')).toBeInTheDocument()
  })

  it('Handling: Triggers innerProps.onClick', () => {
    render(<MultipleOption {...initialMockProps} />)
    screen.getByTestId('c-multipleoption--checkbox--mockValue').click()
    expect(initialMockProps.innerProps.onClick).toHaveBeenCalled()
  })
})
