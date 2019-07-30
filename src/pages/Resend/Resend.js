import React from 'react'
import * as urls from 'constants/urls'
import cookies from 'browser-cookies'

import fetch from 'cross-fetch'
import 'cross-fetch/polyfill'

const CSRF_PROTECTION = cookies.get('NAV_CSRF_PROTECTION')
  ? { NAV_CSRF_PROTECTION: cookies.get('NAV_CSRF_PROTECTION') }
  : {}

export default class Resend extends React.Component {
  state = {
    requestStack: []
  }

  submitHandler = async (e) => {
    e.preventDefault()
    const fileName = document.getElementById('resend-fileName').value
    const response = await fetch(urls.API_SUBMISSION_RESUBMIT_URL, {
      method: 'POST',
      crossOrigin: true,
      json: true,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...CSRF_PROTECTION
      },
      body: fileName
    })
    console.log(response)
    this.setState({ requestStack: [...this.state.requestStack, { fileName, response }] })
  }

  render () {
    return (
      <form id='resend-form' onSubmit={this.submitHandler}>
        <div className='container'>
          <div className='row'>
            <div className='col-auto'>
              <span>Filnavn</span>
            </div>
            <div className='col-auto w-75'>
              <input className='w-100' id='resend-fileName' type='text' />
            </div>
            <div className='col-auto'>
              <input id='resend-submit' type='submit' />
            </div>
          </div>
          {this.state.requestStack.map(request => {
            const result = request.response.ok ? 'OK' : 'FEILET'
            const message = request.response.statusText
            const status = request.response.status
            const fileName = request.fileName
            return (
              <div className='row'>
                <span>{result}:{message}:{status}:{fileName}</span>
              </div>
            )
          })}
        </div>
      </form>
    )
  }
}
