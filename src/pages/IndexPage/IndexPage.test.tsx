import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { IndexPage, IndexPageProps } from './IndexPage'

ReactTooltip.rebuild = jest.fn()

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }: {children: JSX.Element}) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})
jest.mock('eessi-pensjon-ui', () => {
  return {
    Dashboard: (props: any) => <div className='mock-c-dashboard' onClick={() => props.afterLayoutChange()} />
  }
})

describe('pages/IndexPage', () => {
  let wrapper: ReactWrapper
  const initialMockProps: IndexPageProps = {
    history: {},
    t: jest.fn(t => t),
    username: 'mockUsername'
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
