import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { Buc, BucsInfo } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import moment from 'moment'
import { stageSelector } from 'setupTests'
import BucHeader, { BUCHeaderProps, BUCHeaderSelector } from './BUCHeader'

const defaultSelector: BUCHeaderSelector = {
  gettingBucDeltakere: false,
  institutionNames: {},
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com',
  size: 'lg'
}

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
  let wrapper: ReactWrapper
  const buc: Buc = mockBucs()[0]
  buc.deltakere = buc.institusjon
  const initialMockProps: BUCHeaderProps = {
    buc: buc,
    bucInfo: (mockBucsInfo as BucsInfo).bucs['' + buc.caseId],
    newBuc: true
  } as BUCHeaderProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BucHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId + '\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__title-id\']').hostNodes().render().text()).toEqual('P_BUC_01 - buc:buc-P_BUC_01')
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__label-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__label-date-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__label-date-id\']').hostNodes().render().text()).toEqual(
      'ui:created: ' + moment(new Date(buc.startDate as number)).format('DD.MM.YYYY')
    )
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__label-owner-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__label-owner-institution-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__label-owner-id\']').hostNodes().render().text()).toEqual(
      'buc:form-caseOwner: NO:NAVAT07'
    )
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__label-case-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__label-case-id\']').hostNodes().render().text()).toEqual('buc:form-caseNumberInRina: 600891')

    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__label-avdod-id\']')).toBeFalsy()

    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__icon-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__icon-id\'] FlagList')).toBeTruthy()

    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__icon-numberofseds-id\']')).toBeTruthy()

    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__icon-numberofseds-id\']').hostNodes().render().text()).toEqual('' + buc.seds?.filter(sedFilter).length)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__icon-tags-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucheader__icon-tags-id\'] ProblemCircleIcon')).toBeTruthy()
  })

  it('Render: shows icon if we have tags', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__icon-tags-id\']')).toBeTruthy()
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
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucheader__icon-tags-id\']')).toBeFalsy()
  })

  it('Handling: open Rina link', () => {
    window.open = jest.fn()
    wrapper.find('[data-test-id=\'a-buc-c-bucheader__label-case-gotorina-link-id\']').first().simulate('click')
    expect(window.open).toHaveBeenCalledWith(defaultSelector.rinaUrl! + initialMockProps.buc.caseId, 'rinaWindow')
  })
})
