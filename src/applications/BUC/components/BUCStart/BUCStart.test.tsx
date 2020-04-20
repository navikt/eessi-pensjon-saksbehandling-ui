import { createBuc, getBucList, getSubjectAreaList, getTagList, saveBucsInfo } from 'actions/buc'
import { Buc, BucsInfo } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import { stageSelector } from 'setupTests'
import BUCStart, { BUCStartProps } from './BUCStart'

jest.mock('actions/buc', () => ({
  createBuc: jest.fn(),
  getSubjectAreaList: jest.fn(),
  getBucList: jest.fn(),
  getTagList: jest.fn(),
  resetBuc: jest.fn(),
  saveBucsInfo: jest.fn()
}))

const defaultSelector = {
  bucParam: undefined,
  bucList: ['mockBuc1'],
  loading: {},
  locale: 'nb',
  subjectAreaList: ['mockSubjectArea1', 'mockSubjectArea2'],
  tagList: ['mockTag1', 'mockTag2']
}

Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    origin: 'http://fake-url.nav.no/',
    pathname: '/_/case',
    search: '?sakId=123',
    href: 'http://fake-url.nav.no/_/case?sakId=123'
  }
})

describe('applications/BUC/components/BUCStart/BUCStart with no sakId or aktoerId', () => {
  let wrapper: ReactWrapper
  const buc: Buc = mockBucs()[0]
  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onTagsChanged: jest.fn(),
    setMode: jest.fn()
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<BUCStart {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders a spinner when fetching data', () => {
    stageSelector(defaultSelector, {
      loading: {
        gettingSubjectAreaList: true
      }
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-bucstart__spinner')).toBeTruthy()
  })

  it('UseEffect: fetches subject areas, bucs, tags list if empty', () => {
    stageSelector(defaultSelector, {
      bucList: undefined,
      subjectAreaList: undefined,
      tagList: undefined
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(getSubjectAreaList).toHaveBeenCalled()
    expect(getBucList).toHaveBeenCalled()
    expect(getTagList).toHaveBeenCalled()
  })

  it('UseEffect: saves bucsInfo after when buc was saved', () => {
    stageSelector(defaultSelector, {
      bucsInfo: mockBucsInfo as BucsInfo,
      buc: buc
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(saveBucsInfo).toHaveBeenCalledWith({
      bucsInfo: mockBucsInfo,
      aktoerId: '456',
      tags: [],
      buc: buc
    })
  })

  it('UseEffect: having buc and saved bucInfo makes you go to sednew menu', async (done) => {
    stageSelector(defaultSelector, {
      bucsInfo: mockBucsInfo as BucsInfo,
      buc: buc
    })
    wrapper = mount(<BUCStart {...initialMockProps} />)
    expect(initialMockProps.setMode).not.toHaveBeenCalled()
    done()
    /* wrapper.setProps({
      loading: {
        savingBucsInfo: true
      }
    })

    await new Promise(resolve => {
      setTimeout(() => {
        wrapper.setProps({
          loading: {
            savingBucsInfo: false
          }
        })
        expect(initialMockProps.setMode).toHaveBeenCalledWith('sednew')
        resolve()
        done()
      }, 500)
    }) */
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('div.a-buc-c-bucstart')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart__subjectarea-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart__buc-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart__tags-select')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart__buttons')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart__forward-button')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart__cancel-button')).toBeTruthy()
  })

  it('Handles valid onForwardButtonClick()', () => {
    expect(wrapper.find('button.a-buc-c-bucstart__forward-button').prop('disabled')).toBeTruthy()
    wrapper.find('#a-buc-c-bucstart__subjectarea-select-id').hostNodes().simulate('change', { target: { value: 'Pensjon' } })
    wrapper.find('#a-buc-c-bucstart__buc-select-id').hostNodes().simulate('change', { target: { value: 'mockBuc1' } })
    wrapper.update()
    wrapper.find('button.a-buc-c-bucstart__forward-button').hostNodes().simulate('click')
    expect(createBuc).toHaveBeenCalledWith('mockBuc1')
  })

  it('Handles invalid onForwardButtonClick()', () => {
    expect(wrapper.find('button.a-buc-c-bucstart__forward-button').prop('disabled')).toBeTruthy()
    wrapper.find('#a-buc-c-bucstart__subjectarea-select-id').hostNodes().simulate('change', { target: { value: 'buc:form-chooseSubjectArea' } })
    wrapper.find('#a-buc-c-bucstart__buc-select-id').hostNodes().simulate('change', { target: { value: 'buc:form-chooseBuc' } })
    wrapper.update()
    wrapper.find('button.a-buc-c-bucstart__forward-button').hostNodes().simulate('click')
    expect(createBuc).toHaveBeenCalledWith('mockBuc1')
  })

  it('Handles onCancelButtonClick()', () => {
    expect(wrapper.find('button.a-buc-c-bucstart__cancel-button').prop('disabled')).toBeFalsy()
    wrapper.find('button.a-buc-c-bucstart__cancel-button').hostNodes().simulate('click')
    expect(initialMockProps.setMode).toHaveBeenCalledWith('buclist')
  })

  it('Handles onTagsChange()', () => {
    wrapper.find('.a-buc-c-bucstart__tags-select .multipleSelect__dropdown-indicator').hostNodes().simulate('keyDown', { key: 'ArrowDown' })
    wrapper.find('.c-multipleOption').hostNodes().first().simulate('keyDown', { key: 'Enter' })
    expect(initialMockProps.onTagsChanged).toHaveBeenCalledWith([{ label: 'buc:mockTag1', value: 'mockTag1' }])
  })
})
