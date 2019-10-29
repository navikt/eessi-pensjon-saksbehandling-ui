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
    rinaUrl: 'http://rinaurl.mock.com',
    t: jest.fn(t => t)
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
    expect(wrapper.find('#a-buc-c-bucdetail__props-caseId-id').render().text()).toEqual(buc.caseId)
    expect(wrapper.find('#a-buc-c-bucdetail__props-creator-id').render().text()).toEqual('NAVAT07')
    expect(wrapper.find('#a-buc-c-bucdetail__props-startDate-id').render().text()).toEqual(moment(buc.startDate).format('DD.MM.YYYY'))
    expect(wrapper.find('#a-buc-c-bucdetail__props-status-id').render().text()).toEqual('ui:' + buc.status)
    expect(wrapper.find('#a-buc-c-bucdetail__props-tags-id').render().text()).toEqual('buc:tag-vip')
    expect(wrapper.find('#a-buc-c-bucdetail__props-comment-id').render().text()).toEqual(bucInfo.comment)
    expect(wrapper.exists('.a-buc-c-bucdetail__institutions')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucdetail__institutions').hostNodes().render().text()).toEqual('NAVAT07DEMO001DEMO002DEMO003DEMO004DEMO005')
  })
})
