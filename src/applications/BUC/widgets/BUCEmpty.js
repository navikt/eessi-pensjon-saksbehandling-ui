import React, { useState } from 'react'
import PT from 'prop-types'

import * as MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import * as CupPNG from 'resources/images/artwork/kop.png'
import * as MousePNG from 'resources/images/artwork/NAVmusematte.png'
import * as MapPNG from 'resources/images/artwork/saksstatus.png'

import { Undertittel, Flatknapp, Normaltekst, Hovedknapp, Input } from 'components/ui/Nav'

import './BUCEmpty.css'

const BUCEmpty = (props) => {
  const { getBucs, t, bucs, gettingBUCs, aktoerId, actions } = props
  const [ _aktoerId, setAktoerId ] = useState(aktoerId)
  const [validation, setValidation] = useState(undefined)

  const onAktoerIdChange = (e) => {
    setValidation(undefined)
    setAktoerId(e.target.value.trim())
  }

  const onSubmitAktoerId = (e) => {
    if (!_aktoerId || !_aktoerId.match(/^\d+$/)) {
      setValidation(t('buc:validation-noAktoerId'))
    } else {
      actions.setStatusParam('aktoerId', _aktoerId)
    }
  }

  return <div className='a-buc-bucempty'>
    <div className='a-buc-bucempty__artwork'>
      <img alt='' className='monitor' src={MonitorPNG} />
      <img alt='' className='cup' src={CupPNG} />
      <img alt='' className='mouse' src={MousePNG} />
      <img alt='' className='map' src={MapPNG} />
    </div>
    <Undertittel>{t('buc:form-empty-startANewCase')}</Undertittel>
    {!aktoerId ? <div className='a-buc-bucempty__aktoerid-div'>
      <Input
        className='a-buc-bucempty__aktoerid-input'
        id='a-buc-bucempty__aktoerid-input-id'
        label={t('ui:aktoerId')}
        value={_aktoerId || ''}
        bredde='fullbredde'
        onChange={onAktoerIdChange}
        feil={validation ? { feilmelding: validation } : null} />
      <Hovedknapp
        id='a-buc-bucempty__aktoerid-button-id'
        className='a-buc-bucempty__aktoerid-button'
        onClick={onSubmitAktoerId}>
        {t('ui:next')}
      </Hovedknapp>
      </div>
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
  actions: PT.object.isRequired,
  getBucs: PT.func.isRequired,
  gettingBUCs: PT.bool.isRequired,
  bucs: PT.array
}

export default BUCEmpty
