import React from 'react'

import * as MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import * as CupPNG from 'resources/images/artwork/kop.png'
import * as MousePNG from 'resources/images/artwork/NAVmusematte.png'
import * as MapPNG from 'resources/images/artwork/saksstatus.png'
import { Undertittel, Flatknapp } from 'components/ui/Nav'

import './BUCEmpty.css'

const BUCEmpty = (props) => {
  const { getBucList, t } = props

  return <div className='a-buc-bucempty'>
    <div className='a-buc-bucempty-artwork'>
      <img className='monitor' src={MonitorPNG} />
      <img className='cup' src={CupPNG} />
      <img className='mouse' src={MousePNG} />
      <img className='map' src={MapPNG} />
    </div>
    <Undertittel>{t('buc:form-empty-startANewCase')}</Undertittel>
    <Flatknapp id='TODELETE'
      onClick={getBucList}>{t('ui:start')}</Flatknapp>
  </div>
}

export default BUCEmpty
