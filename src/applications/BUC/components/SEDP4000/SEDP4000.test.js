import React from 'react'
import { SEDP4000 } from './SEDP4000'

describe('applications/BUC/components/SEDP4000/SEDP4000', () => {
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    aktoerId: '123',
    t: t,
    actions: {
      listP4000: jest.fn()
    },
    locale: 'nb',
    showButtons: true,
    setShowButtons: jest.fn()
  }

  it('Renders', () => {
    const wrapper = mount(<SEDP4000 {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: call for p4000 file list if we do not have one', () => {
    mount(<SEDP4000 {...initialMockProps} />)
    expect(initialMockProps.actions.listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  it('Has proper HTML structure: unmounted state', () => {
    const wrapper = mount(<SEDP4000 {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-sedp4000__notReady')).toBeTruthy()
  })

  it('Has proper HTML structure: mounted state', () => {
    const wrapper = mount(<SEDP4000 {...initialMockProps} p4000list={['file']} p4000info={{ stayAbroad: [] }} />)
    expect(wrapper.exists('.a-buc-c-sedp4000')).toBeTruthy()
  })
})
