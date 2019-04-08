import React from 'react'

import TimelineEvent from './TimelineEvent'

describe('Render TimelineEvent', ()=>{
    it('Renders', ()=>{
        let wrapper = shallow(
            <TimelineEvent
                t={arg=>arg}
                event={{content: {type: 'TEST'}}}
                onClick={()=>{}}
            />
        )
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.isEmptyRender()).toEqual(false)
        expect(wrapper.dive().containsMatchingElement({kind: 'TEST'}))
    })

    it('Calls function onClick', ()=>{
        let onClickHandler = jest.fn()
        let wrapper = shallow(
            <TimelineEvent
                t={arg=>arg}
                event={{content: {type: 'TEST'}}}
                onClick={onClickHandler}
            />
        )

        expect(onClickHandler).toHaveBeenCalledTimes(0)
        wrapper.dive().find('.timeline-event-edit-anchor').simulate('click')
        expect(onClickHandler).toHaveBeenCalled()

    })

})
