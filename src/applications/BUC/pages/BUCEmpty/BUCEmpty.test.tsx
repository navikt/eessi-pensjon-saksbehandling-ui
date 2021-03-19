import { setStatusParam } from 'actions/app'
import { mount, ReactWrapper } from 'enzyme'
import { stageSelector } from 'setupTests'
import BUCEmpty, { BUCEmptyArtwork, BUCEmptyDiv, BUCEmptyProps } from './BUCEmpty'

const defaultSelector = {
  highContrast: false,
  rinaUrl: 'http://mock.url'
}

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

describe('applications/BUC/widgets/BUCEmpty/BUCEmpty', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCEmptyProps = {
    aktoerId: undefined,
    sakId: undefined
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure with forms when no aktoerId and sakId', () => {
    expect(wrapper.exists(BUCEmptyDiv)).toBeTruthy()
    expect(wrapper.exists(BUCEmptyArtwork)).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__aktoerid-input-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__aktoerid-button-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__sakid-input-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__sakid-button-id\']')).toBeTruthy()
  })

  it('Render: has proper HTML structure without forms when aktoerId and sakId', () => {
    const mockProps = {
      ...initialMockProps,
      aktoerId: '123',
      sakId: '456'
    }
    wrapper = mount(<BUCEmpty {...mockProps} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__aktoerid-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__aktoerid-button-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__sakid-input-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucempty__sakid-button-id\']')).toBeFalsy()
  })

  it('Handling: adding aktoerId and sakId', () => {
    wrapper.find('[data-test-id=\'a-buc-p-bucempty__aktoerid-input-id\']').hostNodes().simulate('change', { target: { value: 'notvalid' } })
    wrapper.find('[data-test-id=\'a-buc-p-bucempty__aktoerid-button-id\']').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.find('[data-test-id=\'a-buc-p-bucempty__aktoerid-input-id\'] .skjemaelement__feilmelding').render().text()).toEqual('buc:validation-noAktoerId')

    wrapper.find('[data-test-id=\'a-buc-p-bucempty__aktoerid-input-id\']').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('[data-test-id=\'a-buc-p-bucempty__aktoerid-button-id\']').hostNodes().simulate('click')
    wrapper.update()
    expect(setStatusParam).toBeCalledWith('aktoerId', '123')

    wrapper.find('[data-test-id=\'a-buc-p-bucempty__sakid-input-id\']').hostNodes().simulate('change', { target: { value: 'notvalid' } })
    wrapper.find('[data-test-id=\'a-buc-p-bucempty__sakid-button-id\']').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.find('[data-test-id=\'a-buc-p-bucempty__sakid-input-id\'] .skjemaelement__feilmelding').render().text()).toEqual('buc:validation-noSakId')

    wrapper.find('[data-test-id=\'a-buc-p-bucempty__sakid-input-id\']').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('[data-test-id=\'a-buc-p-bucempty__sakid-button-id\']').hostNodes().simulate('click')
    wrapper.update()
    expect(setStatusParam).toBeCalledWith('sakId', '123')
  })
})
