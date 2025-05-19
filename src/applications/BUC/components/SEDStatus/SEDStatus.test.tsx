import { render, screen } from '@testing-library/react'
import SEDStatus, { SEDStatusProps } from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {

  const initialMockProps: SEDStatusProps = {
    status: 'new'
  }

  it('Render: has proper HTML structure for sent status', () => {
    render(<SEDStatus {...initialMockProps} status='sent' />)
    expect(screen.getByText("buc:status-sent")).toBeTruthy()
  })
})
