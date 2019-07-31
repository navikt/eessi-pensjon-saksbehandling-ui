import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import cookies from 'browser-cookies'
import classNames from 'classnames'
import SockJsClient from 'react-stomp'
import { Knapp, Normaltekst } from 'components/Nav'
import Icons from 'components/Icons'

import './WebSocket.css'

const DISCONNECTED = 'DISCONNECTED'
const CONNECTED = 'CONNECTED'
const UPDATING = 'UPDATING'

const BucWebSocket = (props) => {
  const { onSedUpdate, url } = props
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState(DISCONNECTED)
  let webSocketRef = null

const CSRF_PROTECTION = cookies.get('NAV_CSRF_PROTECTION')

  // We ave to add NAV_CSRF_PROTECTION headers for websocket's xhr calls,
  // as they are the simple http transport that is not blocked
  useEffect(() => {
    if (!mounted) {
      let o = XMLHttpRequest.prototype.open
      let headersAdded = false
      XMLHttpRequest.prototype.open = function() {
        let res = o.apply(this, arguments)
        if (!headersAdded && CSRF_PROTECTION) {
          this.setRequestHeader('NAV_CSRF_PROTECTION', CSRF_PROTECTION)
          console.log('Applying NAV_CSRF_PROTECTION header to xhr')
          headersAdded = true
        }
        return res
      }
      setMounted(true)
    }
  }, [mounted])

  const onMessageReceived = (data, topic) => {
    if (topic === '/topic/10') {
      setCount(parseInt(data.message, 10))
    }
    if (topic === '/topic/1') {
      setCount(count + parseInt(data.message, 10))
    }
    if (topic === '/sed' && typeof onSedUpdate === 'function') {
      onSedUpdate(data)
    }
  }

  const onConnect = () => {
    setStatus(CONNECTED)
  }

  const onDisconnect = () => {
    setStatus(DISCONNECTED)
  }

  const sendMessage = () => {
    webSocketRef.sendMessage('/buc/increment', count)
  }

  return <div className='a-buc-websocket'>
    <div
      className={classNames('a-buc-websocket__status', { rotating: status === UPDATING })}
      title={'websocket: ' + status}>
      {status === UPDATING
        ? <Icons kind='refresh' />
        : <Icons kind={status === CONNECTED ? 'checkCircle' : 'removeCircle'} /> }
    </div>
    <Normaltekst className='a-buc-websocket__number ml-2'>
      {count}
    </Normaltekst>
    <Knapp mini
      id='a-buc-websocket__button-id'
      className='a-buc-websocket__button ml-2'
      style={{ pading: '0px' }}
      disabled={status === 'DISCONNECTED'}
      onClick={() => sendMessage()}>+1</Knapp>
    <SockJsClient
      url={url}
      options={{
   //     transports: ['xdr-streaming', 'xdr-polling']
      }}
      topics={['/topic/1', '/topic/10', '/buc']}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      onMessage={onMessageReceived}
      debug={true}
      reconnect
      ref={ws => webSocketRef = ws}
    />
  </div>
}

BucWebSocket.propTypes = {
  onSedUpdate: PT.func.isRequired,
  url: PT.string.isRequired
}

export default BucWebSocket
