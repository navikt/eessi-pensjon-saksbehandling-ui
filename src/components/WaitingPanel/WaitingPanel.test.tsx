import { render, screen } from '@testing-library/react'
import WaitingPanel from './WaitingPanel'

describe('components/WaitingPanel/WaitingPanel', () => {
  it('Render: match snapshot', () => {
    const { container } = render(<WaitingPanel message='' />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<WaitingPanel message='testmessage' />)
    expect(screen.getByTestId('c-WaitingPanel')).toBeInTheDocument()
    expect(screen.getByTestId('c-WaitingPanel')).toHaveTextContent('testmessage')
  })
})
