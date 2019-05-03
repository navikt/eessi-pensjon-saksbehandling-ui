import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'

import { ToggleGruppe } from '../components/ui/Nav'
import VarslerPanel from '../applications/PInfoSaksbehandler/VarslerPanel'
import VarslerTable from '../applications/PInfoSaksbehandler/VarslerTable'

const VarslerWidget = (props) => {

 const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState('invite')

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  return <div className='c-ui-d-VarslerWidget p-3'>
    <h4>{props.widget.title}</h4>
    <div>
      <ToggleGruppe
        defaultToggles={[
          { children: props.t('ui:invite'), pressed: true, onClick: () => {setTab('invite')} },
          { children: props.t('ui:list'), onClick: () => {setTab('list')} }
        ]}
      />
      {tab === 'invite' ? <VarslerPanel {...props}/> : <VarslerTable {...props}/>}
    </div>
    <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={props.onResize} />
  </div>
}

VarslerWidget.properties = {
  type: 'varsler',
  title: 'Varsler widget',
  description: 'Widget for notifications',
  layout: {
    lg: { minW: 2, maxW: 12, defaultW: 3, minH: 3, defaultH: 3, maxH: 999 },
    md: { minW: 1, maxW: 3, defaultW: 1, minH: 3, defaultH: 3, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 3, defaultH: 3, maxH: 999 }
  },
  options: {
    backgroundColor: 'white'
  }
}

export default VarslerWidget
