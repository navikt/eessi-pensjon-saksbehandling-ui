import React from 'react'
import BUCDetail from './BUCDetail'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCDetail/BUCDetail', () => {
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo.bucs[buc.type + '-' + buc.caseId]
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t,
    locale: 'nb',
    buc: buc,
    bucInfo: bucInfo
  }

  it('Renders', () => {
    const wrapper = shallow(<BUCDetail {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = mount(<BUCDetail {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucdetail__body')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucdetail__props')).toBeTruthy()
    expect(wrapper.find('#a-buc-c-bucdetail__props-type').render().text()).toEqual(buc.type)
    expect(wrapper.find('#a-buc-c-bucdetail__props-caseId').render().text()).toEqual(buc.caseId)
    expect(wrapper.find('#a-buc-c-bucdetail__props-creator').render().text()).toEqual(
      buc.creator.institution + ' (' + buc.creator.country + ')')
    expect(wrapper.find('#a-buc-c-bucdetail__props-startDate').render().text()).toEqual(buc.startDate)
    expect(wrapper.find('#a-buc-c-bucdetail__props-lastUpdate').render().text()).toEqual(buc.lastUpdate)
    expect(wrapper.find('#a-buc-c-bucdetail__props-sakType').render().text()).toEqual('-')
    expect(wrapper.find('#a-buc-c-bucdetail__props-status').render().text()).toEqual(t('ui:' + buc.status))
    expect(wrapper.find('#a-buc-c-bucdetail__props-tags').render().text()).toEqual(bucInfo.tags.join(', '))
    expect(wrapper.find('#a-buc-c-bucdetail__props-comment').render().text()).toEqual(bucInfo.comment)
    expect(wrapper.exists('.a-buc-c-bucdetail__institutions')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-institutionlist').render().text()).toEqual('Norge: NO:NAVT003, NO:NAVT002')
  })
})
