import { getTagList, saveBucsInfo, getSed } from 'actions/buc'
import { Buc, BucInfo, BucsInfo } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockSedP50001 from 'mocks/buc/sed_P5000_1'
import mockSedP50002 from 'mocks/buc/sed_P5000_2'
import { stageSelector } from 'setupTests'
import BUCTools, { BUCToolsProps } from './BUCTools'

jest.mock('actions/buc', () => ({
  getTagList: jest.fn(),
  saveBucsInfo: jest.fn(),
  getSed: jest.fn()
}))

const defaultSelector = {
  tagList: ['mockTag1', 'mockTag2'],
  bucsInfo: (mockBucsInfo as BucsInfo),
  loading: {},
  sedContent: {
    '60578cf8bf9f45a7819a39987c6c8fd4': mockSedP50001,
    '50578cf8bf9f45a7819a39987c6c8fd4': mockSedP50002
  },
  featureToggles: {
    P5000_VISIBLE: true,
    P_BUC_02_VISIBLE: true
  }
}

describe('applications/BUC/components/BUCTools/BUCTools', () => {
  let wrapper: ReactWrapper
  const buc: Buc = mockBucs()[0]
  const bucInfo: BucInfo = (mockBucsInfo as BucsInfo).bucs['' + buc.caseId]
  const initialMockProps: BUCToolsProps = {
    aktoerId: '123',
    buc: buc,
    bucInfo: bucInfo,
    onTagChange: jest.fn()
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<BUCTools {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  //  expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: fetches tag list', () => {
    stageSelector(defaultSelector, { tagList: undefined })
    mount(<BUCTools {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled()
  })

  it('Changes tags', () => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCTools {...initialMockProps} />)
    expect(wrapper.exists('#a-buc-c-buctools__tags-select-id')).toBeTruthy()
    const tagSelect = wrapper.find('#a-buc-c-buctools__tags-select-id').hostNodes()
    tagSelect.find('input').simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    tagSelect.find('input').simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onTagChange).toHaveBeenCalledWith([{
      label: 'buc:tag-vip',
      value: 'tag-vip'
    }, {
      label: 'buc:mockTag1',
      value: 'mockTag1'
    }])
  })

  it('Changes comments', () => {
    const firstMockedComment = bucInfo.comment
    const secondMockedComment = 'this is a mocked comment'
    expect(wrapper.exists('#a-buc-c-buctools__comment-textarea-id')).toBeTruthy()

    let commentTextarea = wrapper.find('#a-buc-c-buctools__comment-textarea-id').hostNodes()
    expect(commentTextarea.props().value).toEqual(firstMockedComment)

    commentTextarea.simulate('change', { target: { value: secondMockedComment } })
    wrapper.update()
    commentTextarea = wrapper.find('#a-buc-c-buctools__comment-textarea-id').hostNodes()
    expect(commentTextarea.props().value).toEqual(secondMockedComment)
  })

  it('Handles onSaveButtonClick()', () => {
    expect(wrapper.exists('.a-buc-c-buctools')).toBeTruthy()
    wrapper.find('#a-buc-c-buctools__save-button-id').hostNodes().simulate('click')
    expect(saveBucsInfo).toHaveBeenCalledWith({
      aktoerId: '123',
      buc: buc,
      comment: bucInfo.comment,
      tags: ['tag-vip'],
      bucsInfo: (mockBucsInfo as BucsInfo)
    })
  })

  it('HTML with ExpandingPanel open', () => {
    expect(wrapper.exists('.c-expandingpanel')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-buctools__title').hostNodes().render().text()).toEqual('buc:form-BUCtools')
    expect(wrapper.exists('.a-buc-c-buctools__tags-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__comment-textarea')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__p5000-button')).toBeTruthy()
  })

  it('HTML with ExpandingPanel close', async (done) => {
    expect(wrapper.exists('.c-expandingpanel.ekspanderbartPanel--apen')).toBeTruthy()
    wrapper.find('.c-expandingpanel button.ekspanderbartPanel__knapp').simulate('click')
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.exists('.a-buc-c-buctools.ekspanderbartPanel--lukket')).toBeTruthy()
      done()
    }, 500)
  })

  it('Loads SEDs fpr P5000', () => {
    wrapper.find('button.a-buc-c-buctools__p5000-button').simulate('click')
    expect(getSed).toHaveBeenCalledTimes(2)
  })
})
