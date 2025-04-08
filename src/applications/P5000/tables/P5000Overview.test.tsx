
import { Sed, Seds } from 'src/declarations/buc'
import { P5000sFromRinaMap } from 'src/declarations/p5000'
import { render } from '@testing-library/react'
import _ from 'lodash'
import mockBucs from 'src/mocks/buc/bucs'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockP50001 from 'src/mocks/buc/sed_P5000_small1'
import mockP50002 from 'src/mocks/buc/sed_P5000_small2'
import { stageSelector } from 'src/setupTests'
import Table from '@navikt/tabell'
import P5000Overview, { P5000OverviewProps, P5000OverviewSelector } from './P5000Overview'

const defaultSelector: P5000OverviewSelector = {
  featureToggles: mockFeatureToggles
}

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_DEVELOPMENT: 'development',
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('md5', () => (value: any) => value)
describe('applications/BUC/components/P5000/P5000', () => {
  let wrapper: any

  const initialMockProps: P5000OverviewProps = {
    aktoerId: '123',
    caseId: '234',
    p5000FromS3: null,
    seds: _.filter(mockBucs()[0].seds, (sed: Sed) => sed.type === 'P5000') as Seds,
    p5000sFromRinaMap: {
      '60578cf8bf9f45a7819a39987c6c8fd4': mockP50001,
      '50578cf8bf9f45a7819a39987c6c8fd4': mockP50002
    } as P5000sFromRinaMap,
    p5000WorkingCopies: undefined
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<P5000Overview {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: Has proper HTML structure', () => {
    // expect(screen.getByTestId('a_buc_c_P5000--checkbox-60578cf8bf9f45a7819a39987c6c8fd4\']')).toBeTruthy()
    // expect(screen.getByTestId('a_buc_c_P5000--checkbox-50578cf8bf9f45a7819a39987c6c8fd4\']')).toBeTruthy()
    expect(wrapper.exists(Table)).toBeTruthy()
    expect(wrapper.find('.tabell:not(.print-version) th').hostNodes().map((it: any) => it.render().text())).toEqual([
      '', 'ui:country', 'ui:_institution', 'ui:type', 'ui:startDate', 'ui:endDate', 'ui:year', 'ui:quarter', 'ui:month',
      'ui:week', 'ui:days/ui:unit', 'ui:relevantForPerformance', 'ui:scheme', 'ui:calculationInformation'
    ])
  })
})
