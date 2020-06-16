import { fetchBucsInfo } from 'actions/buc'
import * as storage from 'constants/storage'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import React from 'react'
import { stageSelector } from 'setupTests'
import BUCList, { BUCListProps, BUCListSelector } from './BUCList'

jest.mock('applications/BUC/components/BUCFooter/BUCFooter', () => () => <div className='mock-bucfooter' />)
jest.mock('actions/buc', () => ({
  fetchBucsInfo: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn(),
  setCurrentBuc: jest.fn()
}))

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

const defaultSelector: BUCListSelector = {
  bucsInfo: mockBucsInfo,
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
  },
  locale: 'nb'
}

describe('applications/BUC/widgets/BUCList/BUCList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCListProps = {
    aktoerId: '123',
    bucs: _.keyBy(mockBucs(), 'caseId'),
    setMode: jest.fn()
  }

  beforeAll(() => {
    console.log('BUCList')
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<BUCList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
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
    stageSelector(defaultSelector, {
      bucsInfoList: [
        initialMockProps.aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO
      ],
      bucsInfo: undefined
    })
    wrapper = mount(
      <BUCList {...initialMockProps} />
    )
    expect(fetchBucsInfo).toHaveBeenCalledWith(initialMockProps.aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-p-buclist')).toBeTruthy()
    expect(wrapper.exists('.a-buc-p-buclist__buttons')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-buclist__newbuc-button-id')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader').hostNodes().length).toEqual(mockBucs().filter(buc => !buc.error).length)
    expect(wrapper.exists('.a-buc-c-sedlist')).toBeFalsy()
    expect(wrapper.exists('.mock-bucfooter')).toBeTruthy()
  })

  it('Moves to mode bucedit when button pressed', () => {
    const bucEditButton = wrapper.find('.a-buc-c-bucheader__bucedit-link').first()
    bucEditButton.simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('bucedit')
  })
})
