import React from 'react'
import SedHeader from './SedHeader'

//Not much to test in this component really.
describe('Renders without crashing', ()=>{
    it('Is non-empty and matches snapshot', ()=>{
        let wrapper = shallow(<SedHeader />)

        expect(wrapper.isEmptyRender()).toEqual(false)
        expect(wrapper).toMatchSnapshot()
    })
})