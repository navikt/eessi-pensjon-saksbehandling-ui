/* global File */

import React from 'react'
import FileUpload from './FileUpload'
import samplePDF from 'resources/tests/samplePDF'
jest.mock('react-pdf', () => {
  const React = require('react')
  return {
    pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
    Document: (props) => {
      props.setNumberPages(5)
      return (
        <div className='mock-pdfdocument'>
          {props.children}
        </div>
      )
    },
    Page: (props) => {
      return (
        <div className='mock-pdfpage'>
          {'Page: '}{props.pageNumber}
        </div>
      )
    }
  }
})

describe('components/FileUpload/FileUpload', () => {
  let wrapper
  const initialMockProps = {
    acceptedMimetypes: ['application/pdf', 'text/plain'],
    afterDrop: jest.fn(),
    beforeDrop: jest.fn(),
    closeModal: jest.fn(),
    currentPages: [],
    files: [],
    maxFiles: 10,
    maxFileSize: 100000,
    onFileChange: jest.fn(),
    openModal: jest.fn(),
    status: {},
    t: jest.fn((translationString) => { return translationString }),
    tabIndex: 1
  }

  const fileContents = 'file contents'
  const file = new File([fileContents], 'text.txt', { type: 'text/plain' })
  const expectedProcessedFile = {
    content: {
      base64: 'ZmlsZSBjb250ZW50cw=='
    },
    mimetype: 'text/plain',
    name: 'text.txt',
    size: 13
  }

  beforeEach(() => {
    wrapper = mount(<FileUpload {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-fileUpload')).toBeTruthy()
    expect(wrapper.exists('.c-fileUpload-placeholder')).toBeTruthy()
    expect(wrapper.exists('.c-fileUpload-placeholder-message')).toBeTruthy()
    expect(wrapper.find('.c-fileUpload-placeholder-message').render().text()).toEqual('ui:dropFilesHere')
    expect(wrapper.exists('.c-fileUpload-placeholder-status')).toBeTruthy()
    expect(wrapper.exists('.c-fileUpload-files')).toBeTruthy()
  })

  it('UseEffect: File dropped, onFileChange is called when dropping something', async () => {
    act(() => {
      initialMockProps.onFileChange.mockClear()
    })
    expect(initialMockProps.onFileChange).not.toHaveBeenCalled()
    await act(async () => {
      wrapper.simulate('drop', { target: { files: [file] } })
    })
    await act(async () => {
      wrapper.update()
    })
    expect(initialMockProps.onFileChange).toHaveBeenCalledWith([expectedProcessedFile])
    expect(wrapper.find('.c-fileUpload-placeholder-status').render().text()).toEqual('ui:accepted: 1, ui:rejected: 0, ui:total: 0')
  })

  it('Dropping a file too large', async () => {
    act(() => {
      initialMockProps.onFileChange.mockClear()
    })
    wrapper.setProps({ maxFileSize: 1 })
    await act(async () => {
      wrapper.simulate('drop', { target: { files: [file] } })
    })
    act(() => {
      wrapper.update()
    })
    expect(initialMockProps.onFileChange).toHaveBeenCalledWith([])
    expect(wrapper.find('.c-fileUpload-placeholder-status').render().text()).toEqual('ui:fileIsTooBigLimitIs')
  })

  it('Dropping a file of a forbidden mimetype', async () => {
    act(() => {
      initialMockProps.onFileChange.mockClear()
    })
    wrapper.setProps({ acceptedMimetypes: ['application/pdf'] })
    await act(async () => {
      wrapper.simulate('drop', { target: { files: [file] } })
    })
    expect(initialMockProps.onFileChange).toHaveBeenCalledWith([])
    expect(wrapper.find('.c-fileUpload-placeholder-status').render().text()).toEqual('ui:accepted: 0, ui:rejected: 1, ui:total: 0')
  })

  it('Renders a file ', () => {
    wrapper = mount(<FileUpload {...initialMockProps} files={[file]} />)
    expect(wrapper.exists('.c-file')).toBeTruthy()
    expect(wrapper.find('.c-file').render().text()).toEqual('title=text.txt\nui:size: 13 bytestxt')
  })

  it('Deleting a file', () => {
    act(() => {
      wrapper = mount(<FileUpload {...initialMockProps} files={[file]} />)
    })
    act(() => {
      initialMockProps.onFileChange.mockClear()
    })
    expect(initialMockProps.onFileChange).not.toHaveBeenCalled()
    expect(wrapper.exists('.deleteLink')).toBeFalsy()

    act(() => {
      wrapper.find('.c-file').simulate('mouseenter')
    })
    act(() => {
      wrapper.update()
    })
    expect(wrapper.exists('.deleteLink')).toBeTruthy()

    act(() => {
      wrapper.find('.deleteLink Icons').simulate('click')
    })
    act(() => {
      wrapper.update()
    })
    expect(initialMockProps.onFileChange).toHaveBeenCalledWith([])
    expect(wrapper.find('.c-fileUpload-placeholder-status').render().text()).toEqual('ui:removed text.txt')
  })

  it('With a PDF file, loaded', () => {
    wrapper = mount(<FileUpload {...initialMockProps} files={[samplePDF]} />)

    act(() => {
      wrapper.update()
    })
    expect(wrapper.find('.c-file .mock-pdfpage').render().text()).toEqual('Page: 1')
    act(() => {
      wrapper.find('.c-file').simulate('mouseenter')
    })
    act(() => {
      wrapper.update()
    })

    expect(wrapper.exists('.previewLink')).toBeTruthy()
    act(() => {
      wrapper.find('.previewLink').simulate('click')
    })
    expect(initialMockProps.openModal).toHaveBeenCalled()

    expect(wrapper.exists('.nextPage')).toBeTruthy()
    act(() => {
      wrapper.find('.nextPage').simulate('click')
    })
    act(() => {
      wrapper.update()
    })
    expect(wrapper.find('.c-file .mock-pdfpage').render().text()).toEqual('Page: 2')

    expect(wrapper.exists('.previousPage')).toBeTruthy()
    act(() => {
      wrapper.find('.previousPage').simulate('click')
    })
    act(() => {
      wrapper.update()
    })
    expect(wrapper.find('.c-file .mock-pdfpage').render().text()).toEqual('Page: 1')
  })
})
