import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import Icons from 'components/Icons'
import { HjelpetekstAuto } from 'components/Nav'
import { WEBSOCKET_LOCALHOST_URL } from 'constants/urls'
import { IS_TEST } from 'constants/environment'

import './WebSocket.css'

const NOTCONNECTED = 'NOTCONNECTED'
const CONNECTING = 'CONNECTING'
const CONNECTED = 'CONNECTED'
const RECEIVING = 'RECEIVING'
const ERROR = 'ERROR'

const BucWebSocket = (props) => {
  const { actions, aktoerId, avdodfnr } = props
  const [status, setStatus] = useState(NOTCONNECTED)
  const [log, setLog] = useState([])
  const [websocketConnection, setWebsocketConnection] = useState(undefined)

  const connectToWebSocket = (onOpen, onMessage, onClose, onError) => {
    setStatus(CONNECTING)
    const webSocketURL = window.eessipen
      ? window.eessipen.WEBSOCKETURL.replace('https', 'wss').concat('bucUpdate')
      : WEBSOCKET_LOCALHOST_URL
    pushToLog('info', 'Connecting to ' + webSocketURL + '...')
    const connection = new WebSocket(webSocketURL, 'v0.Buc')
    connection.onopen = () => {
      pushToLog('info', 'Connected')
      setStatus(CONNECTED)
      websocketSubscribe(connection, aktoerId)
    }
    connection.onmessage = onMessageHandler
    connection.onclose = () => {
      pushToLog('info', 'Closed')
      setStatus(NOTCONNECTED)
    }
    connection.onerror = (e) => {
      pushToLog('error', 'Error: ' + e)
      setStatus(ERROR)
    }
    return connection
  }

  useEffect(() => {
    if (!websocketConnection) {
      setWebsocketConnection(connectToWebSocket())
    }
  }, [connectToWebSocket, websocketConnection])

  const onMessageHandler = (e) => {
    setStatus(RECEIVING)
    try {
      const data = JSON.parse(e.data)
      if (data.bucUpdated && data.bucUpdated.caseId) {
        pushToLog('info', 'Updating buc ' + data.bucUpdated.caseId)
        actions.fetchSingleBuc(data.bucUpdated.caseId)
      }
      if (data.subscriptions) {
        pushToLog('info', 'Subscription status is ' + data.subscriptions)
      }
    } catch (err) {
      pushToLog('error', 'Invalid JSON: ' + e.data)
    } finally {
      setStatus(CONNECTED)
    }
  }

  const websocketSubscribe = (connection) => {
    const ids = []
    if (aktoerId) {
      ids.push(aktoerId)
    }
    if (avdodfnr) {
      ids.push(avdodfnr)
    }
    if (!_.isEmpty(ids)) {
      const message = {
        subscriptions: ids
      }
      connection.send(JSON.stringify(message))
      pushToLog('info', 'Request subscribing to aktoerId ' + aktoerId + ' and avdodfnr ' + avdodfnr)
    }
  }

  const pushToLog = (level, message) => {
    const now = new Date()
    const line = now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + ': ' + message
    if (!IS_TEST) {
      if (level === 'error') {
        console.error(line)
      } else {
        console.log(line)
      }
    }
    setLog(log => [...log, (<span key={line} className={classNames('log', level)}>{line}</span>)].slice(-100))
  }

  const getAnchor = () => {
    switch (status) {
      case CONNECTED:
        return <Icons kind='checkCircle' />
      case NOTCONNECTED:
      case ERROR:
        return <Icons kind='removeCircle' />
      case CONNECTING:
      case RECEIVING:
        return <Icons kind='connecting' />
      default:
        return null
    }
  }

  return (
    <div className='a-buc-websocket' title={'websocket: ' + status}>
      <HjelpetekstAuto anchor={getAnchor}>
        {log}
      </HjelpetekstAuto>
    </div>
  )
}

BucWebSocket.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  avdodfnr: PT.string
}

export default BucWebSocket
