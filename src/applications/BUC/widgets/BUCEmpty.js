import React, { useState } from 'react'
import PT from 'prop-types'

import * as MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import * as CupPNG from 'resources/images/artwork/kop.png'
import * as MousePNG from 'resources/images/artwork/NAVmusematte.png'
import * as MapPNG from 'resources/images/artwork/saksstatus.png'
import JoarkBrowser from 'components/ui/JoarkBrowser/JoarkBrowser'

import { Undertittel, Flatknapp, Normaltekst, Hovedknapp, Input, ToggleKnapp } from 'components/ui/Nav'

import './BUCEmpty.css'

const BUCEmpty = (props) => {
  const { getBucs, t, bucs, gettingBUCs, aktoerId, sakId, actions } = props
  const [ _sakId, setSakId ] = useState(sakId)
  const [ _aktoerId, setAktoerId ] = useState(aktoerId)
  const [validation, setValidation] = useState(undefined)
  const [ seeJoark, setSeeJoark ] = useState(false)

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
    <Undertittel className='mb-3'>{t('buc:form-empty-startANewCase')}</Undertittel>
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
    {aktoerId && sakId && bucs !== undefined ? <div className='mt-4'>
      <Normaltekst>{t('buc:form-noBUCsFound')}</Normaltekst>
    </div>: null}
    <div className='m-4'>
      <ToggleKnapp pressed={seeJoark} onClick={() => setSeeJoark(!seeJoark)}>{t('joark')}</ToggleKnapp>
      {seeJoark ? <JoarkBrowser files={[]} onFilesChange={() => {}} /> : null}
    </div>
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
