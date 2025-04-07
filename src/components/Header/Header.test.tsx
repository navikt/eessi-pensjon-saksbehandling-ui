import { render, screen } from '@testing-library/react'
import Header, { HeaderProps } from './Header'

describe('src/components/Header/Header', () => {
  const initialMockProps: HeaderProps = {
    username: 'testUser'
  }

  beforeEach(() => {
    render(<Header {...initialMockProps} />)
  })

  it('Handling: has proper HTML structure', () => {
    expect(screen.getByText('ui:app-headerTitle' || 'app-headerTitle-gjenny', )).toBeInTheDocument()
    expect(screen.queryByRole('img')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeInTheDocument()
    expect(screen.getByText('ui:app-header-menu-label')).toBeInTheDocument()
    expect(screen.getByText(initialMockProps.username!)).toBeInTheDocument()
  })
})
