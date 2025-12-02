
import { render, fireEvent, screen, getNodeText, cleanup } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useDispatch, useSelector } from 'react-redux'
import 'jest-styled-components'
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

jest.mock('react-redux');

(global as any).screen = screen;
(global as any).render = render;
(global as any).getNodeText = getNodeText;
(global as any).fireEvent = fireEvent;
(global as any).cleanup = cleanup;
(global as any).act = act

HTMLCanvasElement.prototype.getContext = jest.fn()
window.scrollTo = jest.fn()

class ResizeObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}
window.ResizeObserver = ResizeObserver

const crypto = require('crypto')

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
})

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ('')
  })
})

jest.mock('canvas', () => {
  return {};
});

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}))

jest.mock('i18next', () => {
  const use = jest.fn()
  const init = jest.fn()
  const loadLanguages = jest.fn()
  const t = jest.fn()
  const result = {
    use,
    init,
    loadLanguages,
    t
  }
  use.mockImplementation(() => result)
  return result
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key })
}))

jest.mock('react-pdf', () => {
  return {
    pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
    Document: (props: any) => {
      setTimeout(() => {
        props.onLoadSuccess({ numPages: 5 })
      }, 500)
      return (
        <div className='mock-pdfdocument'>
          {props.children}
          </div>
      )
    },
    Page: (props: any) => {
      return (
        <div className='mock-pdfpage'>
          {'Page: '}{props.pageNumber}
      </div>
    )
    }
  }
})

export const stageSelector = (defaultSelector: any, params: any) => {
  (useDispatch as jest.Mock).mockImplementation(() => jest.fn());
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}
