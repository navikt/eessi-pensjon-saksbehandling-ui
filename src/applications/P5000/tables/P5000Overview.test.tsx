import { Sed, Seds } from 'declarations/buc'
import { P5000sFromRinaMap } from 'declarations/p5000'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockP50001 from 'mocks/buc/sed_P5000_small1'
import mockP50002 from 'mocks/buc/sed_P5000_small2'
import { stageSelector } from 'setupTests'
import Table from '@navikt/tabell'
import P5000Overview, { P5000OverviewProps, P5000OverviewSelector } from './P5000Overview'

const defaultSelector: P5000OverviewSelector = {
  featureToggles: mockFeatureToggles
}

jest.mock('md5', () => (value: any) => value)
describe('applications/BUC/components/P5000/P5000', () => {
  let wrapper: ReactWrapper

  const initialMockProps: P5000OverviewProps = {
    seds: _.filter(mockBucs()[0].seds, (sed: Sed) => sed.type === 'P5000') as Seds,
    p5000sFromRinaMap: {
      '60578cf8bf9f45a7819a39987c6c8fd4': mockP50001,
      '50578cf8bf9f45a7819a39987c6c8fd4': mockP50002
    } as P5000sFromRinaMap,
    p5000WorkingCopies: undefined
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<P5000Overview {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    // expect(wrapper.exists('[data-test-id=\'a-buc-c-P5000__checkbox-60578cf8bf9f45a7819a39987c6c8fd4\']')).toBeTruthy()
    // expect(wrapper.exists('[data-test-id=\'a-buc-c-P5000__checkbox-50578cf8bf9f45a7819a39987c6c8fd4\']')).toBeTruthy()
    expect(wrapper.exists(Table)).toBeTruthy()
    expect(wrapper.find('.tabell:not(.print-version) th').hostNodes().map(it => it.render().text())).toEqual([
      '', 'ui:country', 'ui:_institution', 'ui:type', 'ui:startDate', 'ui:endDate', 'ui:year', 'ui:quarter', 'ui:month',
      'ui:week', 'ui:days/ui:unit', 'ui:relevantForPerformance', 'ui:scheme', 'ui:calculationInformation'
    ])
  })
})
