import { getTagList, saveBucsInfo } from 'actions/buc'
import { Buc, BucInfo, BucsInfo } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import BUCTools, { BUCToolsProps } from './BUCTools'

jest.mock('actions/buc', () => ({
  getTagList: jest.fn(),
  saveBucsInfo: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector = {
  tagList: ['mockTag1', 'mockTag2'],
  bucsInfo: (sampleBucsInfo as BucsInfo),
  loading: {}
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('applications/BUC/components/BUCTools/BUCTools', () => {
  let wrapper: ReactWrapper
  const buc: Buc = sampleBucs[0]
  const bucInfo: BucInfo = (sampleBucsInfo as BucsInfo).bucs['' + buc.caseId]
  const initialMockProps: BUCToolsProps = {
    aktoerId: '123',
    buc: buc,
    bucInfo: bucInfo,
    onTagChange: jest.fn()
  }

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
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      tagList: undefined
    }))
    mount(<BUCTools {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled();
    (useSelector as jest.Mock).mockImplementation(() => (defaultSelector))
  })

  it('Changes tags', () => {
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
      bucsInfo: (sampleBucsInfo as BucsInfo)
    })
  })

  it('HTML with ExpandingPanel open', () => {
    expect(wrapper.exists('.c-expandingpanel')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-buctools__title').hostNodes().render().text()).toEqual('buc:form-BUCtools')
    expect(wrapper.exists('.a-buc-c-buctools__tags-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__comment-textarea')).toBeTruthy()
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
})
