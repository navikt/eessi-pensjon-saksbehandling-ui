import { getJoarkItemPreview, listJoarkItems } from 'src/actions/joark'
import { JoarkPoster } from 'src/declarations/joark'
import {fireEvent, render, screen} from '@testing-library/react'
import mockJoark from 'src/mocks/joark/joark'
import mockJoarkProcessed from 'src/mocks/joark/joarkAsItems'
import { stageSelector } from 'src/setupTests'
import { JoarkBrowser, JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'
import _ from 'lodash'


jest.mock('actions/joark', () => ({
  getJoarkItemPreview: jest.fn(),
  listJoarkItems: jest.fn()
}))
jest.mock('md5', () => () => 'mock-md5key')

const files: Array<JoarkPoster> = _.cloneDeep(mockJoark.data.dokumentoversiktBruker.journalposter)

const defaultSelector: JoarkBrowserSelector = {
  aktoerId: '123',
  list: files,
  loadingJoarkList: false,
  loadingJoarkPreviewFile: false,
  previewFile: undefined
}

describe('components/JoarkBrowser/JoarkBrowser', () => {
  const initialMockProps: JoarkBrowserProps = {
    existingItems: [],
    onRowSelectChange: jest.fn(),
    onPreviewFile: jest.fn(),
    onRowViewDelete: jest.fn(),
    mode: 'view',
    tableId: 'test-table-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    render(<JoarkBrowser {...initialMockProps} />)
  })

  it('Render: match snapshot', () => {
    const { container } = render(<JoarkBrowser {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })


  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId('c-joarkBrowser')).toBeInTheDocument()
  })

  it('UseEffect: list Joark files', () => {
    stageSelector(defaultSelector, { list: undefined })
    render(<JoarkBrowser {...initialMockProps} />)
    expect(listJoarkItems).toHaveBeenCalledWith(defaultSelector.aktoerId)
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
    render(<JoarkBrowser {...initialMockProps} />)
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
    stageSelector(defaultSelector, {})
  })

  it('Handling: calls onRowSelectChange when selecting a row', () => {
    render(<JoarkBrowser {...initialMockProps} mode='select' />)
    const cb = screen.getAllByRole('checkbox')
    fireEvent.click(cb[1])
    expect(initialMockProps.onRowSelectChange).toHaveBeenCalledWith(mockJoarkProcessed)
  })

  it('Handling: calls onPreviewItem', () => {
    (getJoarkItemPreview as jest.Mock).mockReset()
    render(<JoarkBrowser {...initialMockProps} mode='select' />)
    fireEvent.click(screen.getByTestId('c-tablesorter--preview-button-2-3'))
    expect(getJoarkItemPreview).toHaveBeenCalledWith(expect.objectContaining({
      date: new Date('2010-11-01T11:26:55.000Z'),
      disabled: true,
      dokumentInfoId: '3',
      hasSubrows: false,
      journalpostId: '2',
      key: '2-3-undefined-false',
      selected: false,
      tema: 'OPP',
      title: 'Dok.vedr. norskkurs- faxet Utlendingsnemnda',
      type: 'joark',
      variant: undefined,
      visible: true
    }))
  })
})
