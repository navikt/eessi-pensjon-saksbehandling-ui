import { fetchBucsInfo } from 'actions/buc'
import * as storage from 'constants/storage'
import { Bucs } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import BUCList, { BUCListProps, BUCListSelector } from './BUCList'

jest.mock('actions/buc', () => ({
  fetchBucsInfo: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn(),
  setCurrentBuc: jest.fn()
}))

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: BUCListSelector = {
  bucsInfo: sampleBucsInfo,
  bucsInfoList: [],
  institutionList: {
    NO: [{
      navn: 'mockInstitution1',
      akronym: 'MI1',
      id: 'NO:MI1',
      landkode: 'NO'
    }]
  },
  loading: {
    gettingBUCs: false
  }
};
(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('applications/BUC/widgets/BUCList/BUCList', () => {
  let wrapper: ReactWrapper
  const mockBucs: Bucs = _.keyBy(sampleBucs, 'caseId')
  const initialMockProps: BUCListProps = {
    aktoerId: '123',
    bucs: mockBucs,
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
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      bucsInfoList: [
        initialMockProps.aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO
      ]
    }))
    wrapper = mount(
      <BUCList {...initialMockProps} />
    )
    expect(fetchBucsInfo).toHaveBeenCalledWith(initialMockProps.aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
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
