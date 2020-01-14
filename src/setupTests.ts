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
