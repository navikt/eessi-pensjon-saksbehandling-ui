import LoadingImage, { ImageDiv } from 'components/Loading/LoadingImage'
import LoadingText, { TextDiv } from 'components/Loading/LoadingText'
import { render } from '@testing-library/react'

describe('components/Loading/LoadingImage', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = render(<LoadingImage />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<LoadingImage />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(ImageDiv)).toBeTruthy()
  })
})

describe('components/Loading/LoadingText', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = render(<LoadingText />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<LoadingText />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(TextDiv)).toBeTruthy()
  })
})
