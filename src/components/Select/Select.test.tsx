import { screen, render } from '@testing-library/react'
import Select from 'src/components/Select/Select'

describe('components/Select/Select', () => {
  const initialMockProps = {
    error: undefined,
  }

  it('Render: has proper HTML structure', () => {
    render(<Select {...initialMockProps} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
