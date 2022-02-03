import TopContainer from 'components/TopContainer/TopContainer'
import { BUCMode, FeatureToggles } from 'declarations/app.d'
import { mount, ReactWrapper } from 'enzyme'
import { stageSelector } from 'setupTests'
import { IndexPage, IndexPageProps, IndexPageSelector } from './IndexPage'

const defaultSelector: IndexPageSelector = {
  mode: 'buclist' as BUCMode,
  username: 'mockUsername',
  message: 'messaage',
  featureToggles: {} as FeatureToggles,
  byline: 'byline',
  show: false
}

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-topcontainer'>
      {children}
    </div>
  )
})
jest.mock('components/ContextBanner/ContextBanner', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-contextbanner'>
      {children}
    </div>
  )
})

jest.mock('@navikt/dashboard', () => (props: any) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  <div className='mock-c-dashboard' onClick={() => props.afterLayoutChange()} />
))

describe('pages/IndexPage', () => {
  let wrapper: ReactWrapper
  const initialMockProps: IndexPageProps = {}

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<IndexPage {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(TopContainer)).toBeTruthy()
    expect(wrapper.exists('.mock-c-dashboard')).toBeTruthy()
  })
})
