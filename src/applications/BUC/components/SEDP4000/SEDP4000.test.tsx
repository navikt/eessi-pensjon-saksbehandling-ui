import { listP4000 } from 'actions/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleP4000info from 'resources/tests/sampleP4000info'
import { SEDP4000, SEDP4000Props } from './SEDP4000'
import { useDispatch, useSelector } from 'react-redux'
jest.mock('react-redux')
jest.mock('./Period/Period', () => () => <div className='mock-period' />)
jest.mock('actions/buc', () => ({
  listP4000: jest.fn()
}));

(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector = {
  loadingP4000list: false,
  loadingP4000info: false,
  p4000info: undefined,
  p4000list: undefined
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('applications/BUC/components/SEDP4000/SEDP4000', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDP4000Props = {
    aktoerId: '123',
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
    expect(listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  it('Call for p4000 file list when clicking saksbehandler-button', () => {
    wrapper.find('button#a-buc-c-sedp4000__listP4000saksbehandler-button-id').simulate('click')
    expect(listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  /* it('Has proper HTML structure: unmounted state', () => {
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady')).toBeTruthy()
    wrapper.setProps({ loadingP4000list: true })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady Spinner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__notReady').render().text()).toEqual('Venter...buc:loading-p4000list')
    wrapper.setProps({ loadingP4000list: false, loadingP4000info: true })
    wrapper.update()
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady Spinner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000__notReady > span').text()).toEqual('buc:loading-p4000info')
  }) */

  it('Has proper HTML structure: mounted state', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      p4000list: ['sampleP4000file'],
      p4000info: sampleP4000info
    }))
    wrapper = mount(<SEDP4000 {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-sedp4000')).toBeTruthy()
  })
})
