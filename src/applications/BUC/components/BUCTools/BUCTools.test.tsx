import { getTagList, saveBucsInfo, getSed } from 'actions/buc'
import { Buc, BucInfo, BucsInfo, Comment, Comments, SedContentMap, TagList } from 'declarations/buc.d'
import { AllowedLocaleString, FeatureToggles } from 'declarations/types'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import mockTagList from 'mocks/buc/tagsList'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockSedP50001 from 'mocks/buc/sed_P5000_1'
import mockSedP50002 from 'mocks/buc/sed_P5000_2'
import { stageSelector } from 'setupTests'
import BUCTools, { BUCToolsProps, TextArea } from './BUCTools'
import allTags from 'constants/tagsList'

jest.mock('actions/buc', () => ({
  getSed: jest.fn(),
  getTagList: jest.fn(),
  saveBucsInfo: jest.fn()
}))

const defaultSelector = {
  bucsInfo: mockBucsInfo as BucsInfo,
  featureToggles: {
    P5000_VISIBLE: true,
    P_BUC_02_VISIBLE: true
  } as FeatureToggles,
  highContrast: false,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  sedContent: {
    '60578cf8bf9f45a7819a39987c6c8fd4': mockSedP50001,
    '50578cf8bf9f45a7819a39987c6c8fd4': mockSedP50002
  } as SedContentMap,
  tagList: mockTagList as TagList,
}

const buc: Buc = mockBucs()[0]
const bucInfo: BucInfo = (mockBucsInfo as BucsInfo).bucs['' + buc.caseId]


describe('applications/BUC/components/BUCTools/BUCTools', () => {
  let wrapper: ReactWrapper

  const initialMockProps: BUCToolsProps = {
    aktoerId: '123',
    buc: buc,
    bucInfo: bucInfo,
    initialTab: 0,
    onTagChange: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCTools {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__panel-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__tabs-id\']')).toBeTruthy()
  })

  it('Render: has proper HTML: P5000 tab', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__P5000-button-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__tags-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-textarea-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-save-button-id\']')).toBeFalsy()
  })

  it('Render: has proper HTML: tag tab', () => {
    wrapper = mount(<BUCTools {...initialMockProps} initialTab={1}/>)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__P5000-button-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__tags-select-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-textarea-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-save-button-id\']')).toBeFalsy()
  })

  it('Render: has proper HTML: comment tab', () => {
    wrapper = mount(<BUCTools {...initialMockProps} initialTab={2}/>)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__P5000-button-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__tags-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-textarea-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-save-button-id\']')).toBeTruthy()
  })


  it('UseEffect: fetches tag list', () => {
    stageSelector(defaultSelector, { tagList: undefined })
    mount(<BUCTools {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled()
  })

  it('Handling: Changing tags', () => {
    (initialMockProps.onTagChange as jest.Mock).mockReset()
    wrapper = mount(<BUCTools {...initialMockProps}
      initialTab={1}
    />);
    const tagSelect = wrapper.find('[data-test-id=\'a-buc-c-buctools__tags-select-id\']').find('input').hostNodes()
    tagSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    tagSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    tagSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
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
    wrapper = mount(<BUCTools {...initialMockProps} initialTab={2}/>)
    const newComment = 'this is a new comment'
    expect(wrapper.exists('[data-test-id=\'a-buc-c-buctools__comment-textarea-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-buctools__comment-div-id\']').hostNodes().length).toEqual(bucInfo.comment!.length)

    expect(wrapper.find(TextArea).props().value).toEqual('')

    wrapper.find('[data-test-id=\'a-buc-c-buctools__comment-textarea-id\']').hostNodes().simulate('change', { target: { value: newComment } })
    wrapper.find('[data-test-id=\'a-buc-c-buctools__comment-save-button-id\']').hostNodes().simulate('click')

    expect(saveBucsInfo).toHaveBeenCalledWith(expect.objectContaining({
      comment: (bucInfo.comment as Comments)!.concat([{value: newComment} as Comment])
    }))

  })

  it('Handling: Loads SEDs for P5000', () => {
    wrapper.find('[data-test-id=\'a-buc-c-buctools__P5000-button-id\']').hostNodes().simulate('click')
    expect(getSed).toHaveBeenCalledTimes(2)
  })
})
