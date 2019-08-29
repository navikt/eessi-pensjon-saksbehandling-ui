import React from 'react'
import { SEDP4000 } from './SEDP4000'

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
  })

  it('Has proper HTML structure: mounted state', () => {
    wrapper = mount(<SEDP4000 {...initialMockProps} p4000list={['file']} p4000info={{ stayAbroad: [] }} />)
    expect(wrapper.exists('.a-buc-c-sedp4000')).toBeTruthy()
  })
})
