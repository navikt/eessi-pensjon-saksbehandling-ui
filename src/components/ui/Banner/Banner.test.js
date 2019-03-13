import React from 'react'
import { Banner } from './Banner'

describe('Banner Rendering', () => {
  it('Renders correctly', () => {
    let wrapper = shallow(<Banner header='BANNER' t={arg=>arg}/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper.find('h1').text()).toEqual('BANNER')
    expect(wrapper.children().length).toEqual(2)
  })
})

describe('Banner logic', () => {
  it('HighContrast triggers action', (done)=>{
    let mockActions = { toggleHighContrast: ()=>{
      done()
    }}
    
    let wrapper = shallow(<Banner header='BANNER' t={arg=>arg} actions={mockActions}/>)

    wrapper.find('a').simulate('click')
  })
})
