import React from 'react'
import { JoarkBrowser } from './JoarkBrowser'
import sampleJoark from 'resources/tests/sampleJoark'

describe('components/JoarkBrowser/JoarkBrowser', () => {
  let wrapper
  const files = []
  sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter.forEach(post => {
    post.dokumenter.forEach(doc => {
      files.push({
        tilleggsopplysninger: post.tilleggsopplysninger,
        journalpostId: post.journalpostId,
        tittel: doc.tittel,
        tema: post.tema,
        dokumentInfoId: doc.dokumentInfoId,
        datoOpprettet: new Date(Date.parse(post.datoOpprettet)),
        varianter: doc.dokumentvarianter.map(variant => {
          return {
            variantformat: variant.variantformat,
            filnavn: variant.filnavn
          }
        })
      })
    })
  })
  const initialMockProps = {
    actions: {
      listJoarkFiles: jest.fn(),
      previewJoarkFile: jest.fn()
    },
    aktoerId: '123',
    file: undefined,
    files: [],
    list: files,
    loadingJoarkList: false,
    loadingJoarkFile: false,
    loadingJoarkPreviewFile: false,
    onFilesChange: jest.fn(),
    onPreviewFile: jest.fn(),
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
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
    initialMockProps.onFilesChange.mockReset()
    wrapper.find('#c-tablesorter__checkbox-1-4-ARKIV__23534345_pdf_').hostNodes().simulate('change', { target: { checked: true } })
    const expectedFile = files[0]
    expectedFile.variant = {
      variantformat: 'ARKIV',
      filnavn: '23534345.pdf'
    }
    expect(initialMockProps.onFilesChange).toHaveBeenCalledWith([expectedFile])
  })

  it('Calls onItemClicked', () => {
    initialMockProps.actions.previewJoarkFile.mockReset()
    wrapper.find('.c-joarkbrowser__subcell a').hostNodes().first().simulate('click')
    expect(initialMockProps.actions.previewJoarkFile).toHaveBeenCalledWith(expect.objectContaining({
      datoOpprettet: expect.any(Date),
      dokumentInfoId: '4',
      journalpostId: '1',
      tema: 'foo',
      tilleggsopplysninger: undefined,
      tittel: 'blue.pdf',
      variant: {
        filnavn: '23534345.pdf',
        variantformat: 'ARKIV'
      },
      varianter: [{
        filnavn: '23534345.pdf',
        variantformat: 'ARKIV'
      }, {
        filnavn: '908745345.pdf',
        variantformat: 'DUMMY'
      }]
    }), expect.objectContaining({
      filnavn: '23534345.pdf',
      variantformat: 'ARKIV'
    }))
  })
})
