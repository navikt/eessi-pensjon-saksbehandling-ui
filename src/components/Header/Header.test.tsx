import { render, screen } from '@testing-library/react'
import Header, {HeaderProps, HeaderSelector} from './Header'
import {stageSelector} from "src/setupTests";
import mockFeatureToggles from "src/mocks/app/featureToggles";
import { BrowserRouter as Router } from 'react-router-dom';

describe('src/components/Header/Header', () => {
  const initialMockProps: HeaderProps = {
    username: 'testUser'
  }

  const defaultSelector: HeaderSelector = {
    featureToggles: mockFeatureToggles
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    render(
      <Router>
        <Header {...initialMockProps} />
      </Router>
    )
  })

  it('Handling: has proper HTML structure', () => {
    expect(screen.getByText('ui:app-headerTitle' || 'app-headerTitle-gjenny', )).toBeInTheDocument()
    expect(screen.queryByRole('img')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeInTheDocument()
    expect(screen.getByText('ui:app-header-menu-label')).toBeInTheDocument()
    expect(screen.getByText(initialMockProps.username!)).toBeInTheDocument()
  })
})
