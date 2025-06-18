import useWindowDimensions from 'src/components/WindowDimension/WindowDimension'
import { render, cleanup, screen } from '@testing-library/react'

describe('components/WindowDimension/WindowDimension', () => {
  const MockElement: React.FC<any> = () => {
    const { height } = useWindowDimensions()
    return (<div data-testid='mockelement'>{ height }</div>)
  }

  beforeEach(() => {
    render(<MockElement />)
  })

  afterEach(cleanup)

  it('exists', () => {
    expect(screen.getByText('768')).toBeInTheDocument()
  })
})
