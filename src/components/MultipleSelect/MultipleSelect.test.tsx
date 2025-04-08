import { Option } from 'src/declarations/app.d'
import MultipleSelect, { MultipleSelectProps } from './MultipleSelect'
import {screen, render, fireEvent} from '@testing-library/react'

describe('components/MultipleSelect/MultipleSelect', () => {
  const options = [
    { label: 'mockLabel01', value: 'mockValue01' },
    { label: 'mockLabel02', value: 'mockValue02' }
  ] as Array<Option>

  const initialMockProps: MultipleSelectProps<Option> = {
    ariaLabel: 'mockAriaLabel',
    creatable: true,
    isDisabled: false,
    error: undefined,
    hideSelectedOptions: false,
    id: 'mockMultipleSelectId',
    isLoading: false,
    label: 'mockLabel',
    onSelect: jest.fn(),
    options,
    values: [options[1]]
  }

  it('Render: has proper HTML structure', () => {
    render(<MultipleSelect {...initialMockProps} />)
    expect(screen.getByTestId('c-multipleSelect')).toBeInTheDocument()
  })

  it('Handling: Triggers onSelect', () => {
    render(<MultipleSelect {...initialMockProps} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
    expect(initialMockProps.onSelect).toHaveBeenCalledWith([options[1], options[0]])
  })
})
