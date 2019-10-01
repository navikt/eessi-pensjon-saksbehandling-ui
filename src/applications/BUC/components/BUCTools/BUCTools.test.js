import React from 'react'
import BUCTools from './BUCTools'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCTools/BUCTools', () => {
  let wrapper
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo.bucs[buc.caseId]
  const initialMockProps = {
    actions: {
      getTagList: jest.fn(),
      saveBucsInfo: jest.fn()
    },
    aktoerId: '123',
    buc: buc,
    bucInfo: bucInfo,
    bucsInfo: { foo: 'bar' },
    loading: {},
    locale: 'nb',
    onTagChange: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    tagList: ['mockTag1', 'mockTag2']
  }

  beforeEach(() => {
    wrapper = mount(<BUCTools {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    // expect(wrapper).toMatchSnapshot()// - do not use, collapse dependency generates random ids
  })

  it('UseEffect: fetches tag list', () => {
    mount(<BUCTools {...initialMockProps} tagList={undefined} />)
    expect(initialMockProps.actions.getTagList).toHaveBeenCalled()
  })

  it('Changes tags', () => {
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(wrapper.exists('#a-buc-c-buctools__tags-select-id')).toBeTruthy()
    const tagSelect = wrapper.find('#a-buc-c-buctools__tags-select-id').hostNodes()
    tagSelect.find('input').simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    tagSelect.find('input').simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onTagChange).toHaveBeenCalledWith(['mockTag1', 'mockTag2'])
  })

  it('Changes comments', () => {
    const firstMockedComment = bucInfo.comment
    const secondMockedComment = 'this is a mocked comment'
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(wrapper.exists('#a-buc-c-buctools__comment-textarea-id')).toBeTruthy()

    let tagSelect = wrapper.find('#a-buc-c-buctools__comment-textarea-id').hostNodes()
    expect(tagSelect.props().value).toEqual(firstMockedComment)

    tagSelect.simulate('change', { target: { value: secondMockedComment } })
    wrapper.update()
    tagSelect = wrapper.find('#a-buc-c-buctools__comment-textarea-id').hostNodes()
    expect(tagSelect.props().value).toEqual(secondMockedComment)
  })

  it('Handles onSaveButtonClick()', () => {
    expect(wrapper.exists('.a-buc-c-buctools')).toBeTruthy()
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    wrapper.find('button#a-buc-c-buctools__save-button-id').simulate('click')
    expect(initialMockProps.actions.saveBucsInfo).toHaveBeenCalledWith({
      aktoerId: '123',
      buc: buc,
      comment: bucInfo.comment,
      tags: bucInfo.tags,
      bucsInfo: { foo: 'bar' }
    })
  })

  it('HTML with EkspanderbartpanelBase close', () => {
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toBeFalsy()
  })

  it('HTML with EkspanderbartpanelBase open', () => {
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(wrapper.exists('.a-buc-c-buctools')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-buctools__title').hostNodes().render().text()).toEqual('buc:form-BUCtools')
    expect(wrapper.exists('.a-buc-c-buctools__tags-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__comment-textarea')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toBeTruthy()
  })
})
