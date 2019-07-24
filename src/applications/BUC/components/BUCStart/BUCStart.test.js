import React from 'react'
import BUCStart from './BUCStart'

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
  let wrapper
  let initialMockProps = {
    actions: {
      createBuc: jest.fn(),
      verifyCaseNumber: jest.fn(),
      setStatusParam: jest.fn(),
      getSubjectAreaList: jest.fn(),
      getBucList: jest.fn(),
      getTagList: jest.fn(),
      saveBucsInfo: jest.fn(),
      setMode: jest.fn(),
      resetBuc: jest.fn()
    },
    bucList: ['mockBuc1'],
    currentBUC: { casenumber: '123', pinid: '456' },
    tagList: ['mockTag1', 'mockTag2'],
    aktoerId: '456',
    loading: {},
    sakId: '123',
    subjectAreaList: ['mockSubjectArea1', 'mockSubjectArea2'],
    locale: 'nb',
    mode: 'widget',
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<BUCStart {...initialMockProps} />)
  })

  it('renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('useEffect: verifies case number in no currentBUC is provided', () => {
    expect(initialMockProps.actions.verifyCaseNumber).toHaveBeenCalledWith({
      sakId: '123',
      aktoerId: '456'
    })
  })

  it('useEffect: fetches subject areas, bucs, tags list if empty', () => {
    wrapper = mount(<BUCStart {...initialMockProps}
      subjectAreaList={undefined}
      bucList={undefined}
      tagList={undefined}
    />)
    expect(initialMockProps.actions.getSubjectAreaList).toHaveBeenCalled()
    expect(initialMockProps.actions.getBucList).toHaveBeenCalled()
    expect(initialMockProps.actions.getTagList).toHaveBeenCalled()
  })

  it('useEffect: saves bucsInfo after when buc was saved', () => {
    wrapper = mount(<BUCStart {...initialMockProps}
      bucsInfo={{ bucs: 'mockBucs' }}
      buc={{ foo: 'bar' }}
    />)
    expect(initialMockProps.actions.saveBucsInfo).toHaveBeenCalledWith({
      bucsInfo: { 'bucs': 'mockBucs' },
      aktoerId: '456',
      tags: [],
      buc: { foo: 'bar' }
    })
  })

  it('useEffect: having buc and saved bucInfo makes you go to sednew menu', async (done) => {
    wrapper = mount(<BUCStart {...initialMockProps}
      bucsInfo={{ bucs: 'mockBucs' }}
      buc={{ foo: 'bar' }}
    />)

    expect(initialMockProps.actions.setMode).not.toHaveBeenCalled()
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
        expect(initialMockProps.actions.setMode).toHaveBeenCalledWith('sednew')
        done()
      }, 500)
    })
  })

  it('onForwardButtonClick()', () => {
    expect(wrapper.find('button.a-buc-c-bucstart__forward-button').prop('disabled')).toBe(true)
    wrapper.find('#a-buc-c-bucstart__subjectarea-select-id').hostNodes().prop('onChange')({ target: { value: 'Pensjon' } })
    wrapper.find('#a-buc-c-bucstart__buc-select-id').hostNodes().prop('onChange')({ target: { value: 'mockBuc1' } })
    wrapper.update()
    wrapper.find('button.a-buc-c-bucstart__forward-button').simulate('click')
    expect(initialMockProps.actions.createBuc).toHaveBeenCalledWith('mockBuc1')
  })

  it('onCancelButtonClick()', () => {
    expect(wrapper.find('button.a-buc-c-bucstart__cancel-button').prop('disabled')).toBe(false)
    wrapper.find('button.a-buc-c-bucstart__cancel-button').simulate('click')
    expect(initialMockProps.actions.setMode).toHaveBeenCalledWith('buclist')
  })

  it('render()', () => {
    expect(wrapper.exists('div.a-buc-c-bucstart')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucstart__subjectarea-select')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucstart__buc-select')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucstart__tags-select')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucstart__buttons')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucstart__forward-button')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucstart__cancel-button')).toEqual(true)
  })
})
