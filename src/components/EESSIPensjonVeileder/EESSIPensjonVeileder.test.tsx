import { render, screen } from '@testing-library/react'
import EESSIPensjonVeileder from './EESSIPensjonVeileder'

describe('components/EESSIPensjonVeileder/EESSIPensjonVeileder', () => {
  it('Render: chooses veileder correctly - smilende', () => {
    render(<EESSIPensjonVeileder mood='smilende' />)
    const veileder = screen.getByTestId('c-eessipensjonveileder')
    expect(veileder).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'nav-smilende-veileder')
  })

  it('Render: chooses veileder correctly - trist', () => {
    render(<EESSIPensjonVeileder mood='trist' />)
    const veileder = screen.getByTestId('c-eessipensjonveileder')
    expect(veileder).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'nav-trist-veileder')
  })
})
