import React from 'react'
import Flag from './Flag'

describe('render Flag', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(<Flag />)

    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Sets className from props', () => {
    let wrapper = shallow(<Flag className='TEST-CLASSNAME' />)

    expect(wrapper.find('img').props().className.includes('TEST-CLASSNAME')).toBeTruthy()
  })

  it('Sets src from props', () => {
    let mockProps = {
      flagPath: 'test_FlagPath/',
      country: 'test_Country.',
      extention: 'test_ext'
    }

    let wrapper = shallow(<Flag {...mockProps} />)

    expect(wrapper.find('img').props().src).toEqual('test_FlagPath/test_Country.test_ext')
  })
})
