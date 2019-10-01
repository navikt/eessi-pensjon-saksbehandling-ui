import React from 'react'
import { IndexPage } from './IndexPage'
jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})
jest.mock('components/Dashboard/Dashboard', () => {
  return () => <div className='mock-c-dashboard' />
})

describe('pages/IndexPage', () => {
  let wrapper
  const initialMockProps = {
    history: {},
    t: jest.fn((translationString) => { return translationString })
  }

  it('Renders', () => {
    wrapper = mount(<IndexPage {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('IndexPage has proper HTML structure', () => {
    wrapper = mount(<IndexPage {...initialMockProps} />)
    expect(wrapper.exists('.p-indexPage')).toBeTruthy()
    expect(wrapper.exists('.mock-c-dashboard')).toBeTruthy()
  })
})
