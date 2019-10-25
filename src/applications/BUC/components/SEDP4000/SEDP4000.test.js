import React from 'react'
import { SEDP4000 } from './SEDP4000'
import sampleP4000info from 'resources/tests/sampleP4000info'

describe('applications/BUC/components/SEDP4000/SEDP4000', () => {
  let wrapper
  const initialMockProps = {
    aktoerId: '123',
    actions: {
      listP4000: jest.fn()
    },
    locale: 'nb',
    showButtons: true,
    setShowButtons: jest.fn(),
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<SEDP4000 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Call for p4000 file list when clicking user-button', () => {
    wrapper.find('button#a-buc-c-sedp4000__listP4000user-button-id').simulate('click')
    expect(initialMockProps.actions.listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  it('Call for p4000 file list when clicking saksbehandler-button', () => {
    wrapper.find('button#a-buc-c-sedp4000__listP4000saksbehandler-button-id').simulate('click')
    expect(initialMockProps.actions.listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  it('Has proper HTML structure: unmounted state', () => {
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady')).toBeTruthy()
    wrapper.setProps({ loadingP4000list: true })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady Spinner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__notReady').render().text()).toEqual('Venter...buc:loading-p4000list')
    wrapper.setProps({ loadingP4000list: false, loadingP4000info: true })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady Spinner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__notReady > span').text()).toEqual('buc:loading-p4000info')
  })

  it('Has proper HTML structure: mounted state', () => {
    wrapper.setProps({
      p4000list: ['sampleP4000file'],
      p4000info: sampleP4000info
    })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000')).toBeTruthy()
  })
})
