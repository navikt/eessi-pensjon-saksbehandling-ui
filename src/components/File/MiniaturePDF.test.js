import React from 'react'

import { MiniaturePDF } from './MiniaturePDF'

const mockPdf = {
  size: 6090,
  name: 'testPDF.pdf',
  mimetype: 'application/pdf',
  content: {
    base64: 'mockData'
  },
  numPages: 5
}

jest.mock('react-pdf', () => {
  const React = require('react')
  return {
    pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
    Document: class Document extends React.Component {
      onLoadSuccess () {
        this.props.onLoadSuccess({ numPages: 5 })
      }
      render () {
        return this.props.children ? this.props.children : null
      }
    },
    Page: class Page extends React.Component {
      render () {
        return 'Page: ' + this.props.pageNumber
      }
    }
  }
})

describe('Render MiniaturePDF', () => {
  it('Renders without crashing', () => {
    let wrapper = mount(<MiniaturePDF
      size='Large'
      currentPage={1}
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
    />)
    wrapper.find('Document').instance().onLoadSuccess()

    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })

  it('Renders buttons on onMouseEnter', () => {
    let wrapper = mount(<MiniaturePDF
      size='Large'
      currentPage={3}
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
      previewLink
      deleteLink
      downloadLink
      addLink
    />)

    wrapper.find('Document').instance().onLoadSuccess()

    expect(wrapper.exists('a.previousPage')).toEqual(false)
    expect(wrapper.exists('a.nextPage')).toEqual(false)
    expect(wrapper.find('div.link')).toHaveLength(0)
    expect(wrapper.exists('div.previewLink')).toEqual(false)
    expect(wrapper.exists('div.deleteLink')).toEqual(false)
    expect(wrapper.exists('div.downloadLink')).toEqual(false)
    expect(wrapper.exists('div.addLink')).toEqual(false)

    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    expect(wrapper.exists('a.previousPage')).toEqual(true)
    expect(wrapper.exists('a.nextPage')).toEqual(true)
    expect(wrapper.find('div.link')).toHaveLength(4)
    expect(wrapper.exists('div.previewLink')).toEqual(true)
    expect(wrapper.exists('div.deleteLink')).toEqual(true)
    expect(wrapper.exists('div.downloadLink')).toEqual(true)
    expect(wrapper.exists('div.addLink')).toEqual(true)

    wrapper.unmount()
  })
})

describe('MiniaturePDF functions', () => {
  it('Change current page on click', () => {
    let wrapper = mount(<MiniaturePDF
      size='Large'
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
    />)
    wrapper.find('Document').instance().onLoadSuccess()
    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    expect(wrapper.find('Page').text()).toEqual('Page: 1')
    expect(wrapper.exists('a.nextPage')).toEqual(true)

    wrapper.find('a.nextPage').simulate('click')

    expect(wrapper.find('Page').text()).toEqual('Page: 2')
    expect(wrapper.exists('a.previousPage')).toEqual(true)

    wrapper.find('a.previousPage').simulate('click')

    expect(wrapper.find('Page').text()).toEqual('Page: 1')

    wrapper.unmount()
  })

  it('Calls onPreviousPage and onNextPage props on click', () => {
    const callback = jest.fn()

    let wrapper = mount(<MiniaturePDF
      size='Large'
      t={arg => arg}
      file={mockPdf}
      currentPage={3}
      scale={1}
      onLoadSuccess={() => { }}
      onPreviousPage={callback}
      onNextPage={callback}
    />)
    wrapper.find('Document').instance().onLoadSuccess()
    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    wrapper.find('a.nextPage').simulate('click')
    wrapper.find('a.previousPage').simulate('click')

    expect(callback).toHaveBeenCalledTimes(2)

    expect(wrapper.find('Page').text()).toEqual('Page: 3')
    wrapper.setProps({ currentPage: 1 })
    expect(wrapper.find('Page').text()).toEqual('Page: 1')

    wrapper.unmount()
  })

  it('previewLink', () => {
    let callback = jest.fn()

    let wrapper = mount(<MiniaturePDF
      size='Large'
      currentPage={3}
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
      previewLink={false}
      onPreviewDocument={callback}
    />)

    wrapper.find('Document').instance().onLoadSuccess()
    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    expect(wrapper.find('div.link')).toHaveLength(0)
    expect(wrapper.exists('div.previewLink')).toEqual(false)

    wrapper.setProps({ previewLink: true })

    expect(wrapper.find('div.link')).toHaveLength(1)
    expect(wrapper.exists('div.previewLink')).toEqual(true)

    wrapper.find('div.previewLink').simulate('click')

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('deleteLink', () => {
    let callback = jest.fn()

    let wrapper = mount(<MiniaturePDF
      size='Large'
      currentPage={3}
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
      deleteLink={false}
      onDeleteDocument={callback}
    />)

    wrapper.find('Document').instance().onLoadSuccess()
    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    expect(wrapper.find('div.link')).toHaveLength(0)
    expect(wrapper.exists('div.deleteLink')).toEqual(false)

    wrapper.setProps({ deleteLink: true })

    expect(wrapper.find('div.link')).toHaveLength(1)
    expect(wrapper.exists('div.deleteLink')).toEqual(true)

    wrapper.find('div.deleteLink').simulate('click')

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('addLink', () => {
    let callback = jest.fn()

    let wrapper = mount(<MiniaturePDF
      size='Large'
      currentPage={3}
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
      addLink={false}
      onAddFile={callback}
    />)

    wrapper.find('Document').instance().onLoadSuccess()
    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    expect(wrapper.find('div.link')).toHaveLength(0)
    expect(wrapper.exists('div.addLink')).toEqual(false)

    wrapper.setProps({ addLink: true })

    expect(wrapper.find('div.link')).toHaveLength(1)
    expect(wrapper.exists('div.addLink')).toEqual(true)

    wrapper.find('div.addLink').simulate('click')

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('downloadLink', () => {
    let wrapper = mount(<MiniaturePDF
      size='Large'
      currentPage={3}
      t={arg => arg}
      file={mockPdf}
      scale={1}
      onLoadSuccess={() => { }}
      downloadLink={false}
    />)

    wrapper.find('Document').instance().onLoadSuccess()
    wrapper.find('div.c-ui-miniaturePdf').simulate('mouseEnter')

    expect(wrapper.find('div.link')).toHaveLength(0)
    expect(wrapper.exists('div.downloadLink')).toEqual(false)

    wrapper.setProps({ downloadLink: true })

    expect(wrapper.find('div.link')).toHaveLength(1)
    expect(wrapper.exists('div.downloadLink')).toEqual(true)

    expect(wrapper.find('div.downloadLink > a').props().href)
      .toEqual('data:application/octet-stream;base64,' + encodeURIComponent(mockPdf.content.base64))
  })
})
