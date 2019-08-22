import React from 'react'
import BUCTools from './BUCTools'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCTools/BUCTools', () => {
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo.bucs[buc.type + '-' + buc.caseId]
  const t = jest.fn((translationString) => { return translationString })
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
    t: t,
    tagList: ['mockTag1', 'mockTag2']
  }

  it('Renders', () => {
    const wrapper = shallow(<BUCTools {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: fetches tag list', () => {
    mount(<BUCTools {...initialMockProps} tagList={undefined} />)
    expect(initialMockProps.actions.getTagList).toHaveBeenCalled()
  })

  it('Changes tags', () => {
    const firstMockedTags = bucInfo.tags.map(tag => {
      return {
        label: 'buc:tag-' + tag,
        value: tag
      }
    })
    const secondMockedTags = firstMockedTags.concat([{
      label: 'buc:tag-mockTag1',
      value: 'mockTag1'
    }])
    const wrapper = mount(<BUCTools {...initialMockProps} />)
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(wrapper.exists('#a-buc-c-buctools__tags-select-id')).toBeTruthy()

    let tagSelect = wrapper.find('#a-buc-c-buctools__tags-select-id').hostNodes()
    expect(tagSelect.find('StateManager').props().value).toEqual(firstMockedTags)

    tagSelect.find('input').simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    tagSelect.find('input').simulate('keyDown', { key: 'Enter', keyCode: 13 })
    tagSelect = wrapper.find('#a-buc-c-buctools__tags-select-id').hostNodes()
    expect(tagSelect.find('StateManager').props().value).toEqual(secondMockedTags)
  })

  it('Changes comments', () => {
    const firstMockedComment = bucInfo.comment
    const secondMockedComment = 'this is a mocked comment'
    const wrapper = mount(<BUCTools {...initialMockProps} />)
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
    const wrapper = mount(<BUCTools {...initialMockProps} />)
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
    const wrapper = mount(<BUCTools {...initialMockProps} />)
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toBeFalsy()
  })

  it('HTML with EkspanderbartpanelBase open', () => {
    const wrapper = mount(<BUCTools {...initialMockProps} />)
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(wrapper.exists('.a-buc-c-buctools')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-buctools__title').hostNodes().render().text()).toEqual(t('buc:form-BUCtools'))
    expect(wrapper.exists('.a-buc-c-buctools__tags-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__comment-textarea')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toBeTruthy()
  })
})
