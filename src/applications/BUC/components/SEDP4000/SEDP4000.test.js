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

  it('Renders without crashing', () => {
    const wrapper = mount(<SEDP4000 {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: call for p4000 file list if we do not have one', () => {
    mount(<SEDP4000 {...initialMockProps} />)
    expect(initialMockProps.actions.listP4000).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })
})
