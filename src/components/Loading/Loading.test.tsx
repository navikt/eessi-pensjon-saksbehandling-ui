import LoadingImage, { ImageDiv } from 'components/Loading/LoadingImage'
import { TextDiv } from 'components/Loading/LoadingText'
import { mount, ReactWrapper } from 'enzyme'

describe('components/Loading/LoadingImage', () => {
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<LoadingImage />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(ImageDiv)).toBeTruthy()
  })
})

describe('components/Loading/LoadingText', () => {
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<LoadingImage />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(TextDiv)).toBeTruthy()
  })
})
