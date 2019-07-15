import React, { useState, useRef } from 'react'
import SockJsClient from 'react-stomp'
import { Knapp, Normaltekst } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'
import { WEBSOCKET_URL } from 'constants/urls'

import './index.css'

const DISCONNECTED = 'DISCONNECTED'
const CONNECTED = 'CONNECTED'

const BucWebSocket = (props) => {
  const [ count, setCount ] = useState(0)
  const [ status, setStatus ] = useState(DISCONNECTED)
  let webSocketRef = null

  const onMessageReceived = (data, topic) => {
    if (topic === '/topic/10') {
      setCount(parseInt(data.message, 10))
    }
    if (topic === '/topic/1') {
      setCount(count + parseInt(data.message, 10))
    }
    if (topic === '/buc') {
      console.log(data)
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
    <div className='a-buc-websocket__status' title={'websocket: ' + status}>
      <Icons kind={status === CONNECTED ? 'checkCircle' : 'removeCircle'} />
    </div>
    <Normaltekst className='ml-2'>{count}</Normaltekst>
    <Knapp mini
      className='a-buc-websocket__button ml-2'
      style={{ pading: '0px' }}
      disabled={status === 'DISCONNECTED'}
      onClick={() => sendMessage()}>+1</Knapp>
    <SockJsClient
      url={WEBSOCKET_URL}
      topics={['/topic/1', '/topic/10', '/buc']}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      onMessage={onMessageReceived}
      debug={false}
      reconnect
      ref={ws => webSocketRef = ws}
    />
  </div>
}

export default BucWebSocket
