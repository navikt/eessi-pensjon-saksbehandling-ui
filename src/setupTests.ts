import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'
Enzyme.configure({ adapter: new Adapter() });

(global as any).shallow = shallow;
(global as any).render = render;
(global as any).mount = mount;
(global as any).act = act

// eslint-disable-next-line no-undef
HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()
window.location.reload = jest.fn()
window.fetch = require('jest-fetch-mock')
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ('')
  })
})

jest.mock('i18next', () => {
  const use = jest.fn()
  const init = jest.fn()
  const loadLanguages = jest.fn()
  const result = {
    use: use,
    init: init,
    loadLanguages: loadLanguages
  }
  use.mockImplementation(() => result)
  return result
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key })
}))
