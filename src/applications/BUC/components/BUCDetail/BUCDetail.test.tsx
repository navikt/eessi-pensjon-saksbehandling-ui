import { Buc } from 'declarations/buc'
import { PersonAvdods } from 'declarations/person.d'
import { mount, ReactWrapper } from 'enzyme'
import personAvdod from 'mocks/app/personAvdod'
import mockBucs from 'mocks/buc/bucs'
import moment from 'moment'
import React from 'react'
import { stageSelector } from 'setupTests'
import BUCDetail, { BUCDetailProps, BUCDetailSelector } from './BUCDetail'

const defaultSelector: BUCDetailSelector = {
  highContrast: false,
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com'
}

const buc: Buc = mockBucs()[0] as Buc
const mockPersonAvdods: PersonAvdods | undefined = personAvdod(1)

describe('applications/BUC/components/BUCDetail/BUCDetail', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCDetailProps = {
    buc: buc,
    personAvdods: mockPersonAvdods
  } as BUCDetailProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCDetail {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucdetail__panel-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucdetail__status-id\']').hostNodes().render().text()).toEqual('buc:status-' + buc.status)
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucdetail__creator-id\']').hostNodes().render().text()).toEqual('NO:NAVAT07')
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucdetail__startDate-id\']').hostNodes().render().text()).toEqual(moment(new Date(buc.startDate as number)).format('DD.MM.YYYY'))
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucdetail__caseId-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucdetail__gotorina-link-id\']').hostNodes().render().text()).toEqual(buc.caseId)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucdetail__avdod-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucdetail__institutions-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucdetail__institutionlist-id\']').render().text()).toEqual(['NO:NAVAT07', 'FR:DEMOFR01', 'GB:DEMOGB01', 'UK:DEMOUK01'].join(''))
  })

  it('Render: P_BUC_02 BUCs have an avdod', () => {
    const mockProps = {
      ...initialMockProps,
      buc: {
        ...initialMockProps.buc,
        type: 'P_BUC_02',
        addedParams: {
          subject: {
            gjenlevende: {
              fnr: '123'
            },
            avdod: {
              fnr: mockPersonAvdods![0].fnr
            }
          }
        }
      }
    }
    wrapper = mount(<BUCDetail {...mockProps} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucdetail__avdod-id\']')).toBeTruthy()
  })

  it('Render: Show warning when buc is read only', () => {
    const mockProps = {
      ...initialMockProps,
      buc: {
        ...initialMockProps.buc,
        readOnly: true
      }
    }
    wrapper = mount(<BUCDetail {...mockProps} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucdetail__readonly\']')).toBeTruthy()
  })
})
