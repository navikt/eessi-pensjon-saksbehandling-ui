import React from 'react'
import { IndexPage } from './IndexPage'
import ReactTooltip from 'react-tooltip'
ReactTooltip.rebuild = jest.fn()

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})
jest.mock('eessi-pensjon-ui', () => {
  return {
    Dashboard: (props) => <div className='mock-c-dashboard' onClick={() => props.afterLayoutChange()} />
  }
})

describe('pages/IndexPage', () => {
  let wrapper
  const initialMockProps = {
    history: {},
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<IndexPage {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('IndexPage has proper HTML structure', () => {
    expect(wrapper.exists('.p-indexPage')).toBeTruthy()
    expect(wrapper.exists('.mock-c-dashboard')).toBeTruthy()
  })

  it('Layout change triggers a tooltip rebuild', () => {
    wrapper.find('.mock-c-dashboard').simulate('click')
    expect(ReactTooltip.rebuild).toHaveBeenCalled()
  })
})
