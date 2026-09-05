import { getJoarkItemPreview, listJoarkItems } from 'src/actions/joark'
import { JoarkBrowserItems, JoarkPoster } from 'src/declarations/joark'
import {fireEvent, render, screen} from '@testing-library/react'
import mockJoark from 'src/mocks/joark/joark'
import mockJoarkProcessed from 'src/mocks/joark/joarkAsItems'
import { stageSelector } from 'src/setupTests'
import JoarkBrowser, { JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'
import _ from 'lodash'


jest.mock('src/actions/joark', () => ({
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

describe('src/components/JoarkBrowser/JoarkBrowser', () => {
  const initialMockProps: JoarkBrowserProps = {
    existingItems: [],
    onRowSelectChange: jest.fn(),
    onRowViewDelete: jest.fn(),
    mode: 'view',
    tableId: 'test-table-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    render(<JoarkBrowser {...initialMockProps} />)
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId('c-joarkBrowser')).toBeInTheDocument()
  })

  it('UseEffect: list Joark files', () => {
    stageSelector(defaultSelector, { list: undefined })
    render(<JoarkBrowser {...initialMockProps} />)
    expect(listJoarkItems).toHaveBeenCalledWith(defaultSelector.aktoerId)
  })

  it('Handling: calls onRowSelectChange when selecting a row', () => {
    render(<JoarkBrowser {...initialMockProps} mode='select' />)
    const cb = screen.getAllByRole('checkbox')
    fireEvent.click(cb[0])
    expect(initialMockProps.onRowSelectChange).toHaveBeenCalledWith(mockJoarkProcessed)
  })

  it('Render: hides selection checkboxes in view mode', () => {
    const { container } = render(<JoarkBrowser {...initialMockProps} />)

    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0)
  })

  it('Render: hides the tema column in view mode', () => {
    const { container } = render(<JoarkBrowser {...initialMockProps} />)

    expect(container.querySelectorAll('[role="columnheader"], th')).toHaveLength(6)
    expect(screen.queryByRole('columnheader', { name: 'Tema' })).not.toBeInTheDocument()
  })

  it('Render: retains unique attachment keys when document IDs are duplicated', () => {
    const savedAttachments: JoarkBrowserItems = [{
      key: 'attachment-one',
      type: 'sed',
      title: 'First attachment',
      date: new Date(),
      hasSubrows: false,
      journalpostId: '',
      dokumentInfoId: 'shared-document-id',
      variant: undefined,
      tema: undefined
    }, {
      key: 'attachment-two',
      type: 'sed',
      title: 'Second attachment',
      date: new Date(),
      hasSubrows: false,
      journalpostId: '',
      dokumentInfoId: 'shared-document-id',
      variant: undefined,
      tema: undefined
    }]

    const { container } = render(
      <JoarkBrowser
        {...initialMockProps}
        existingItems={savedAttachments}
        tableId='duplicate-attachment-keys'
      />
    )

    expect(container.querySelectorAll('#joarkbrowser-duplicate-attachment-keys-Row-attachment-one')).toHaveLength(1)
    expect(container.querySelectorAll('#joarkbrowser-duplicate-attachment-keys-Row-attachment-two')).toHaveLength(1)
  })

  it('Handling: calls onPreviewItem when clicking preview button', () => {
    (getJoarkItemPreview as jest.Mock).mockReset()
    render(<JoarkBrowser {...initialMockProps} mode='select' />)
    fireEvent.click(screen.getByTestId('c-tablesorter--preview-button-2-3'))
    expect(getJoarkItemPreview).toHaveBeenCalledWith(expect.objectContaining({
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
