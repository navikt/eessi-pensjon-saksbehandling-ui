import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'
import { WebSocket } from 'mock-socket'
window.fetch = require('jest-fetch-mock')
Enzyme.configure({ adapter: new Adapter() })

global.shallow = shallow
global.render = render
global.mount = mount
global.act = act
global.WebSocket = WebSocket

// mock canvas function, as jsdom throws error if not here
HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()
window.location.reload = jest.fn()
window.open = jest.fn()
