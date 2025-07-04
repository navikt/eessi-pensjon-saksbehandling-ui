import { setStatusParam } from 'src/actions/app'
import { render, screen } from '@testing-library/react'
import { stageSelector } from 'src/setupTests'
import BUCEmpty, { BUCEmptyArtwork, BUCEmptyDiv, BUCEmptyProps } from './BUCEmpty'

const defaultSelector = {
  rinaUrl: 'http://mock.url'
}

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

describe('applications/BUC/components/BUCEmpty/BUCEmpty', () => {
  let wrapper: any

  const initialMockProps: BUCEmptyProps = {
    aktoerId: undefined,
    sakId: undefined
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<BUCEmpty {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: has proper HTML structure with forms when no aktoerId and sakId', () => {
    expect(wrapper.exists(BUCEmptyDiv)).toBeTruthy()
    expect(wrapper.exists(BUCEmptyArtwork)).toBeTruthy()
    expect(screen.getByTestId('a-buc-p-bucempty--aktoerid-input-id')).toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucempty--aktoerid-button-id')).toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucempty--sakid-input-id')).toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucempty--sakid-button-id')).toBeTruthy()
  })

  it('Render: has proper HTML structure without forms when aktoerId and sakId', () => {
    const mockProps = {
      ...initialMockProps,
      aktoerId: '123',
      sakId: '456'
    }
    wrapper = render(<BUCEmpty {...mockProps} />)
    expect(screen.getByTestId('a-buc-p-bucempty--aktoerid-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucempty--aktoerid-button-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucempty--sakid-input-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucempty--sakid-button-id')).not.toBeInTheDocument()
  })

  it('Handling: adding aktoerId and sakId', () => {
    wrapper.find('[data-testid=\'a-buc-p-bucempty--aktoerid-input-id').hostNodes().simulate('change', { target: { value: 'notvalid' } })
    wrapper.find('[data-testid=\'a-buc-p-bucempty--aktoerid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.find('[data-testid=\'a-buc-p-bucempty--aktoerid-input-id\'] .skjemaelement--feilmelding').render().text()).toEqual('message:validation-noAktoerId')

    wrapper.find('[data-testid=\'a-buc-p-bucempty--aktoerid-input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('[data-testid=\'a-buc-p-bucempty--aktoerid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(setStatusParam).toHaveBeenCalledWith('aktoerId', '123')

    wrapper.find('[data-testid=\'a-buc-p-bucempty--sakid-input-id').hostNodes().simulate('change', { target: { value: 'notvalid' } })
    wrapper.find('[data-testid=\'a-buc-p-bucempty--sakid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.find('[data-testid=\'a-buc-p-bucempty--sakid-input-id\'] .skjemaelement--feilmelding').render().text()).toEqual('message:validation-noSakId')

    wrapper.find('[data-testid=\'a-buc-p-bucempty--sakid-input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('[data-testid=\'a-buc-p-bucempty--sakid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(setStatusParam).toHaveBeenCalledWith('sakId', '123')
  })
})
