import React from 'react'

import ConnectedModal, { Modal } from './Modal'

import { connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import * as reducers from '../../../reducers'

const reducer = combineReducers({
  ...reducers
})

describe('renders correctly', ()=>{
    it('Renders without crashing', ()=>{

        let mainButtonOnClick = jest.fn()
        let otherButtonOnClick = jest.fn()

        let initialState = {
            ui: {
                modalOpen: true,
                modal: {
                    modalTitle: 'MODALTITLE',
                    modalText: 'MODALTEXT',
                    modalButtons: [{
                      main: true,
                      text: 'MODALMAINBUTTONTEXT',
                      onClick: mainButtonOnClick
                    }, {
                      text: 'MODALOTHERBUTTONTEXT',
                      onClick: otherButtonOnClick
                    }]
                }
            }
        }

        let store = createStore(reducer, initialState)
        let wrapper = shallow(
            <ConnectedModal />,
            {context: { store }}
        )

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.dive().dive().find('#modalTitle').text()).toEqual('MODALTITLE')
        expect(wrapper.dive().dive().find('#modalText').text()).toEqual('MODALTEXT')

        expect(mainButtonOnClick).toHaveBeenCalledTimes(0)
        wrapper.dive().dive().find('#c-ui-modal-main-button').simulate('click')
        expect(mainButtonOnClick).toHaveBeenCalled()

        expect(otherButtonOnClick).toHaveBeenCalledTimes(0)
        wrapper.dive().dive().find('#c-ui-modal-other-button').simulate('click')
        expect(otherButtonOnClick).toHaveBeenCalled()
    })
})
