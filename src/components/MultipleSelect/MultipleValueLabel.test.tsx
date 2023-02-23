import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import { screen, render } from '@testing-library/react'

describe('components/MultipleSelect/MultipleValueLabel', () => {
  const initialMockProps = {
    data: {
      label: 'mockLabel'
    }
  }

  it('Render: match snapshot', () => {
    const { container } = render(<MultipleValueLabel {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<MultipleValueLabel {...initialMockProps} />)
    expect(screen.getByTestId('c-multipleselect-multivaluelabel')).toBeInTheDocument()
    expect(screen.getByTestId('c-multipleselect-multivaluelabel')).toHaveTextContent(
      initialMockProps.data.label
    )
  })
})
