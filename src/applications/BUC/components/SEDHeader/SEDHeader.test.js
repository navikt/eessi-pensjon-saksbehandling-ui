import React from 'react'
import SEDHeader from './SEDHeader'

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const t = jest.fn((translationString) => { return translationString })

  it('Renders without crashing', () => {
    let wrapper = shallow(<SEDHeader t={t} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render()', () => {
    let wrapper = shallow(<SEDHeader t={t} />)
    expect(wrapper.exists('.a-buc-c-sedheader')).toEqual(true)
    expect(wrapper.find('.a-buc-c-sedheader__head').length).toEqual(4)
  })
})
