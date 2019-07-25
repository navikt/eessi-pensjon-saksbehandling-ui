import React from 'react'
import File from './File'
import MiniatureImage from './MiniatureImage'
import MiniaturePDF from './MiniaturePDF'
import MiniatureOther from './MiniatureOther'

const mockPDF = { size: 404, mimetype: 'application/pdf', content: 'notnull' }
const mockPNG = { size: 418, mimetype: 'image/png', content: 'notnull' }
const mockOTHER = { size: 500, mimetype: 'other/other' }

describe('components/File', () => {

  const t = jest.fn((translationString) => { return translationString })

  it('Renders', () => {
    let wrapper = shallow(<File t={t} file={mockPDF} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Renders PDF', () => {
    let wrapper = shallow(<File t={t} file={mockPDF} />)
    expect(wrapper.exists('MiniaturePDF')).toBeTruthy()
    expect(wrapper.exists('MiniatureImage')).toBeFalsy()
    expect(wrapper.exists('MiniatureOther')).toBeFalsy()
  })

  it('Renders images', () => {
    let wrapper = shallow(<File t={t} file={mockPNG} />)
    expect(wrapper.exists('MiniaturePDF')).toBeFalsy()
    expect(wrapper.exists('MiniatureImage')).toBeTruthy()
    expect(wrapper.exists('MiniatureOther')).toBeFalsy()
  })

  it('Renders others', () => {
    let wrapper = shallow(<File t={t} file={mockOTHER} />)
    expect(wrapper.exists('MiniaturePDF')).toBeFalsy()
    expect(wrapper.exists('MiniatureImage')).toBeFalsy()
    expect(wrapper.exists('MiniatureOther')).toBeTruthy()
  })
})
