import useWindowDimensions from 'components/WindowDimension/WindowDimension'
import { render, cleanup, screen } from '@testing-library/react'

describe('components/WindowDimension/WindowDimension', () => {
  const MockElement: React.FC<any> = () => {
    const { height } = useWindowDimensions()
    return (<div data-testid='mockelement' id={'' + height} />)
  }

  beforeEach(() => {
    render(<MockElement />)
  })

  afterEach(cleanup)

  it('exists', () => {
    expect(screen.findByTestId('mockelement')).toHaveAttribute('id', '768')
  })
})
