import React from 'react'
import Flag from './Flag'

describe('components/Flag', () => {
  const mockInitialProps = {
    label: 'mockLabel',
    country: 'xx'
  }

  it('Renders', () => {
    const wrapper = mount(<Flag {...mockInitialProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Sets className from props', () => {
    const wrapper = mount(<Flag {...mockInitialProps} className='TEST-CLASSNAME' />)
    expect(wrapper.find('.c-flag').props().className.includes('TEST-CLASSNAME')).toBeTruthy()
  })

  it('Has proper HTML structure', () => {
    const wrapper = mount(<Flag {...mockInitialProps} flagPath='mockPath/' extension='.extension' />)
    expect(wrapper.find('.c-flag').props().title).toEqual('mockLabel')
    expect(wrapper.find('img').props().alt).toEqual('mockLabel')
    expect(wrapper.find('img').props().src).toEqual('mockPath/xx.extension')
  })
})
