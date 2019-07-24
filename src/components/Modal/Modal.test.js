import React from 'react'

import Modal from './Modal'

describe('renders correctly', () => {
  it('Renders without crashing', () => {
    let mainButtonOnClick = jest.fn()
    let otherButtonOnClick = jest.fn()

    let wrapper = shallow(
      <Modal />
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.dive().dive().find('#modalTitle').text()).toEqual('MODALTITLE')
    expect(wrapper.dive().dive().find('#modalText').text()).toEqual('MODALTEXT')

    expect(mainButtonOnClick).toHaveBeenCalledTimes(0)
    wrapper.dive().dive().find('#c-modal-main-button').simulate('click')
    expect(mainButtonOnClick).toHaveBeenCalled()

    expect(otherButtonOnClick).toHaveBeenCalledTimes(0)
    wrapper.dive().dive().find('#c-modal-other-button').simulate('click')
    expect(otherButtonOnClick).toHaveBeenCalled()
  })
})
