import React from 'react'
import MiniaturePDF from './MiniaturePDF'
import samplePDF from 'resources/tests/samplePDF'

jest.mock('react-pdf', () => {
  const React = require('react')
  return {
    pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
    Document: (props) => {
      props.onLoadSuccess({ numPages: 5 })
      return <div>{props.children}</div>
    },
    Page: (props) => {
      return 'Page: ' + props.pageNumber
    }
  }
})

describe('components/File/MiniaturePDF', () => {

  const t = jest.fn((translationString) => { return translationString })

  const initialMockProps = {
    size: '2 kB',
    t: t,
    file: samplePDF,
    scale: 1,
    onAddFile: jest.fn(),
    onDeleteDocument: jest.fn(),
    onLoadSuccess: jest.fn(),
    onPreviewDocument: jest.fn(),
    previewLink: true,
    deleteLink: true,
    downloadLink: true,
    addLink: true
  }

  it('Renders', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('onLoadSuccess is called wiehen mounted', () => {
    mount(<MiniaturePDF {...initialMockProps} />)
    expect(initialMockProps.onLoadSuccess).toHaveBeenCalled()
  })

  it('Renders buttons on onMouseEnter', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} currentPage={3} />)
    expect(wrapper.exists('.previousPage')).toBeFalsy()
    expect(wrapper.exists('.nextPage')).toBeFalsy()
    expect(wrapper.find('.link')).toHaveLength(0)
    expect(wrapper.exists('.previewLink')).toBeFalsy()
    expect(wrapper.exists('.deleteLink')).toBeFalsy()
    expect(wrapper.exists('.downloadLink')).toBeFalsy()
    expect(wrapper.exists('.addLink')).toBeFalsy()

    wrapper.setProps({isHovering: true})
    expect(wrapper.exists('.previousPage')).toBeTruthy()
    expect(wrapper.exists('.nextPage')).toBeTruthy()
    expect(wrapper.find('.link')).toHaveLength(4)
    expect(wrapper.exists('.previewLink')).toBeTruthy()
    expect(wrapper.exists('.deleteLink')).toBeTruthy()
    expect(wrapper.exists('.downloadLink')).toBeTruthy()
    expect(wrapper.exists('.addLink')).toBeTruthy()
  })


  it('Changes current page', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} isHovering={true}/>)
    wrapper.setProps({isHovering: true})
    expect(wrapper.find('Page').text()).toEqual('Page: 1')
    expect(wrapper.exists('.nextPage')).toBeTruthy()

    wrapper.find('.nextPage').hostNodes().simulate('click')
    expect(wrapper.find('Page').text()).toEqual('Page: 2')
    expect(wrapper.exists('.previousPage')).toBeTruthy()

    wrapper.find('.previousPage').simulate('click')
    expect(wrapper.find('Page').text()).toEqual('Page: 1')
  })

  it('Preview page', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} isHovering={true}/>)
    expect(wrapper.exists('.previewLink')).toBeTruthy()

    wrapper.find('.previewLink').simulate('click')
    expect(initialMockProps.onPreviewDocument).toHaveBeenCalled()
  })

  it('Delete document', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} isHovering={true}/>)
    expect(wrapper.exists('.deleteLink')).toBeTruthy()

    wrapper.find('.deleteLink').simulate('click')
    expect(initialMockProps.onDeleteDocument).toHaveBeenCalled()
  })

  it('Add document', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} isHovering={true}/>)
    expect(wrapper.exists('.addLink')).toBeTruthy()

    wrapper.find('.addLink').simulate('click')
    expect(initialMockProps.onAddFile).toHaveBeenCalled()
  })

  it('Download document', () => {
    let wrapper = mount(<MiniaturePDF {...initialMockProps} isHovering={true}/>)
    expect(wrapper.exists('.downloadLink')).toBeTruthy()

    wrapper.find('.downloadLink').simulate('click')
    expect(wrapper.find('.downloadLink > a').props().href)
      .toEqual('data:application/octet-stream;base64,' + encodeURIComponent(samplePDF.content.base64))
  })
})
