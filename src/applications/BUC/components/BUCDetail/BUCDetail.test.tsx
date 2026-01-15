import { Buc } from 'src/declarations/buc'
import { PersonAvdods } from 'src/declarations/person.d'
import { render, screen } from '@testing-library/react'
import personAvdod from 'src/mocks/person/personAvdod'
import mockBucs from 'src/mocks/buc/bucs'
import { stageSelector } from 'src/setupTests'
import BUCDetail, { BUCDetailProps, BUCDetailSelector } from './BUCDetail'
import dayjs from "dayjs";

const defaultSelector: BUCDetailSelector = {
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com'
}

const buc: Buc = mockBucs()[0] as Buc
const mockPersonAvdods: PersonAvdods | undefined = personAvdod(1)

describe('applications/BUC/components/BUCDetail/BUCDetail', () => {
  const initialMockProps: BUCDetailProps = {
    buc,
    personAvdods: mockPersonAvdods
  } as BUCDetailProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: has proper HTML structure', () => {
    render(<BUCDetail {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCDetail--panel_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCDetail--status_id')).toHaveTextContent('buc:status-' + buc.status)
    expect(screen.getByTestId('a_buc_c_BUCDetail--creator_id')).toHaveTextContent('NO:NAVAT07')
    expect(screen.getByTestId('a_buc_c_BUCDetail--startDate_id')).toHaveTextContent(dayjs(new Date(buc.startDate as number)).format('DD.MM.YYYY'))
    expect(screen.getByTestId('a_buc_c_BUCDetail--caseId_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCDetail--gotorina_link_id')).toHaveTextContent('' + buc.caseId)
    expect(screen.queryByTestId('a_buc_c_BUCDetail--avdod_id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCDetail--institutions_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCDetail--institutions_id')).toHaveTextContent(/.*/)
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
    render(<BUCDetail {...mockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCDetail--avdod_id')).toBeInTheDocument()
  })

  it('Render: Show warning when buc is read only', () => {
    const mockProps = {
      ...initialMockProps,
      buc: {
        ...initialMockProps.buc,
        readOnly: true
      }
    }
    render(<BUCDetail {...mockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCDetail--readonly')).toBeInTheDocument()
  })

  it('Render: no rinaUrl', () => {
    stageSelector(defaultSelector, { rinaUrl: undefined })
    render(<BUCDetail {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCDetail--gotorina_waiting_id')).toBeInTheDocument()
  })

  it('Render: no avdods', () => {
    const mockProps = {
      ...initialMockProps,
      personAvdods: [],
      buc: {
        ...initialMockProps.buc,
        type: 'P_BUC_02'
      }
    }
    render(<BUCDetail {...mockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCDetail--avdod_id')).toHaveTextContent('buc:form-noAvdod')
  })
})
