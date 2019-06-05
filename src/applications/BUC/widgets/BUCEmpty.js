import React from 'react'
import PT from 'prop-types'

import * as MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import * as CupPNG from 'resources/images/artwork/kop.png'
import * as MousePNG from 'resources/images/artwork/NAVmusematte.png'
import * as MapPNG from 'resources/images/artwork/saksstatus.png'

import { Undertittel, Flatknapp, Normaltekst } from 'components/ui/Nav'

import './BUCEmpty.css'

const BUCEmpty = (props) => {
  const { getBucs, t, bucs, gettingBUCs, aktoerId } = props

  return <div className='a-buc-bucempty'>
    <div className='a-buc-bucempty-artwork'>
      <img alt='' className='monitor' src={MonitorPNG} />
      <img alt='' className='cup' src={CupPNG} />
      <img alt='' className='mouse' src={MousePNG} />
      <img alt='' className='map' src={MapPNG} />
    </div>
    <Undertittel>{t('buc:form-empty-startANewCase')}</Undertittel>
    {!aktoerId ? <Normaltekst>{t('buc:form-missingAktoerId')}</Normaltekst>
      : bucs === undefined ? <Flatknapp
        className='mt-4'
        id='TODELETE'
        disabled={gettingBUCs}
        spinner={gettingBUCs}
        onClick={getBucs}>{gettingBUCs ? t('buc:loading-bucs') : t('ui:start')}</Flatknapp>
        : <div className='mt-4'>
          <Normaltekst>{t('buc:form-noBUCsFound')}</Normaltekst>
        </div>
    }
  </div>
}

BUCEmpty.propTypes = {
  t: PT.func.isRequired,
  aktoerId: PT.string,
  getBucs: PT.func.isRequired,
  gettingBUCs: PT.bool.isRequired,
  bucs: PT.array
}

export default BUCEmpty
