import LoadingImage from 'src/components/Loading/LoadingImage'
import {screen, render} from '@testing-library/react'

describe('components/Loading/LoadingImage', () => {
  it('Render: has proper HTML structure', () => {
    render(<LoadingImage data-testid={'img'}/>)
    expect(screen.getByTestId('img')).toBeInTheDocument()
  })
})

