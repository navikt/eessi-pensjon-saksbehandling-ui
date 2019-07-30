import React from 'react'
import SEDHeader from './SEDHeader'

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const t = jest.fn((translationString) => { return translationString })

  it('Renders', () => {
    const wrapper = shallow(<SEDHeader t={t} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = shallow(<SEDHeader t={t} />)
    expect(wrapper.exists('.a-buc-c-sedheader')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedheader__head').length).toEqual(4)
  })
})
