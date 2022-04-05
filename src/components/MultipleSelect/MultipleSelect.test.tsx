import { Option } from 'declarations/app.d'
import MultipleSelect, { MultipleSelectProps } from './MultipleSelect'
import { render } from '@testing-library/react'

describe('components/MultipleSelect/MultipleSelect', () => {
  let wrapper: any

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

  beforeEach(() => {
    wrapper = render(<MultipleSelect {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<MultipleSelect {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
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
