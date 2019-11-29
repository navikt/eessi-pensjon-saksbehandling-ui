import React from 'react'
import moment from 'moment'
import { mount, ReactWrapper } from 'enzyme' // eslint-disable-line
import BUCDetail from './BUCDetail'
import { BUCDetailProps } from './BUCDetail.d' // eslint-disable-line
import sampleBucs from 'resources/tests/sampleBucs'
import { Buc, BucsInfo, BucInfo, ErrorBuc } from 'constants/types' // eslint-disable-line
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCDetail/BUCDetail', () => {
  let wrapper: ReactWrapper
  const buc: Buc | ErrorBuc = sampleBucs[0]
  const bucInfo: BucInfo = (sampleBucsInfo as BucsInfo).bucs['' + buc.caseId]
  const initialMockProps: BUCDetailProps = {
    buc: buc,
    bucInfo: bucInfo,
    institutionNames: {},
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
    expect(wrapper.find('#a-buc-c-bucdetail__props-startDate-id').render().text()).toEqual(moment(new Date(buc.startDate as number)).format('DD.MM.YYYY'))
    expect(wrapper.find('#a-buc-c-bucdetail__props-status-id').render().text()).toEqual('ui:' + buc.status)
    expect(wrapper.find('#a-buc-c-bucdetail__props-tags-id').render().text()).toEqual('buc:tag-vip')
    expect(wrapper.find('#a-buc-c-bucdetail__props-comment-id').render().text()).toEqual(bucInfo.comment)
    expect(wrapper.exists('.a-buc-c-bucdetail__institutions')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucdetail__institutions').hostNodes().render().text()).toEqual(['NAVAT07', 'DEMO001', 'DEMO001', 'DEMO001'].join(''))
  })
})
