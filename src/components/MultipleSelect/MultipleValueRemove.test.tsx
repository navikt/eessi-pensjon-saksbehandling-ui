import { screen, render } from '@testing-library/react'
import MultipleValueRemove from './MultipleValueRemove'

describe('components/MultipleSelect/MultipleValueRemove', () => {
  const initialMockProps = {}

  it('Render: match snapshot', () => {
    const { container } = render(<MultipleValueRemove {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<MultipleValueRemove {...initialMockProps} />)
    expect(screen.getByTestId('c-multipleselect-multiplevalueremove')).toBeInTheDocument()
  })
})
