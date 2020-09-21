import { getPreviewJoarkFile, listJoarkFiles } from 'actions/joark'
import { JoarkDoc, JoarkFile, JoarkPoster } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockJoark from 'mocks/joark/joarkRaw'
import { stageSelector } from 'setupTests'
import { JoarkBrowser, JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'
import TableSorter from 'tabell'
import _ from 'lodash'

jest.mock('actions/joark', () => ({
  getPreviewJoarkFile: jest.fn(),
  listJoarkFiles: jest.fn()
}))

const files: Array<JoarkFile> = []
mockJoark.data.dokumentoversiktBruker.journalposter.forEach((post: JoarkPoster) => {
  post.dokumenter.forEach((doc: JoarkDoc) => {
    if (!_.isEmpty(doc.dokumentvarianter)) {
      files.push({
        tilleggsopplysninger: post.tilleggsopplysninger,
        journalpostId: post.journalpostId,
        tittel: doc.tittel,
        tema: post.tema,
        dokumentInfoId: doc.dokumentInfoId,
        datoOpprettet: new Date(Date.parse(post.datoOpprettet)),
        variant: doc.dokumentvarianter[0]
      })
    }
  })
})

const defaultSelector: JoarkBrowserSelector = {
  aktoerId: '123',
  list: files,
  loadingJoarkList: false,
  loadingJoarkPreviewFile: false,
  previewFile: undefined
}

describe('components/JoarkBrowser/JoarkBrowser', () => {
  let wrapper: ReactWrapper

  const initialMockProps: JoarkBrowserProps = {
    files: [],
    onFilesChange: jest.fn(),
    mode: 'view',
    onPreviewFile: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
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
    stageSelector(defaultSelector, { loadingJoarkList: true })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(wrapper.find('WaitingPanel')).toBeTruthy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-joarkBrowser')).toBeTruthy()
    expect(wrapper.exists(TableSorter)).toBeTruthy()
  })

  it('UseEffect: list Joark files ', () => {
    stageSelector(defaultSelector, { list: undefined })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(listJoarkFiles).toHaveBeenCalledWith(defaultSelector.aktoerId)
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
    stageSelector(defaultSelector, { previewFile: mockFile })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
    stageSelector(defaultSelector, {})
  })

  it('Calls onFilesChange when selecting a file', () => {
    (initialMockProps.onFilesChange as jest.Mock).mockReset()
    stageSelector(defaultSelector, {})
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    wrapper.find('#c-tableSorter__row-checkbox-id-view-1-4-ARKIV').hostNodes().simulate('change', { target: { checked: true } })
    const expectedFile = files[0]
    expectedFile.variant = {
      variantformat: 'ARKIV',
      filnavn: '23534345.pdf'
    }
    expect(initialMockProps.onFilesChange).toHaveBeenCalledWith([{
      date: new Date('2018-12-27T14:42:24'),
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
