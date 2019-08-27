import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Icons from 'components/Icons'
import { WEBSOCKET_LOCALHOST_URL } from 'constants/urls'

import './WebSocket.css'

const NOTCONNECTED = 'NOTCONNECTED'
const CONNECTING = 'CONNECTING'
const CONNECTED = 'CONNECTED'
const RECEIVING = 'RECEIVING'
const ERROR = 'ERROR'

const BucWebSocket = (props) => {
  const { actions, aktoerId } = props
  const [status, setStatus] = useState(NOTCONNECTED)
  const [websocketConnection, setWebsocketConnection] = useState(undefined)
  const [websocketReady, setWebsocketReady] = useState(false)

  useEffect(() => {
    if (!websocketConnection) {
      console.log('WebSocket: Connecting...')
      setWebsocketConnection(connectToWebSocket())
    }
  }, [websocketReady])

  const onMessageHandler = (e) => {
    console.log('Websocket: Got message', e)
    setStatus(RECEIVING)
    try {
      const data = JSON.parse(e.data)
      if (data.bucUpdated) {
        console.log('Websocket: Updating buc ', data.bucUpdated)
        actions.fetchSingleBuc(data.bucUpdated)
      }
      if (data.subscriptions) {
        console.log('Websocket: Subscription status is ', data.subscriptions)
      }
    } catch (err) {
      console.error('Websocket: Invalid JSON', e.data)
    } finally {
      setStatus(CONNECTED)
    }
  }

  const websocketSubscribe = (connection, aktoerId) => {
    console.log('Websocket: subscribing to aktoerId', aktoerId)
    connection.send('{"subscriptions": ["' + aktoerId + '"]}')
  }

  const connectToWebSocket = (onOpen, onMessage, onClose, onError) => {
    setStatus(CONNECTING)
    const webSocketURL = window.eessipen
      ? window.eessipen.WEBSOCKETURL.replace('https', 'wss').concat('bucUpdate')
      : WEBSOCKET_LOCALHOST_URL
    const connection = new WebSocket(webSocketURL, 'v0.Buc')
    connection.onopen = () => {
      console.log('Websocket: Connected')
      setStatus(CONNECTED)
      setWebsocketReady(true)
      websocketSubscribe(connection, aktoerId)
    }
    connection.onmessage = onMessageHandler
    connection.onclose = () => {
      console.log('Websocket: Closed')
      setStatus(NOTCONNECTED)
      setWebsocketReady(false)
    }
    connection.onerror = (e) => {
      console.log('Websocket: Error', e)
      setStatus(ERROR)
      setWebsocketReady(false)
    }
    return connection
  }

  return (
    <div className='a-buc-websocket'>
      <div
        className={classNames('a-buc-websocket__status', { rotating: status === 'RECEIVING' })}
        title={'websocket: ' + status}
      >
        {status === CONNECTED ? <Icons kind='checkCircle' /> : null}
        {status === NOTCONNECTED || status === ERROR ? <Icons kind='removeCircle' /> : null}
        {status === CONNECTING || status === RECEIVING ? <Icons kind='connecting' /> : null}
      </div>
    </div>
  )
}

BucWebSocket.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired
}

export default BucWebSocket
