import React from 'react'
import { FirstPage } from './FirstPage'
jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})

describe('pages/FirstPage', () => {
  let wrapper
  const initialMockProps = {
    history: {
      push: jest.fn()
    },
    t: jest.fn((translationString) => { return translationString })
  }

  it('Renders', () => {
    wrapper = mount(<FirstPage {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('FirstPage has proper HTML structure', () => {
    wrapper = mount(<FirstPage {...initialMockProps} />)
    expect(wrapper.exists('.p-firstPage')).toBeTruthy()
    wrapper.find('.forwardButton').hostNodes().simulate('click')
    expect(initialMockProps.history.push).toHaveBeenCalledWith({
      pathname: '/_/pinfo',
      search: ''
    })
  })
})
