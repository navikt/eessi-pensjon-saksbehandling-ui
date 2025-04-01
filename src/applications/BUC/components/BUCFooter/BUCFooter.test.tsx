
import { stageSelector } from 'src/setupTests'
import BUCFooter, { BUCFooterProps, BUCFooterSelector } from './BUCFooter'
import { render, screen } from '@testing-library/react'

const defaultSelector: BUCFooterSelector = {
  rinaUrl: 'http://mockurl/rinaUrl'
}

describe('applications/BUC/components/BUCFooter/BUCFooter', () => {
  const initialMockProps: BUCFooterProps = {}

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: has proper HTML structure', () => {
    render(<BUCFooter {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCFooter')).toBeInTheDocument()
  })

  it('Render: WaitingPanel shows if no RinaUrl given', () => {
    stageSelector(defaultSelector, { rinaUrl: undefined })
    render(<BUCFooter {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCFooter--waiting-panel')).toBeInTheDocument()
  })
})
