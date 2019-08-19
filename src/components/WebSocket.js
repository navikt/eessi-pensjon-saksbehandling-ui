import React, { useState, useEffect } from 'react'
import {connect} from '../utils/websocket'

const logData = (e) => console.log(e.data)


const WebSocket = () => {
  const [connection, setConnection] = useState(null)
  const [ready, setReady] = useState(false)


  useEffect( () => {
      let websocketConnection = connect(()=>setReady(true), logData, logData, logData)
      setConnection(websocketConnection)
    }, []
  )

  useEffect( () => {
    if(ready){
      connection.send('{"subscriptions": ["foo"]}')
    }

  }, [ready])

  return <div className='WebSocket'></div>

}

export default WebSocket
