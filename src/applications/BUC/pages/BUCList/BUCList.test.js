import React from 'react'
import BUCList from './BUCList'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import * as storage from 'constants/storage'
jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui')
  return {
    ...Ui,
    ExpandingPanel: ({ heading, children }) => <div className='mock-ExpandingPanel'>{heading}{children}</div>,
    Nav: {
      ...Ui.Nav
    }
  }
})

const bucReducer = (currentBucs, newBuc) => {
  currentBucs[newBuc.caseId] = newBuc
  return currentBucs
}
const mockBucs = sampleBucs.reduce(bucReducer, {})

describe('applications/BUC/widgets/BUCList/BUCList', () => {
  let wrapper
  const initialMockProps = {
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
    institutionList: [{
      NO: [{
        navn: 'mockInstitution1',
        akronym: 'MI1',
        id: 'NO:MI1',
        landkode: 'NO'
      }]
    }],
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
    expect(wrapper.find('.mock-ExpandingPanel').hostNodes().length).toEqual(sampleBucs.filter(buc => !buc.error).length)
    expect(wrapper.exists('.a-buc-c-sedlist')).toBeTruthy()
    expect(wrapper.find('.a-buc-p-buclist__sedheader-head').hostNodes().length).toEqual(12)
    expect(wrapper.exists('.a-buc-c-footer')).toBeTruthy()
  })

  it('Moves to mode sednew when button pressed', () => {
    const replySedButton = wrapper.find('.a-buc-c-sedheader__actions-answer-button').hostNodes().first()
    replySedButton.simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('sednew')
  })

  it('Moves to mode bucedit when button pressed', () => {
    const bucEditButton = wrapper.find('.a-buc-c-bucheader__bucedit-link').first()
    bucEditButton.simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('bucedit')
  })
})
