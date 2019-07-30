import React from 'react'
import File from './File'

describe('components/File', () => {
  const t = jest.fn((translationString) => { return translationString })
  const mockPDF = { size: 404, mimetype: 'application/pdf', content: 'notnull' }
  const mockPNG = { size: 418, mimetype: 'image/png', content: 'notnull' }
  const mockOTHER = { size: 500, mimetype: 'other/other' }

  it('Renders', () => {
    const wrapper = shallow(<File t={t} file={mockPDF} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Renders PDF', () => {
    const wrapper = shallow(<File t={t} file={mockPDF} />)
    expect(wrapper.exists('MiniaturePDF')).toBeTruthy()
    expect(wrapper.exists('MiniatureImage')).toBeFalsy()
    expect(wrapper.exists('MiniatureOther')).toBeFalsy()
  })

  it('Renders images', () => {
    const wrapper = shallow(<File t={t} file={mockPNG} />)
    expect(wrapper.exists('MiniaturePDF')).toBeFalsy()
    expect(wrapper.exists('MiniatureImage')).toBeTruthy()
    expect(wrapper.exists('MiniatureOther')).toBeFalsy()
  })

  it('Renders others', () => {
    const wrapper = shallow(<File t={t} file={mockOTHER} />)
    expect(wrapper.exists('MiniaturePDF')).toBeFalsy()
    expect(wrapper.exists('MiniatureImage')).toBeFalsy()
    expect(wrapper.exists('MiniatureOther')).toBeTruthy()
  })
})
