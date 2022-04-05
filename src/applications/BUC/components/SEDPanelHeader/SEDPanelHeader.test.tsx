import { render, screen } from '@testing-library/react'
import SEDPanelHeader from './SEDPanelHeader'

describe('applications/BUC/components/SEDPanelHeader/SEDPanelHeader', () => {
  it('Render: match snapshot', () => {
    const { container } = render(<SEDPanelHeader />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<SEDPanelHeader />)
    expect(screen.getByTestId('a_buc_c_SEDPanelHeader--sed')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_SEDPanelHeader--sender')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_SEDPanelHeader--receiver')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_SEDPanelHeader--actions')).toBeInTheDocument()
  })
})
