import React from 'react'
import moment from 'moment'
import BUCDetail from './BUCDetail'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCDetail/BUCDetail', () => {
  let wrapper
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo.bucs[buc.caseId]
  const initialMockProps = {
    buc: buc,
    bucInfo: bucInfo,
    locale: 'nb',
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<BUCDetail {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucdetail__body')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucdetail__props')).toBeTruthy()
    expect(wrapper.find('#a-buc-c-bucdetail__props-type').render().text()).toEqual(buc.type)
    expect(wrapper.find('#a-buc-c-bucdetail__props-caseId').render().text()).toEqual(buc.caseId)
    expect(wrapper.find('#a-buc-c-bucdetail__props-creator').render().text()).toEqual(
      buc.creator.institution + ' (' + buc.creator.country + ')')
    expect(wrapper.find('#a-buc-c-bucdetail__props-startDate').render().text()).toEqual(moment(buc.startDate).format('Y-M-D'))
    expect(wrapper.find('#a-buc-c-bucdetail__props-lastUpdate').render().text()).toEqual(moment(buc.lastUpdate).format('Y-M-D'))
    expect(wrapper.find('#a-buc-c-bucdetail__props-sakType').render().text()).toEqual('-')
    expect(wrapper.find('#a-buc-c-bucdetail__props-status').render().text()).toEqual('ui:' + buc.status)
    expect(wrapper.find('#a-buc-c-bucdetail__props-tags').render().text()).toEqual(bucInfo.tags.join(', '))
    expect(wrapper.find('#a-buc-c-bucdetail__props-comment').render().text()).toEqual(bucInfo.comment)
    expect(wrapper.exists('.a-buc-c-bucdetail__institutions')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-institutionlist').render().text()).toEqual('Norge: NO:NAVT003, NO:NAVT002')
  })
})
