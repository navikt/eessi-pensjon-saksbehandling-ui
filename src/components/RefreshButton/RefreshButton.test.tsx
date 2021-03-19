import { mount, ReactWrapper } from 'enzyme'
import RefreshButton, { RefreshButtonDiv, RefreshButtonProps } from './RefreshButton'

describe('components/RefreshButton', () => {
  let wrapper: ReactWrapper
  const initialMockProps: RefreshButtonProps = {
    onRefreshClicked: jest.fn(),
    rotating: false,
    labelRefresh: 'mockLabelRefresh'
  }

  it('Render: match snapshot', () => {
    wrapper = mount(<RefreshButton {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    (initialMockProps.onRefreshClicked as jest.Mock).mockReset()
    wrapper = mount(<RefreshButton {...initialMockProps} />)
    expect(wrapper.exists(RefreshButtonDiv)).toBeTruthy()
    expect(wrapper.find(RefreshButtonDiv).find('.lenke').props().title).toEqual(initialMockProps.labelRefresh)
    wrapper.find(RefreshButtonDiv).find('.lenke').hostNodes().simulate('click')
    expect(initialMockProps.onRefreshClicked).toHaveBeenCalled()
  })
})
