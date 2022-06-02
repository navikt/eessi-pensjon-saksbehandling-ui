import { within } from '@testing-library/dom'
import { getTagList, saveBucsInfo } from 'actions/buc'
import { Buc, BucInfo, BucsInfo, Comment, Comments, TagRawList } from 'declarations/buc.d'
import { AllowedLocaleString } from 'declarations/app.d'
import { render, screen, fireEvent } from '@testing-library/react'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockBucs from 'mocks/buc/bucs'
import mockTagList from 'mocks/buc/tagsList'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockP50001 from 'mocks/buc/sed_P5000_small1'
import mockP50002 from 'mocks/buc/sed_P5000_small2'
import { stageSelector } from 'setupTests'
import BUCTools, { BUCToolsProps } from './BUCTools'
import allTags from 'constants/tagsList'
import { P5000sFromRinaMap } from 'declarations/p5000'

jest.mock('actions/buc', () => ({
  getSed: jest.fn(),
  getTagList: jest.fn(),
  saveBucsInfo: jest.fn()
}))

const defaultSelector = {
  bucsInfo: mockBucsInfo as BucsInfo,
  featureToggles: mockFeatureToggles,
  highContrast: false,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  p5000sFromRinaMap: {
    '60578cf8bf9f45a7819a39987c6c8fd4': mockP50001,
    '50578cf8bf9f45a7819a39987c6c8fd4': mockP50002
  } as P5000sFromRinaMap,
  tagList: mockTagList as TagRawList
}

const buc: Buc = mockBucs()[0]
const bucInfo: BucInfo = (mockBucsInfo as BucsInfo).bucs['' + buc.caseId]

describe('applications/BUC/components/BUCTools/BUCTools', () => {
  const initialMockProps: BUCToolsProps = {
    aktoerId: '123',
    buc,
    bucInfo,
    initialTab: '',
    onTagChange: jest.fn(),
    setMode: jest.fn()
  } as BUCToolsProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: match snapshot', () => {
    const { container } = render(<BUCTools {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML', () => {
    render(<BUCTools {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_buctools--panel-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_buctools--tabs-id')).toBeInTheDocument()
  })

  it('Render: has proper HTML: P5000 tab', () => {
    expect(screen.getByTestId('a_buc_c_buctools--P5000-button-id')).toBeInTheDocument()
    expect(screen.queryByTestId('a_buc_c_buctools--tags-select-id')).toBeFalsy()
    expect(screen.queryByTestId('a_buc_c_buctools--comment-textarea-id')).toBeFalsy()
    expect(screen.queryByTestId('a_buc_c_buctools--comment-save-button-id')).toBeFalsy()
  })

  it('Render: has proper HTML: tag tab', () => {
    render(<BUCTools {...initialMockProps} initialTab={'tag'} />)
    expect(screen.queryByTestId('a_buc_c_buctools--P5000-button-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_buctools--tags-select-id')).toBeInTheDocument()
    expect(screen.queryByTestId('a_buc_c_buctools--comment-textarea-id')).toBeFalsy()
    expect(screen.queryByTestId('a_buc_c_buctools--comment-save-button-id')).toBeFalsy()
  })

  it('Render: has proper HTML: comment tab', () => {
    render(<BUCTools {...initialMockProps} initialTab={'comment'} />)
    expect(screen.queryByTestId('a_buc_c_buctools--P5000-button-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_buctools--tags-select-id')).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_buctools--comment-textarea-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_buctools--comment-save-button-id')).toBeInTheDocument()
  })

  it('UseEffect: fetches tag list', () => {
    stageSelector(defaultSelector, { tagList: undefined })
    render(<BUCTools {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled()
  })

  it('Handling: Changing tags', () => {
    (initialMockProps.onTagChange as jest.Mock).mockReset()
    render(<BUCTools {...initialMockProps} initialTab={'tags'} />)
    const select = within(screen.getByTestId('a_buc_c_BUCStart--tags-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })

    expect(initialMockProps.onTagChange).toHaveBeenCalledWith([{
      label: 'buc:tag-refusjonskrav',
      value: 'tag-refusjonskrav'
    }, {
      label: 'buc:' + allTags[1],
      value: allTags[1]
    }])
  })

  it('Handling: Changing comments', () => {
    (saveBucsInfo as jest.Mock).mockReset()
    render(<BUCTools {...initialMockProps} initialTab={'comment'} />)
    const newComment = 'this is a new comment'
    expect(screen.getByTestId('a_buc_c_buctools--comment-textarea-id')).toBeInTheDocument()
    expect(screen.getAllByTestId('a_buc_c_buctools--comment-div-id').length).toEqual(bucInfo.comment!.length)

    expect(screen.getByRole('textarea')).toHaveTextContext('')

    fireEvent.change(screen.getByTestId('a_buc_c_buctools--comment-textarea-id'), { target: { value: newComment } })
    fireEvent.click(screen.getByTestId('a_buc_c_buctools--save-button-id'))

    expect(saveBucsInfo).toHaveBeenCalledWith(expect.objectContaining({
      comment: (bucInfo.comment as Comments)!.concat([{ value: newComment } as Comment])
    }))
  })

  it('Handling: Deleting comments', () => {
    (saveBucsInfo as jest.Mock).mockReset()
    jest.spyOn(global, 'confirm' as any).mockReturnValueOnce(true)
    render(<BUCTools {...initialMockProps} initialTab={'comment'} />)
    expect(screen.getAllByTestId('a_buc_c_buctools--comment-div-id').length).toEqual(bucInfo.comment!.length)

    expect(screen.getByRole('textarea')).toHaveTextContext('')

    fireEvent.click(screen.getByTestId('a_buc_c_buctools--comment-delete-0-id'))

    expect(saveBucsInfo).toHaveBeenCalledWith(expect.objectContaining({
      comment: (bucInfo.comment as Comments)!.splice(1, 1)
    }))
  })

  it('Handling: Loads SEDs for P5000', () => {
    (initialMockProps.setMode as jest.Mock).mockReset()
    fireEvent.click(screen.getByTestId('a_buc_c_buctools--P5000-button-id'))
    expect(initialMockProps.setMode).toHaveBeenCalled()
  })
})
