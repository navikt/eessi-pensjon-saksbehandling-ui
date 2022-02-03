import { getJoarkItemPreview, listJoarkItems } from 'actions/joark'
import { JoarkPoster } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import mockJoark from 'mocks/joark/joark'
import mockJoarkProcessed from 'mocks/joark/joarkAsItems'
import { stageSelector } from 'setupTests'
import { JoarkBrowser, JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'
import TableSorter from '@navikt/tabell'
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
  let wrapper: ReactWrapper

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
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: loading', () => {
    stageSelector(defaultSelector, { loadingJoarkList: true })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(wrapper.find('WaitingPanel')).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'c-joarkBrowser\']')).toBeTruthy()
    expect(wrapper.exists(TableSorter)).toBeTruthy()
  })

  it('UseEffect: list Joark files', () => {
    stageSelector(defaultSelector, { list: undefined })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
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
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
    stageSelector(defaultSelector, {})
  })

  it('Handling: calls onRowSelectChange when selecting a row', () => {
    (initialMockProps.onRowSelectChange as jest.Mock).mockReset()
    wrapper = mount(<JoarkBrowser {...initialMockProps} mode='select' />)
    wrapper.find('#tabell-joarkbrowser-test-table-id__row-select-checkbox-joark-group-1').hostNodes().simulate('change', { target: { checked: true } })
    expect(initialMockProps.onRowSelectChange).toHaveBeenCalledWith(mockJoarkProcessed)
  })

  it('Handling: calls onPreviewItem', () => {
    (getJoarkItemPreview as jest.Mock).mockReset()
    wrapper = mount(<JoarkBrowser {...initialMockProps} mode='select' />)
    wrapper.find('#c-tablesorter__preview-button-2-3').hostNodes().simulate('click')
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
