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
      <img alt='' className='monitor' src={MonitorPNG} />
      <img alt='' className='cup' src={CupPNG} />
      <img alt='' className='mouse' src={MousePNG} />
      <img alt='' className='map' src={MapPNG} />
    </div>
    <Undertittel>{t('buc:form-empty-startANewCase')}</Undertittel>
    <Flatknapp
      className='mt-4'
      id='TODELETE'
      onClick={getBucList}>{t('ui:start')}</Flatknapp>
  </div>
}

export default BUCEmpty
