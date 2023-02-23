import { screen, render } from '@testing-library/react'
import Select from 'components/Select/Select'

describe('components/Select/Select', () => {
  const initialMockProps = {
    error: undefined,
  }

  it('Render: match snapshot', () => {
    const { container } = render(<Select {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<Select {...initialMockProps} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
