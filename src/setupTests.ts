import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

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
