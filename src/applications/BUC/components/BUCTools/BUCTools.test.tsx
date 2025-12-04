import { getTagList } from 'src/actions/buc'
import { Buc, BucInfo, BucsInfo, TagRawList } from 'src/declarations/buc.d'
import { AllowedLocaleString } from 'src/declarations/app.d'
import { render, screen, fireEvent } from '@testing-library/react'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockBucs from 'src/mocks/buc/bucs'
import mockTagList from 'src/mocks/buc/tagsList'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import mockP50001 from 'src/mocks/buc/sed_P5000_small1'
import mockP50002 from 'src/mocks/buc/sed_P5000_small2'
import { stageSelector } from 'src/setupTests'
import BUCTools, { BUCToolsProps } from './BUCTools'
import allTags from 'src/constants/tagsList'
import { P5000sFromRinaMap } from 'src/declarations/p5000'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('src/actions/buc', () => ({
  getSed: jest.fn(),
  getTagList: jest.fn(),
  saveBucsInfo: jest.fn()
}))

const defaultSelector = {
  bucsInfo: mockBucsInfo as BucsInfo,
  featureToggles: mockFeatureToggles,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  p5000sFromRinaMap: {
    '60578cf8bf9f45a7819a39987c6c8fd4': mockP50001,
    '50578cf8bf9f45a7819a39987c6c8fd4': mockP50002
  } as P5000sFromRinaMap,
  tagList: mockTagList as TagRawList
}

const buc: Buc = mockBucs()[2]
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

  it('Render: has proper HTML', () => {
    render(<BUCTools {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_buctools--panel-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_buctools--tabs-id')).toBeInTheDocument()
  })

  it('Render: has proper HTML: P5000 tab', () => {
    render(<BUCTools {...initialMockProps} initialTab='P5000' />)
    expect(screen.getByTestId('a_buc_c_buctools--P5000-button-id')).toBeInTheDocument()
    expect(screen.queryByTestId('a_buc_c_buctools--tags-select-id')).toBeFalsy()
  })

  it('Render: has proper HTML: tag tab', () => {
    render(<BUCTools {...initialMockProps} initialTab='tags' />)
    expect(screen.queryByTestId('a_buc_c_buctools--P5000-button-id')).toBeFalsy()
    expect(screen.getByText('buc:form-tagsForBUC')).toBeInTheDocument()
  })


  it('UseEffect: fetches tag list', () => {
    stageSelector(defaultSelector, { tagList: undefined })
    render(<BUCTools {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled()
  })

  it('Handling: Changing tags', () => {
    (initialMockProps.onTagChange as jest.Mock).mockReset()
    render(<BUCTools {...initialMockProps} initialTab='tags' />)
    const select = screen.getByRole('combobox')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })

    expect(initialMockProps.onTagChange).toHaveBeenCalledWith([{
      label: 'buc:' + allTags[0],
      value: allTags[0]
    }])
  })

  it('Handling: Loads SEDs for P5000', () => {
    render(<BUCTools {...initialMockProps} initialTab='P5000' />)
    fireEvent.click(screen.getByTestId('a_buc_c_buctools--P5000-button-id'))
    expect(initialMockProps.setMode).toHaveBeenCalled()
  })
})
