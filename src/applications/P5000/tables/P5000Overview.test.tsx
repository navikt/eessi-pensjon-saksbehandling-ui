
import { Sed, Seds } from 'src/declarations/buc'
import { P5000sFromRinaMap } from 'src/declarations/p5000'
import { render, screen } from '@testing-library/react'
import _ from 'lodash'
import mockBucs from 'src/mocks/buc/bucs'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockP50001 from 'src/mocks/buc/sed_P5000_small1'
import mockP50002 from 'src/mocks/buc/sed_P5000_small2'
import { stageSelector } from 'src/setupTests'
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

  const initialMockProps: P5000OverviewProps = {
    fnr: '123',
    caseId: '234',
    p5000FromS3: null,
    seds: _.filter(mockBucs()[0].seds, (sed: Sed) => sed.type === 'P5000') as Seds,
    p5000sFromRinaMap: {
      '60578cf8bf9f45a7819a39987c6c8fd4': mockP50001,
      '50578cf8bf9f45a7819a39987c6c8fd4': mockP50002
    } as P5000sFromRinaMap,
    p5000WorkingCopies: undefined,
    mainSed: undefined
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    render(<P5000Overview {...initialMockProps} />)
  })

  it('Render: Has proper HTML structure', () => {
    // expect(screen.getByTestId('a_buc_c_P5000--checkbox-60578cf8bf9f45a7819a39987c6c8fd4\']')).toBeTruthy()
    // expect(screen.getByTestId('a_buc_c_P5000--checkbox-50578cf8bf9f45a7819a39987c6c8fd4\']')).toBeTruthy()
    expect(screen.getByText('ui:country')).toBeInTheDocument()
    expect(screen.getByText('ui:_institution')).toBeInTheDocument()
    expect(screen.getByText('ui:type')).toBeInTheDocument()
    expect(screen.getByText('ui:startDate')).toBeInTheDocument()
    expect(screen.getByText('ui:endDate')).toBeInTheDocument()
    expect(screen.getByText('ui:year')).toBeInTheDocument()
    expect(screen.getByText('ui:month')).toBeInTheDocument()
    expect(screen.getByText('ui:days/ui:unit')).toBeInTheDocument()
    expect(screen.getByText('ui:relevantForPerformance')).toBeInTheDocument()
    expect(screen.getByText('ui:scheme')).toBeInTheDocument()
    expect(screen.getByText('ui:calculationInformation')).toBeInTheDocument()
  })
})
