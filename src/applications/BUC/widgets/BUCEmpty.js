import React, { useState } from 'react'
import PT from 'prop-types'

import { Flatknapp, Hovedknapp, Input, Lenke, Normaltekst, ToggleKnapp, Undertittel } from 'components/ui/Nav'

import * as MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import * as CupPNG from 'resources/images/artwork/kop.png'
import * as MousePNG from 'resources/images/artwork/NAVmusematte.png'
import * as MapPNG from 'resources/images/artwork/saksstatus.png'

import './BUCEmpty.css'

const BUCEmpty = (props) => {
  const { actions, aktoerId, bucs, getBucs, gettingBUCs, onBUCNew, sakId, t } = props
  const [ _sakId, setSakId ] = useState(sakId)
  const [ _aktoerId, setAktoerId ] = useState(aktoerId)
  const [ validation, setValidation ] = useState(undefined)

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

  const onSakIdChange = (e) => {
    setValidation(undefined)
    setSakId(e.target.value.trim())
  }

  const onSubmitSakId = (e) => {
    if (!_sakId || !_sakId.match(/^\d+$/)) {
      setValidation(t('buc:validation-noSakId'))
    } else {
      actions.setStatusParam('sakId', _sakId)
    }
  }

  return <div className='a-buc-bucempty'>
    <div className='a-buc-bucempty__artwork'>
      <img alt='' className='monitor' src={MonitorPNG} />
      <img alt='' className='cup' src={CupPNG} />
      <img alt='' className='mouse' src={MousePNG} />
      <img alt='' className='map' src={MapPNG} />
    </div>
    <Undertittel className='mb-3'>
      <Lenke href='#' onClick={onBUCNew}>
        {t('buc:form-empty-startANewCase')}
      </Lenke>
    </Undertittel>
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
        className='a-buc-bucempty__aktoerid-button ml-3'
        onClick={onSubmitAktoerId}>
        {t('ui:add')}
      </Hovedknapp>
    </div> : null}
    {!sakId ? <div className='a-buc-bucempty__sakid-div'>
      <Input
        className='a-buc-bucempty__sakid-input'
        id='a-buc-bucempty__sakid-input-id'
        label={t('ui:caseId')}
        value={_sakId || ''}
        bredde='fullbredde'
        onChange={onSakIdChange}
        feil={validation ? { feilmelding: validation } : null} />
      <Hovedknapp
        id='a-buc-bucempty__sakid-button-id'
        className='a-buc-bucempty__sakid-button ml-3'
        onClick={onSubmitSakId}>
        {t('ui:add')}
      </Hovedknapp>
    </div> : null}
  </div>
}

BUCEmpty.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  bucs: PT.array,
  getBucs: PT.func.isRequired,
  gettingBUCs: PT.bool.isRequired,
  onBUCNew: PT.func.isRequired,
  sakId: PT.string,
  t: PT.func.isRequired
}

export default BUCEmpty
