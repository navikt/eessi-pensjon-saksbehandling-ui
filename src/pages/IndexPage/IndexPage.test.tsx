import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import { IndexPage, IndexPageProps, IndexPageSelector } from './IndexPage'

const defaultSelector: IndexPageSelector = {
  username: 'mockUsername'
}

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-topcontainer'>
      {children}
    </div>
  )
})

jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui').default
  return {
    ...Ui,
    Dashboard: (props: any) => <div className='mock-c-dashboard' onClick={() => props.afterLayoutChange()} />
  }
})

describe('pages/IndexPage', () => {
  let wrapper: ReactWrapper
  const initialMockProps: IndexPageProps = {}

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<IndexPage {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    // expect(wrapper).toMatchSnapshot()  // Until React.Tooltip has uuid
  })

  it('IndexPage has proper HTML structure', () => {
    //expect(wrapper.exists(TopContainer)).toBeTruthy()
    expect(wrapper.exists('.mock-c-dashboard')).toBeTruthy()
  })
})
