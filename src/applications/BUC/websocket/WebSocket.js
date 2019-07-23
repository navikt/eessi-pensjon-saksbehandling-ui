import React, { useState } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import SockJsClient from 'react-stomp'
import { Knapp, Normaltekst } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'

import './WebSocket.css'

const DISCONNECTED = 'DISCONNECTED'
const CONNECTED = 'CONNECTED'
const UPDATING = 'UPDATING'

const BucWebSocket = (props) => {
  const { onUpdate, url } = props
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
      if (typeof onUpdate === 'function') {
        onUpdate(data)
      }
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
      {status === UPDATING ?
      <Icons kind='refresh' /> :
      <Icons kind={status === CONNECTED ? 'checkCircle' : 'removeCircle'}/> }
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

BucWebSocket.propTypes = {
  onUpdate: PT.func.isRequired,
  url: PT.string.isRequired
}

export default BucWebSocket
