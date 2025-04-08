import MultipleValueLabel from 'src/components/MultipleSelect/MultipleValueLabel'
import { screen, render } from '@testing-library/react'

describe('components/MultipleSelect/MultipleValueLabel', () => {
  const initialMockProps = {
    data: {
      label: 'mockLabel'
    }
  }

  it('Render: has proper HTML structure', () => {
    render(<MultipleValueLabel {...initialMockProps} />)
    expect(screen.getByTestId('c-multipleselect-multivaluelabel')).toBeInTheDocument()
    expect(screen.getByTestId('c-multipleselect-multivaluelabel')).toHaveTextContent(
      initialMockProps.data.label
    )
  })
})
