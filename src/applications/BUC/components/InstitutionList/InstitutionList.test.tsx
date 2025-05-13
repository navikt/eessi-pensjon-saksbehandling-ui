import { stageSelector } from 'src/setupTests'
import InstitutionList, { InstitutionListProps } from './InstitutionList'
import { render, screen } from '@testing-library/react'

// InstitutionNames
const defaultSelector = {
  'NO:Mock1': 'Mock 1 institution',
  'NO:Mock2': 'Mock 2 institution'
}

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  const initialMockProps: InstitutionListProps = {
    institutions: [{
      country: 'NO',
      institution: 'Mock1'
    }, {
      country: 'NO',
      institution: 'Mock2'
    }],
    locale: 'nb'
  } as InstitutionListProps

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    render(<InstitutionList {...initialMockProps} />)
  })

  it('Render: Has proper HTML structure with joined type', () => {
    expect(screen.getAllByTestId('a_buc_c_institutionlist--div-id')).toHaveLength(1)
    expect(screen.getByTestId('a_buc_c_institutionlist--div-id')).toHaveTextContent('Mock1, Mock2')
  })

  it('Render: Has proper HTML structure with separated type', () => {
    render(<InstitutionList {...initialMockProps} type='separated' />)
    expect(screen.getAllByTestId('a_buc_c_institutionlist--div-id')).toHaveLength(3)
    expect(screen.getAllByTestId('a_buc_c_institutionlist--div-id')[1]).toHaveTextContent('Mock1')
    expect(screen.getAllByTestId('a_buc_c_institutionlist--div-id')[2]).toHaveTextContent('Mock2')
  })
})
