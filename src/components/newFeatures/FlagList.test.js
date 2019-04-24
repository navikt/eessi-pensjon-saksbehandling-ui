import React from 'react'
import FlagList from './FlagList'


const defaultMockProps = {
    countries: ['NO', 'SE', 'DK'],
    overflowLimit: 2,
    flagPath: '/mock/path',
    extention: 'dummy'
}

describe('Renders FlagList', ()=>{

    it('renders without crashing', ()=>{
        let wrapper = shallow(<FlagList {...defaultMockProps} />)

        expect(wrapper.isEmptyRender()).toEqual(false)
        expect(wrapper).toMatchSnapshot()
    })

    it('renders correct number of flags', ()=>{
        let wrapper = shallow(<FlagList {...defaultMockProps} />)

        expect(wrapper.find('Flag').length).toEqual(2)
        expect(wrapper.exists('span')).toEqual(true)
        expect(wrapper.find('span').render().html()).toEqual('+1')
        
        wrapper.setProps({overflowLimit: 3})
        
        expect(wrapper.find('Flag').length).toEqual(3)
        expect(wrapper.exists('span')).toEqual(false)
    })

    it('Assigns props to Flag', ()=>{
        let wrapper = shallow(<FlagList {...defaultMockProps} />)

        wrapper.find('Flag').forEach( (flag, index) => {
            expect(flag.props().flagPath).toEqual(defaultMockProps.flagPath)
            expect(flag.props().country).toEqual(defaultMockProps.countries[index])
            expect(flag.props().extention).toEqual(defaultMockProps.extention)
        })
    })
})