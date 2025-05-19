import { render, screen } from '@testing-library/react'
import SEDSearch, { SEDSearchProps } from './SEDSearch'

describe('applications/BUC/components/SEDSearch/SEDSearch', () => {
  const initialMockProps: SEDSearchProps = {
    onSearch: jest.fn(),
    onStatusSearch: jest.fn(),
    value: undefined
  }

  beforeEach(() => {
    render(<SEDSearch {...initialMockProps} />)
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId('a_buc_c_sedsearch--panel-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedsearch--query-input-id')).toBeInTheDocument()
    expect(screen.getByText('buc:form-searchForStatus')).toBeTruthy()
  })

/*  it('Handling: query change', () => {
    (initialMockProps.onSearch as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'a_buc_c_sedsearch--query-input-id').hostNodes().simulate('change', { target: { value: 'mockSearch' } })
    expect(initialMockProps.onSearch).toBeCalledWith('mockSearch')
  })

  it('Handling: status change', () => {
    (initialMockProps.onStatusSearch as jest.Mock).mockReset()
    const statusSelect = wrapper.find('[data-testid=\'a_buc_c_sedsearch--status-select-id\'] input').hostNodes()
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(initialMockProps.onStatusSearch).toBeCalledWith([{ label: 'ui:cancelled', value: 'cancelled' }])
  })*/
})
