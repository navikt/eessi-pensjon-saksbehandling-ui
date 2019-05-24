import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

import { ToggleGruppe } from '../components/ui/Nav'
import VarslerPanel from '../applications/PInfo/VarslerPanel'
import VarslerTable from '../applications/PInfo/VarslerTable'

const VarslerWidget = (props) => {
  const [ mounted, setMounted ] = useState(false)
  const [ tab, setTab ] = useState('invite')
  const { t, onResize } = props

  useEffect(() => {
    if (!mounted) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return <div className='c-ui-d-VarslerWidget p-3'>
    <div className='mt-2 mb-2'>
      <ToggleGruppe
        defaultToggles={[
          { children: t('ui:invite'), pressed: true, onClick: () => { setTab('invite') } },
          { children: t('ui:list'), onClick: () => { setTab('list') } }
        ]}
      />
    </div>
    {tab === 'invite' ? <VarslerPanel {...props} /> : <VarslerTable {...props} />}
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={onResize} />
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

VarslerWidget.propTypes = {
  onResize: PT.func.isRequired,
  t: PT.func.isRequired
}

export default VarslerWidget
