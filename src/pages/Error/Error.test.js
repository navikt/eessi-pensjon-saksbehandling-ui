import React from 'react'
import { Error } from './Error'
jest.mock('components/TopContainer/TopContainer', () => {
  return (props) => {
    return <div className='mock-c-topcontainer'>
      {props.children}
    </div>
  }
})

describe('pages/Error', () => {
  let wrapper
  const initialMockProps = {
    history: {},
    t: jest.fn((translationString) => { return translationString })
  }

  it('Renders', () => {
     wrapper = mount(<Error {...initialMockProps} type='something' />)
     expect(wrapper.isEmptyRender()).toBeFalsy()
     expect(wrapper).toMatchSnapshot()
  })

  it('Page forbidden: Has proper HTML structure', () => {
     wrapper = mount(<Error {...initialMockProps} type='forbidden' />)
     expect(wrapper.exists('.p-error')).toBeTruthy()
     expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-saksbehandler-forbidden-title')
     expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-saksbehandler-forbidden-description')
  })

  it('Page notLogged: Has proper HTML structure', () => {
     wrapper = mount(<Error {...initialMockProps} type='notLogged' />)
     expect(wrapper.exists('.p-error')).toBeTruthy()
     expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-notLogged-title')
     expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-notLogged-description')
  })

  it('Page notInvited: Has proper HTML structure', () => {
     wrapper = mount(<Error {...initialMockProps} type='notInvited' />)
     expect(wrapper.exists('.p-error')).toBeTruthy()
     expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-saksbehandler-notInvited-title')
     expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-saksbehandler-notInvited-description')
  })

  it('Page default: Has proper HTML structure', () => {
     wrapper = mount(<Error {...initialMockProps} type='default' />)
     expect(wrapper.exists('.p-error')).toBeTruthy()
     expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-404-title')
     expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-404-description')
  })
})
