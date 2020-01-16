import React from 'react'
import { JoarkBrowser, JoarkBrowserProps } from './JoarkBrowser'
import { mount, ReactWrapper } from 'enzyme'
import sampleJoark from 'resources/tests/sampleJoarkRaw'
import { JoarkDoc, JoarkFile, JoarkPoster } from 'declarations/joark'

describe('components/JoarkBrowser/JoarkBrowser', () => {
  let wrapper: ReactWrapper
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
  const initialMockProps: JoarkBrowserProps = {
    actions: {
      listJoarkFiles: jest.fn(),
      getPreviewJoarkFile: jest.fn()
    },
    aktoerId: '123',
    file: undefined,
    files: [],
    list: files,
    loadingJoarkList: false,
    loadingJoarkFile: false,
    loadingJoarkPreviewFile: false,
    onFilesChange: jest.fn(),
    mode: 'view',
    onPreviewFile: jest.fn(),
    previewFile: undefined,
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Render: loading', () => {
    wrapper = mount(<JoarkBrowser {...initialMockProps} loadingJoarkList />)
    expect(wrapper.find('WaitingPanel')).toBeTruthy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-joarkBrowser')).toBeTruthy()
    expect(wrapper.exists('.c-tableSorter')).toBeTruthy()
  })

  it('UseEffect: list Joark files ', () => {
    // @ts-ignore
    wrapper = mount(<JoarkBrowser {...initialMockProps} list={undefined} />)
    expect(initialMockProps.actions.listJoarkFiles).toHaveBeenCalledWith(initialMockProps.aktoerId)
  })

  it('UseEffect: when new file is available, load it', () => {
    const mockFile = {
      name: 'file.txt',
      dokumentInfoId: '123',
      journalpostId: '123',
      variant: 'foo',
      content: {
        base64: '1232341234234'
      }
    }
    wrapper.setProps({ file: mockFile })
    wrapper.update()
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
    }
    wrapper.setProps({ previewFile: mockFile })
    wrapper.update()
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
  })

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
    (initialMockProps.actions.getPreviewJoarkFile as jest.Mock).mockReset()
    wrapper.find('#c-tablesorter__preview-button-1-4-ARKIV__23534345_pdf_').hostNodes().first().simulate('click')
    expect(initialMockProps.actions.getPreviewJoarkFile).toHaveBeenCalledWith(expect.objectContaining({
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
