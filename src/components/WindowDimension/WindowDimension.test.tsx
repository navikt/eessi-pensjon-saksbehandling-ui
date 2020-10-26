import useWindowDimensions from 'components/WindowDimension/WindowDimension'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'

describe('components/WindowDimension/WindowDimension', () => {
  const MockElement: React.FC<any> = () => {
    const { height } = useWindowDimensions()
    return (<div data-test-id='mockelement' id={'' + height} />)
  }

  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<MockElement />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('', () => {
    expect(wrapper.find('[data-test-id=\'mockelement\']').props().id).toEqual('768')
  })
})
