import { createBuc, getBucOptions, getSubjectAreaList, getTagList, saveBucsInfo } from 'actions/buc'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app.d'
import { BucsInfo } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockPerson from 'mocks/app/person'
import mockPersonAvdods from 'mocks/app/personAvdod'
import mockBucOptions from 'mocks/buc/bucOptions'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import mockTagsList from 'mocks/buc/tagsList'
import { stageSelector } from 'setupTests'
import BUCStart, { BUCStartProps } from './BUCStart'
import React from 'react'

jest.mock('actions/buc', () => ({
  cleanNewlyCreatedBuc: jest.fn(),
  createBuc: jest.fn(),
  getBucOptions: jest.fn(),
  getSubjectAreaList: jest.fn(),
  getTagList: jest.fn(),
  resetBuc: jest.fn(),
  saveBucsInfo: jest.fn()
}))

const bucs = _.keyBy(mockBucs(), 'caseId')
const currentBuc = _.values(bucs)[0].caseId
const mockPersonAvdod = mockPersonAvdods(1)

const defaultSelector = {
  bucOptions: mockBucOptions,
  bucParam: undefined,
  bucs: bucs,
  bucsInfo: {},
  currentBuc: undefined,
  featureToggles: mockFeatureToggles,
  highContrast: false,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  newlyCreatedBuc: undefined,
  person: mockPerson,
  personAvdods: mockPersonAvdod,
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  subjectAreaList: mockSubjectAreaList,
  tagList: mockTagsList
}

describe('applications/BUC/components/BUCStart/BUCStart', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn()
  } as BUCStartProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCStart {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__subjectarea-select-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__tags-select-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buttons-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__cancel-button-id\']')).toBeTruthy()
  })

  it('Render: render Avdod when BUC is P_BUC_02', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
  })

  it('UseEffect: Fetch subject area list', () => {
    wrapper.unmount();
    (getSubjectAreaList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      subjectAreaList: undefined
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(getSubjectAreaList).toHaveBeenCalled()
  })

  it('UseEffect: Fetch buc list', () => {
    (getBucOptions as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucOptions: undefined
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(getBucOptions).toHaveBeenCalled()
  })

  it('UseEffect: Fetch tag list', () => {
    (getTagList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      tagList: undefined
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled()
  })

  it('UseEffect: set avdod if we have one, and _buc selected on P_BUC_02', () => {
    jest.useFakeTimers()
    const mockUseState = jest.fn()
    const useStateSpy = jest.spyOn(React, 'useState').mockImplementation(() => {
      return [undefined, mockUseState]
    })
    stageSelector(defaultSelector, {
      bucParam: 'P_BUC_02',
      personAvdods: mockPersonAvdods(1)
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    jest.runAllImmediates()

    // TODO
    // expect(mockUseState).toHaveBeenCalled()
    useStateSpy.mockRestore()
  })

  it('UseEffect: saves bucsInfo after when buc was saved', () => {
    (saveBucsInfo as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucsInfo: mockBucsInfo as BucsInfo,
      bucs: bucs,
      currentBuc: currentBuc,
      newlyCreatedBuc: bucs[currentBuc]
    })
    wrapper = mount(<BUCStart {...initialMockProps} initialIsCreatingBuc />)
    expect(saveBucsInfo).toHaveBeenCalledWith({
      bucsInfo: mockBucsInfo,
      aktoerId: '456',
      tags: [],
      buc: _.values(bucs)[0]
    })
  })

  it('UseEffect: call bucCreated after bucInfo is saved', () => {
    (initialMockProps.onBucCreated as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      newlyCreatedBuc: bucs[currentBuc]
    })
    wrapper = mount(<BUCStart {...initialMockProps} initialCreatingBucInfo />)
    expect(initialMockProps.onBucCreated).toHaveBeenCalled()
  })

  it('Handling: invalid onForwardButtonClick(): nothing selected', () => {
    expect(wrapper.exists('div.feiloppsummering')).toBeFalsy()
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    expect(wrapper.exists('div.feiloppsummering')).toBeTruthy()
    expect(wrapper.find('div.feiloppsummering').render().text()).toEqual('buc:form-feiloppsummering' + 'message:validation-chooseBuc')
  })

  it('Handling: invalid onForwardButtonClick(): set warning for P_BUC_02 and no avdod', () => {
    stageSelector(defaultSelector, {
      personAvdods: []
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__warning-id\']')).toBeFalsy()
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__warning-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucstart__warning-id\']').hostNodes().render().text()).toEqual(
      'advarsel' + 'message:alert-noDeceased'
    )
  })

  it('Handling: valid onForwardButtonClick()', () => {
    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_02',
      person: mockPerson,
      avdod: mockPersonAvdod![0]
    })
  })

  it('Handling: onCancelButtonClick()', () => {
    (initialMockProps.onBucCancelled as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__cancel-button-id\']').hostNodes().simulate('click')
    expect(initialMockProps.onBucCancelled).toHaveBeenCalled()
  })
})
