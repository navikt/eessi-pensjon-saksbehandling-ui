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
      listJoarkFiles: jest.fn()
    },
    onFilesChange: jest.fn(),
    list: files,
    files: [],
    loadingJoarkFile: false,
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

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-joarkBrowser')).toBeTruthy()
    expect(wrapper.exists('TableSorter')).toBeTruthy()
  })

  it('Calls onFilesChange when selecting a file', () => {
    wrapper.find('#c-tablesorter__checkbox-1-4-ARKIV__23534345_pdf_').hostNodes().simulate('change', { target: { checked: true } })
    const expectedFile = files[0]
    expectedFile.variant = {
      variantformat: 'ARKIV',
      filnavn: '23534345.pdf'
    }
    expect(initialMockProps.onFilesChange).toHaveBeenCalledWith([expectedFile])
  })
})
