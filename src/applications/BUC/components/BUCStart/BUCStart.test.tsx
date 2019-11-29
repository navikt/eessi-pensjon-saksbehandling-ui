import { Buc, BucsInfo } from 'applications/BUC/declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import BUCStart, { BUCStartProps } from './BUCStart'

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
  const buc: Buc = sampleBucs[0]
  const initialMockProps: BUCStartProps = {
    actions: {
      createBuc: jest.fn(),
      setStatusParam: jest.fn(),
      getSubjectAreaList: jest.fn(),
      getBucList: jest.fn(),
      getTagList: jest.fn(),
      saveBucsInfo: jest.fn(),
      resetBuc: jest.fn()
    },
    bucList: ['mockBuc1'],
    tagList: ['mockTag1', 'mockTag2'],
    aktoerId: '456',
    loading: {},
    sakId: '123',
    subjectAreaList: ['mockSubjectArea1', 'mockSubjectArea2'],
    locale: 'nb',
    mode: 'widget',
    onTagsChanged: jest.fn(),
    setMode: jest.fn(),
    t: jest.fn(t => t)
  }

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

  it('Renders null if no sakId', () => {
    wrapper = mount(<BUCStart {...initialMockProps} sakId={undefined} />)
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('Renders null if no aktoerId', () => {
    wrapper = mount(<BUCStart {...initialMockProps} aktoerId={undefined} />)
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('Renders a spinner when fetching data', () => {
    wrapper.setProps({ loading: { gettingSubjectAreaList: true } })
    expect(wrapper.exists('.a-buc-c-bucstart__spinner')).toBeTruthy()
  })

  it('Renders as a standalone page', () => {
    wrapper.setProps({ mode: 'page' })
    expect(wrapper.exists('.a-buc-c-bucstart__page-title')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucstart EESSIPensjonVeilederPanel')).toBeTruthy()
  })

  it('UseEffect: fetches subject areas, bucs, tags list if empty', () => {
    wrapper = mount(
      <BUCStart
        {...initialMockProps}
        subjectAreaList={undefined}
        bucList={undefined}
        tagList={undefined}
      />)
    expect(initialMockProps.actions.getSubjectAreaList).toHaveBeenCalled()
    expect(initialMockProps.actions.getBucList).toHaveBeenCalled()
    expect(initialMockProps.actions.getTagList).toHaveBeenCalled()
  })

  it('UseEffect: saves bucsInfo after when buc was saved', () => {
    wrapper = mount(
      <BUCStart
        {...initialMockProps}
        bucsInfo={sampleBucsInfo as BucsInfo}
        buc={buc}
      />)
    expect(initialMockProps.actions.saveBucsInfo).toHaveBeenCalledWith({
      bucsInfo: sampleBucsInfo,
      aktoerId: '456',
      tags: [],
      buc: buc
    })
  })

  it('UseEffect: having buc and saved bucInfo makes you go to sednew menu', async (done) => {
    wrapper = mount(
      <BUCStart
        {...initialMockProps}
        bucsInfo={sampleBucsInfo as BucsInfo}
        buc={buc}
      />)

    expect(initialMockProps.setMode).not.toHaveBeenCalled()
    wrapper.setProps({
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
    })
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
    expect(initialMockProps.actions.createBuc).toHaveBeenCalledWith('mockBuc1')
  })

  it('Handles invalid onForwardButtonClick()', () => {
    expect(wrapper.find('button.a-buc-c-bucstart__forward-button').prop('disabled')).toBeTruthy()
    wrapper.find('#a-buc-c-bucstart__subjectarea-select-id').hostNodes().simulate('change', { target: { value: 'buc:form-chooseSubjectArea' } })
    wrapper.find('#a-buc-c-bucstart__buc-select-id').hostNodes().simulate('change', { target: { value: 'buc:form-chooseBuc' } })
    wrapper.update()
    wrapper.find('button.a-buc-c-bucstart__forward-button').hostNodes().simulate('click')
    expect(initialMockProps.actions.createBuc).toHaveBeenCalledWith('mockBuc1')
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
