import { Buc, BucsInfo } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import moment from 'moment'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import { stageSelector } from 'setupTests'
import Flag from 'flagg-ikoner'
import BucHeader, { BUCHeaderProps, BUCHeaderSelector } from './BUCHeader'

const defaultSelector: BUCHeaderSelector = {
  highContrast: false,
  gettingBucDeltakere: false,
  institutionNames: {},
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com'
}

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
  let wrapper: ReactWrapper
  const buc: Buc = mockBucs()[0]
  buc.deltakere = buc.institusjon
  const initialMockProps: BUCHeaderProps = {
    buc: buc,
    bucInfo: (mockBucsInfo as BucsInfo).bucs['' + buc.caseId],
    onBUCEdit: jest.fn()
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<BucHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-bucheader')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__label')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__title')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__description')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__description').hostNodes().render().text()).toEqual(
      'ui:created: ' + moment(new Date(buc.startDate as number)).format('DD.MM.YYYY')
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__owner').hostNodes().render().text()).toEqual(
      'buc:form-caseOwner: NAVAT07'
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner-institutions')).toBeTruthy()
    expect(wrapper.exists(Flag)).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icons')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icon-numberofseds')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__icon-numberofseds').render().text()).toEqual('9')
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__actions')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__bucedit-link')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__bucedit-link').hostNodes().render().text()).toEqual('ui:processing')
  })

  it('Shows icons only if necessary', () => {
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeTruthy()
    wrapper.setProps({
      bucInfo: {
        tags: [],
        comment: undefined
      },
      buc: {
        ...buc,
        seds: []
      }
    })
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeFalsy()
  })

  it('Handles click in Lenke', () => {
    (initialMockProps.onBUCEdit as jest.Mock).mockReset()
    wrapper.find('a#a-buc-c-bucheader__bucedit-link-id').simulate('click')
    expect(initialMockProps.onBUCEdit).toHaveBeenCalled()
  })

  it('Handles Rina link', () => {
    window.open = jest.fn()
    wrapper.find('.a-buc-c-bucheader__gotorina-link').first().simulate('click')
    expect(window.open).toHaveBeenCalledWith(defaultSelector.rinaUrl! + initialMockProps.buc.caseId, 'rinaWindow')
  })
})
