import React from 'react'
import * as urls from '../../constants/urls'
import cookies from 'browser-cookies'

import fetch from 'cross-fetch'
import 'cross-fetch/polyfill'

const CSRF_PROTECTION = cookies.get('NAV_CSRF_PROTECTION')
? {'NAV_CSRF_PROTECTION': cookies.get('NAV_CSRF_PROTECTION') }
: {}

const submitHandler = (e) => {
  e.preventDefault()
  let fileName = document.getElementById('resend-fileName').value
  fetch(urls.API_SUBMISSION_RESUBMIT_URL, {
    method: 'POST',
    crossOrigin: true,
    json: true,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...CSRF_PROTECTION
    },
    body: fileName
  })
}

export default class Resend extends React.Component {
  render() {
    return (
      <form id='resend-form' onSubmit={submitHandler}>
        <span>Filnavn <input id='resend-fileName' type='text' /> <input id='resend-submit' type='submit' /></span>
      </form>
    )
  }
}
