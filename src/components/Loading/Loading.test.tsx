import LoadingImage from 'src/components/Loading/LoadingImage'
import LoadingText from 'src/components/Loading/LoadingText'
import {screen, render} from '@testing-library/react'

describe('components/Loading/LoadingImage', () => {
  it('Render: match snapshot', () => {
    const { container } = render(<LoadingImage />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<LoadingImage data-testid={'img'}/>)
    expect(screen.getByTestId('img')).toBeInTheDocument()
  })
})

describe('components/Loading/LoadingText', () => {
  it('Render: match snapshot', () => {
    const { container } = render(<LoadingText />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<LoadingText data-testid={'txt'}/>)
    expect(screen.getByTestId('txt')).toBeInTheDocument()
  })
})
