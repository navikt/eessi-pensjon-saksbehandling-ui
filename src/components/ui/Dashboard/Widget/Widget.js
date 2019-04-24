import React from 'react'

import EkspandertBartWidget from './Catalog/EkspandertBartWidget'
import PanelWidget from './Catalog/PanelWidget'
import SmileyWidget from './Catalog/SmileyWidget'
import CatWidget from './Catalog/CatWidget'
import NoteWidget from './Catalog/NoteWidget'
import DocumentStatusWidget from './Catalog/DocumentStatusWidget'
import LinksWidget from './Catalog/LinksWidget'
import PersonWidget from './Catalog/PersonWidget'
import SedListWidget from './Catalog/SedListWidget'

const Widget = (props) => {
  switch (props.widget.type) {
    case 'ekspandertbart':
      return <EkspandertBartWidget {...props} />
    case 'panel':
      return <PanelWidget {...props} />
    case 'smiley':
      return <SmileyWidget {...props} />
    case 'cat':
      return <CatWidget {...props} />
    case 'note':
      return <NoteWidget {...props} />
    case 'documentstatus':
      return <DocumentStatusWidget {...props} />
    case 'links':
      return <LinksWidget {...props} />
    case 'person':
      return <PersonWidget {...props} />
    case 'sedlist':
      return <SedListWidget {...props} />
    default:
      return <div>{props.t('ui:dashboard-noWidgetForType', { type: props.widget.type })}</div>
  }
}

export default Widget
