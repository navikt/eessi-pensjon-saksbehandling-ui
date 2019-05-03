import React from 'react'

import { RenderData } from './RenderData'

const t = jest.fn((translationString) => { return translationString })

const mockPreviewData = {
  buc: 'mockBuc',
  sed: 'mockSed',
  subjectArea: 'mockSubjectArea',
  institutions: ['NO'],
  a: {
    b: 'c',
    d: {
      e: 'f',
      g: {
        h: 'i',
        j: 'k'
      }
    }
  }
}

describe('RenderData', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RenderData t={t} previewData={mockPreviewData} />)
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('#divToPrint').length).toEqual(1)
  })

  it('renderJson()', () => {
    let generatedContent = wrapper.instance().renderJson(mockPreviewData).map(html => {
      return mount(html).html()
    })

    expect(generatedContent).toEqual([
      '<div style="padding-left: 0px;"><b>buc</b>: mockBuc</div>',
      '<div style="padding-left: 0px;"><b>sed</b>: mockSed</div>',
      '<div style="padding-left: 0px;"><b>subjectArea</b>: mockSubjectArea</div>',
      '<div style="padding-left: 0px;"><b>0</b>: NO</div>',
      '<div style="padding-left: 12px;"><b>b</b>: c</div>',
      '<div style="padding-left: 12px;"><b>e</b>: f</div>',
      '<div style="padding-left: 12px;"><b>h</b>: i</div>',
      '<div style="padding-left: 12px;"><b>j</b>: k</div>'
    ])
  })
})
