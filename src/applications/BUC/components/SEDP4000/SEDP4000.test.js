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
    t: jest.fn((translationString) => { return translationString })
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

  it('UseEffect: call for p4000 file list if we do not have one', () => {
    expect(initialMockProps.actions.listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  it('Has proper HTML structure: unmounted state', () => {
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady')).toBeTruthy()
    wrapper.setProps({ loadingP4000list: true })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady NavFrontendSpinner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__notReady').render().text()).toEqual('Venter...buc:loading-p4000list')
    wrapper.setProps({ loadingP4000list: false, loadingP4000info: true })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady NavFrontendSpinner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__notReady').render().text()).toEqual('Venter...buc:loading-p4000info')
  })

  it('Has proper HTML structure: mounted state', () => {
    wrapper.setProps({
      p4000list: ['sampleP4000file'],
      p4000info: sampleP4000info
    })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000')).toBeTruthy()
  })

  it('Warns when exceeding maxPeriods', () => {
    wrapper = mount(<SEDP4000 {...initialMockProps} initialMaxPeriods={1} p4000info={sampleP4000info} />)
    expect(wrapper.exists('.a-buc-c-sedp4000__maxPeriods-warning')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__maxPeriods-warning').render().text()).toEqual('buc:p4000-alert-maxPeriods')
  })
})
