import React from 'react'

import File from './File'
import MiniatureImage from './MiniatureImage'
import MiniaturePDF from './MiniaturePDF'
import MiniatureOther from './MiniatureOther'

const mockPDF = { size: 404, mimetype: 'application/pdf' }
const mockPNG = { size: 418, mimetype: 'image/png' }
const mockOTHER = { size: 500, mimetype: 'other/other' }

describe('Render File', () => {
  it('Render without crashing', () => {
    let wrapper = shallow(<File file={mockPDF} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
  })
  it('Renders right file type', () => {
    let wrapper = shallow(<File file={mockPDF} />)
    expect(wrapper.containsMatchingElement(<MiniaturePDF />)).toBeTruthy()
    expect(wrapper.containsMatchingElement(<MiniatureImage />)).toEqual(false)
    expect(wrapper.containsMatchingElement(<MiniatureOther />)).toEqual(false)

    wrapper.setProps({ file: mockPNG })
    expect(wrapper.containsMatchingElement(<MiniaturePDF />)).toEqual(false)
    expect(wrapper.containsMatchingElement(<MiniatureImage />)).toBeTruthy()
    expect(wrapper.containsMatchingElement(<MiniatureOther />)).toEqual(false)

    wrapper.setProps({ file: mockOTHER })
    expect(wrapper.containsMatchingElement(<MiniaturePDF />)).toEqual(false)
    expect(wrapper.containsMatchingElement(<MiniatureImage />)).toEqual(false)
    expect(wrapper.containsMatchingElement(<MiniatureOther />)).toBeTruthy()
  })
})
