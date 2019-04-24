import React from 'react'

import BucHeader from './BucHeader'

describe('rendering BucHeader', ()=>{
    it('Renders without crashing', ()=>{
        let wrapper = shallow(<BucHeader />)
        expect(wrapper.isEmptyRender()).toEqual(false)
        expect(wrapper).toMatchSnapshot()
    })

    it('Renders child components', ()=>{
        let wrapper = shallow(<BucHeader/>)

        expect(wrapper.exists('Ingress')).toEqual(true)
        expect(wrapper.exists('Normaltekst')).toEqual(true)
        expect(wrapper.exists('FlagList')).toEqual(true)
        expect(wrapper.exists('LenkepanelBase')).toEqual(true)        
    })

    it('Conditionally renders Icons', ()=>{
        let wrapper = shallow(<BucHeader />)

        expect(wrapper.exists({'svg-icon': 'ProblemCircle'})).toEqual(false)
        expect(wrapper.exists({'svg-icon': 'BubbleChat'})).toEqual(false)

        wrapper.setProps({
            merknader:['Merknad'],
            comments: ['Comments']
        })

        expect(wrapper.exists({'svg-icon': 'ProblemCircle'})).toEqual(true)
        expect(wrapper.exists({'svg-icon': 'BubbleChat'})).toEqual(true)
    })

    it('Renders props', ()=>{

        let mockProps = {
            type: 'TEST-TYPE',
            name: 'TEST-NAME',
            dateCreated: 'TEST-DATE',
            countries: ['TEST-COUNTRY'],
        }
        let wrapper = shallow(<BucHeader {...mockProps}/>)

        expect(wrapper.find('Ingress').render().html()).toEqual('TEST-TYPE - TEST-NAME')
        expect(wrapper.find('Normaltekst').render().html()).toEqual('created: TEST-DATE')
        expect(wrapper.find('FlagList').props().countries[0]).toEqual('TEST-COUNTRY')

    })
})

describe('BucHeader logic', ()=>{
    it('Handles onClick and prevent bubbling', ()=>{
        let mockClickHandler = jest.fn()

        let mockEvent = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        }

        let wrapper = shallow(<BucHeader behandlingOnClick={mockClickHandler} />)

        expect(mockClickHandler).toHaveBeenCalledTimes(0)
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(0)
        expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(0)

        wrapper.find('LenkepanelBase').simulate('click', mockEvent)

        expect(mockClickHandler).toHaveBeenCalled()
        expect(mockEvent.preventDefault).toHaveBeenCalled()
        expect(mockEvent.stopPropagation).toHaveBeenCalled()
    })
})
