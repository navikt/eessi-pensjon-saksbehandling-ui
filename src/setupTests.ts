import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
//import { act } from 'react-dom/test-utils'
//import { WebSocket } from 'mock-socket'

Enzyme.configure({ adapter: new Adapter() })

// eslint-disable-next-line no-undef
HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()
window.location.reload = jest.fn()
window.open = jest.fn()
window.fetch = require('jest-fetch-mock')
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ('')
  })
})
