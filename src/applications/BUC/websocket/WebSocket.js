import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Icons from 'components/Icons'
import { WEBSOCKET_LOCALHOST_URL } from 'constants/urls'

const NOTCONNECTED = 'NOTCONNECTED'
const CONNECTING = 'CONNECTING'
const CONNECTED = 'CONNECTED'
const RECEIVING = 'RECEIVING'
const ERROR = 'ERROR'

const BucWebSocket = (props) => {
  const { actions } = props
  const [status, setStatus] = useState(NOTCONNECTED)
  const [websocketConnection, setWebsocketConnection] = useState(undefined)
  const [websocketReady, setWebsocketReady] = useState(false)

  useEffect(() => {
    if (!websocketConnection) {
      console.log('Connecting to websocket')
      setWebsocketConnection(connectToWebSocket())
    }
  }, [websocketReady])

  const onBucUpdate = (e) => {
    console.log('got websocket update', e)
    setStatus(RECEIVING)
    try {
      const data = JSON.parse(e.data)
      if (data.bucUpdated) {
        actions.fetchSingleBuc(data.bucUpdated)
      }
    } catch (err) {
      console.error('Invalid JSON', e.data)
    } finally {
      setStatus(CONNECTED)
    }
  }

  const connectToWebSocket = (onOpen, onMessage, onClose, onError) => {
    setStatus(CONNECTING)
    const webSocketURL = window.eessipen
      ? window.eessipen.WEBSOCKETURL.replace('https', 'wss').concat('bucUpdate')
      : WEBSOCKET_LOCALHOST_URL
    const connection = new WebSocket(webSocketURL, 'v0.Buc')
    connection.onopen = () => {
      setStatus(CONNECTED)
      setWebsocketReady(true)
    }
    connection.onmessage = onBucUpdate
    connection.onclose = () => {
      setStatus(NOTCONNECTED)
      setWebsocketReady(false)
    }
    connection.onerror = () => {
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
        {status === NOTCONNECTED ? <Icons kind='removeCircle' /> : null}
        {status === CONNECTING ? <div>...</div> : null}
      </div>
    </div>
  )
}

BucWebSocket.propTypes = {
  actions: PT.object.isRequired
}

export default BucWebSocket
