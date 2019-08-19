import React, { useState, useEffect } from 'react'
import {connectToWebSocket} from '../utils/websocket'
import { connect } from '../store'

const logData = (e) => console.log(e.data)

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    avdodfnr: state.app.params.avdodfnr
  }
}


const WebSocket = () => {
  const [connection, setConnection] = useState(null)
  const [ready, setReady] = useState(false)


  useEffect( () => {
      let websocketConnection = connectToWebSocket(()=>setReady(true), logData, logData, logData)
      setConnection(websocketConnection)
    }, []
  )

  useEffect( () => {
    if(ready){
      let message = {subscriptions: [aktoerId, avdodfnr].filter(el=>el)}
      connection.send(JSON.stringify(message))
    }

  }, [ready, aktoerId, avdodfnr])

  return <div className='WebSocket'></div>

}

export default connect(mapStateToProps, ()=>{})(WebSocket)
