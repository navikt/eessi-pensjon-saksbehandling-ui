import React from 'react'

import { Alert } from './Alert'

describe('components/Alert/Alert', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t
  }

  it('Alert renders without crashing', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Alert renders as server', () => {
    wrapper = mount(<Alert t={t} type='server' />)
    expect(wrapper.render().text()).toEqual('mockServerErrorMessageMockUuid')
  })

  it('Alert renders as client', () => {
    wrapper = mount(<Alert t={t} type='client' />)
    expect(wrapper.render().text()).toEqual('mockClientErrorMessageMockUuid')
  })

  it('Alert close button works', async (done) => {
    wrapper = mount(<Alert t={t} type='client' />)
    expect(wrapper.render().text()).toEqual('mockClientErrorMessageMockUuid')
    wrapper.instance().clientClear()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(wrapper.render().text()).toEqual('')
        done()
      }, 500)
    })
  })
})
