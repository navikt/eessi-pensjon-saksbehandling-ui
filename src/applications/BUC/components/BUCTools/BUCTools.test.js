import React from 'react'
import BUCTools from './BUCTools'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCTools/BUCTools', () => {
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo['bucs'][buc.type + '-' + buc.caseId]
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {
      getTagList: jest.fn(),
      saveBucsInfo: jest.fn()
    },
    aktoerId: '123',
    buc: buc,
    bucInfo: bucInfo,
    bucsInfo: {foo: 'bar'},
    loading: {},
    locale: 'nb',
    t: t,
    tagList: ['mockTag1', 'mockTag2']
  }

  it('Renders successfully', () => {
    let wrapper = shallow(<BUCTools {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: fetches tag list', () => {
    let wrapper = mount(<BUCTools {...initialMockProps} tagList={undefined} />)
    expect(initialMockProps.actions.getTagList).toHaveBeenCalled()
  })

  it('onSaveButtonClick()', async (done) => {
    let wrapper = mount(<BUCTools {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-buctools')).toEqual(true)
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    await new Promise(resolve => {
      setTimeout(() => {
        wrapper.find('button#a-buc-c-buctools__save-button-id').simulate('click')
        expect(initialMockProps.actions.saveBucsInfo).toHaveBeenCalledWith({
          aktoerId: '123',
          buc: buc,
          comment: bucInfo.comment,
          tags: bucInfo.tags,
          bucsInfo: {foo: 'bar'}
        })
        done()
      }, 500)
    })
  })

  it('render(), EkspanderbartpanelBase close', () => {
    let wrapper = mount(<BUCTools {...initialMockProps} />)
    expect(wrapper.exists('EkspanderbartpanelBase')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-buctools__save-button')).toEqual(false)
  })

  it('render(), EkspanderbartpanelBase open', async (done) => {
    let wrapper = mount(<BUCTools {...initialMockProps} />)
    expect(wrapper.exists('EkspanderbartpanelBase')).toEqual(true)
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    await new Promise(resolve => {
      setTimeout(() => {
        expect(wrapper.exists('.a-buc-c-buctools')).toEqual(true)
        expect(wrapper.find('.a-buc-c-buctools__title').hostNodes().render().text()).toEqual(t('buc:form-BUCtools'))
        expect(wrapper.exists('.a-buc-c-buctools__tags-select')).toEqual(true)
        expect(wrapper.exists('.a-buc-c-buctools__comment-textarea')).toEqual(true)
        expect(wrapper.exists('.a-buc-c-buctools__save-button')).toEqual(true)
        done()
      }, 500)
    })
  })
})
