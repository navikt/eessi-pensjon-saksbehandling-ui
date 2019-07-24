import React from 'react'
import SEDHeader from './SEDHeader'

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const t = jest.fn((translationString) => { return translationString })

  it('Renders', () => {
    let wrapper = shallow(<SEDHeader t={t} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    let wrapper = shallow(<SEDHeader t={t} />)
    expect(wrapper.exists('.a-buc-c-sedheader')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedheader__head').length).toEqual(4)
  })
})
