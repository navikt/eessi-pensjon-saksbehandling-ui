import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import cheerio from 'cheerio'
window.fetch = require('jest-fetch-mock')

Enzyme.configure({ adapter: new Adapter() })

global.shallow = shallow
global.render = render
global.mount = mount
global.cheerio = cheerio

// mock canvas function, as jsdom throws error if not here
HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()
