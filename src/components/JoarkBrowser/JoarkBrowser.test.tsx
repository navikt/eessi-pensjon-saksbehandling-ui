import { getPreviewJoarkFile, listJoarkFiles } from 'actions/joark'
import { JoarkDoc, JoarkFile, JoarkPoster } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sampleJoark from 'resources/tests/sampleJoarkRaw'
import { JoarkBrowser, JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'

jest.mock('actions/joark', () => ({
  getPreviewJoarkFile: jest.fn(),
  listJoarkFiles: jest.fn()
}))

const files: Array<JoarkFile> = []
sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter.forEach((post: JoarkPoster) => {
  post.dokumenter.forEach((doc: JoarkDoc) => {
    files.push({
      tilleggsopplysninger: post.tilleggsopplysninger,
      journalpostId: post.journalpostId,
      tittel: doc.tittel,
      tema: post.tema,
      dokumentInfoId: doc.dokumentInfoId,
      datoOpprettet: new Date(Date.parse(post.datoOpprettet)),
      variant: doc.dokumentvarianter[0]
    })
  })
})

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: JoarkBrowserSelector = {
  aktoerId: '123',
  file: undefined,
  list: files,
  loadingJoarkList: false,
  loadingJoarkFile: false,
  loadingJoarkPreviewFile: false,
  previewFile: undefined
}

function setup (params: any) {
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}
(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('components/JoarkBrowser/JoarkBrowser', () => {
  let wrapper: ReactWrapper

  const initialMockProps: JoarkBrowserProps = {
    files: [],
    onFilesChange: jest.fn(),
    mode: 'view',
    onPreviewFile: jest.fn(),
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    setup({})
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Render: loading', () => {
    setup({ loadingJoarkList: true })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(wrapper.find('WaitingPanel')).toBeTruthy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-joarkBrowser')).toBeTruthy()
    expect(wrapper.exists('.c-tableSorter')).toBeTruthy()
  })

  it('UseEffect: list Joark files ', () => {
    setup({ list: undefined })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(listJoarkFiles).toHaveBeenCalledWith(defaultSelector.aktoerId)
  })
  /*
  it('UseEffect: when new file is available, load it', () => {
    const mockFile = {
      name: 'file.txt',
      dokumentInfoId: '123',
      journalpostId: '123',
      variant: 'foo',
      content: {
        base64: '1232341234234'
      }
    };
    console.log("z")
    setup({file: mockFile})
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    setup({file: undefined})
    console.log("z2")
    expect(initialMockProps.onFilesChange).toHaveBeenCalledWith([mockFile])
  })

  it('UseEffect: when new preview file is available, trigger it', () => {
    const mockFile = {
      name: 'file.txt',
      dokumentInfoId: '123',
      journalpostId: '123',
      variant: 'foo',
      content: {
        base64: '1232341234234'
      }
    };
    setup({previewFile: undefined})
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
  }) */

  it('Calls onFilesChange when selecting a file', () => {
    (initialMockProps.onFilesChange as jest.Mock).mockReset()
    wrapper.find('#c-tableSorter__row-checkbox-id-view-1-4-ARKIV').hostNodes().simulate('change', { target: { checked: true } })
    const expectedFile = files[0]
    expectedFile.variant = {
      variantformat: 'ARKIV',
      filnavn: '23534345.pdf'
    }
    expect(initialMockProps.onFilesChange).toHaveBeenCalledWith([{
      date: new Date('2018-12-27T13:42:24.000Z'),
      dokumentInfoId: '4',
      journalpostId: '1',
      key: 'view-1-4-ARKIV',
      label: 'ARKIV (23534345.pdf)',
      name: 'blue.pdf',
      selected: true,
      tema: 'foo',
      variant: {
        filnavn: '23534345.pdf',
        variantformat: 'ARKIV'
      }
    }])
  })

  it('Calls onPreviewItem', () => {
    (getPreviewJoarkFile as jest.Mock).mockReset()
    wrapper.find('#c-tablesorter__preview-button-1-4-ARKIV__23534345_pdf_').hostNodes().first().simulate('click')
    expect(getPreviewJoarkFile).toHaveBeenCalledWith(expect.objectContaining({
      date: expect.any(Date),
      dokumentInfoId: '4',
      journalpostId: '1',
      key: 'view-1-4-ARKIV',
      label: 'ARKIV (23534345.pdf)',
      name: 'blue.pdf',
      selected: false,
      tema: 'foo',
      variant: {
        filnavn: '23534345.pdf',
        variantformat: 'ARKIV'
      }
    }))
  })
})
