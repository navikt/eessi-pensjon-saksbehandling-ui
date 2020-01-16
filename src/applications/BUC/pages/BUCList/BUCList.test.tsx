import { Bucs } from 'declarations/buc'
import React from 'react'
import BUCList, { BUCListProps } from './BUCList'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import * as storage from 'constants/storage'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'

describe('applications/BUC/widgets/BUCList/BUCList', () => {
  let wrapper: ReactWrapper
  const mockBucs: Bucs = _.keyBy(sampleBucs, 'caseId')
  const initialMockProps: BUCListProps = {
    actions: {
      setCurrentBuc: jest.fn(),
      getInstitutionsListForBucAndCountry: jest.fn(),
      fetchBucs: jest.fn(),
      fetchBucsInfo: jest.fn(),
      fetchBucsInfoList: jest.fn(),
      setCurrentSed: jest.fn()
    },
    aktoerId: '123',
    bucs: mockBucs,
    bucsInfoList: [],
    bucsInfo: sampleBucsInfo,
    institutionList: {
      NO: [{
        navn: 'mockInstitution1',
        akronym: 'MI1',
        id: 'NO:MI1',
        landkode: 'NO'
      }]
    },
    institutionNames: {},
    loading: {
      gettingBUCs: false
    },
    locale: 'nb',
    rinaUrl: 'http://mockUrl/rinaUrl',
    sakId: '456',
    setMode: jest.fn(),
    t: jest.fn((translationString) => {
      return translationString
    })
  }

  beforeEach(() => {
    wrapper = mount(<BUCList {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: loading BUCs', () => {
    wrapper.setProps({ loading: { gettingBUCs: true } })
    expect(wrapper.exists('WaitingPanel')).toBeTruthy()
  })

  it('UseEffect: fetch bucs info', () => {
    wrapper = mount(
      <BUCList
        {...initialMockProps} bucsInfoList={[
          initialMockProps.aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO
        ]}
      />
    )
    expect(initialMockProps.actions.fetchBucsInfo).toHaveBeenCalledWith(initialMockProps.aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-p-buclist')).toBeTruthy()
    expect(wrapper.exists('.a-buc-p-buclist__buttons')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-buclist__newbuc-button-id')).toBeTruthy()
    expect(wrapper.find('.c-expandingpanel').hostNodes().length).toEqual(sampleBucs.filter(buc => !buc.error).length)
    expect(wrapper.exists('.a-buc-c-sedlist')).toBeFalsy()
    expect(wrapper.exists('.a-buc-c-footer')).toBeTruthy()
  })

  it('Moves to mode bucedit when button pressed', () => {
    const bucEditButton = wrapper.find('.a-buc-c-bucheader__bucedit-link').first()
    bucEditButton.simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('bucedit')
  })
})
