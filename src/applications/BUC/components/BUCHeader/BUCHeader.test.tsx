import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { Buc, BucsInfo } from 'declarations/buc'
import { render, screen, fireEvent } from '@testing-library/react'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import moment from 'moment'
import { stageSelector } from 'setupTests'
import BUCHeader, { BUCHeaderProps, BUCHeaderSelector } from './BUCHeader'

const defaultSelector: BUCHeaderSelector = {
  institutionNames: {},
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com',
  size: 'lg'
}

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
  const buc: Buc = mockBucs()[0]
  buc.deltakere = buc.institusjon
  const initialMockProps: BUCHeaderProps = {
    buc,
    bucInfo: (mockBucsInfo as BucsInfo).bucs['' + buc.caseId],
    newBuc: true
  } as BUCHeaderProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: match snapshot', () => {
    const { container } = render(<BUCHeader {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<BUCHeader {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCHeader--' + buc.type + '_' + buc.caseId)).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--title_id')).toHaveTextContent('P_BUC_01 - buc:buc-P_BUC_01')
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_date_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_date_id')).toHaveTextContent(
      'ui:created: ' + moment(new Date(buc.startDate as number)).format('DD.MM.YYYY')
    )
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_owner_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_owner_institution_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_owner_id')).toHaveTextContent(
      'buc:form-caseOwner: NO:NAVAT07'
    )
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_case_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--label_case_id')).toHaveTextContent('buc:form-caseNumberInRina: 600891')

    expect(screen.getByTestId('a_buc_c_BUCHeader--label_avdod_id')).not.toBeInTheDocument()

    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_id FlagList')).toBeInTheDocument() // TODO

    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_numberofseds_id')).toBeInTheDocument()

    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_numberofseds_id')).toHaveTextContent('' + buc.seds?.filter(sedFilter).length)
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_tags_id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_tags_id ProblemCircleIcon')).toBeInTheDocument()
  })

  it('Render: shows icon if we have tags', () => {
    render(<BUCHeader {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_tags_id')).toBeInTheDocument()
    const mockProps = {
      ...initialMockProps,
      bucInfo: {
        tags: [],
        comment: undefined
      },
      buc: {
        ...buc,
        seds: []
      } as Buc
    }
    // @ts-ignore
    render(<BUCHeader {...mockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_tags_id')).not.toBeInTheDocument()
  })

  it('Handling: open Rina link', () => {
    window.open = jest.fn()
    fireEvent.click(screen.getByTestId('a_buc_c_BUCHeader--label_case_gotorina_link_id'))
    expect(window.open).toHaveBeenCalledWith(defaultSelector.rinaUrl! + initialMockProps.buc.caseId, 'rinaWindow')
  })
})
