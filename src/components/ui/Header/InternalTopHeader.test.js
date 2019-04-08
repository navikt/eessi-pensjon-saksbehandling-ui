import React from 'react'
import {InternalTopHeader} from './InternalTopHeader'

describe('render InternalTopHeader', () => {
    it('renders without crashing', ()=>{
        let wrapper = shallow(
            <InternalTopHeader t={arg=>arg} username='testUser'/>
        )
        expect(wrapper).toMatchSnapshot()
    })
})
