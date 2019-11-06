import React, { useState } from 'react'
import PT from 'prop-types'

import { Nav } from 'eessi-pensjon-ui'
import MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import CupPNG from 'resources/images/artwork/kop.png'
import MousePNG from 'resources/images/artwork/NAVmusematte.png'
import MapPNG from 'resources/images/artwork/saksstatus.png'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'

import './BUCEmpty.css'

const BUCEmpty = ({ actions, aktoerId, onBUCNew, rinaUrl, sakId, t }) => {
  const [_sakId, setSakId] = useState(sakId)
  const [_aktoerId, setAktoerId] = useState(aktoerId)
  const [validation, setValidation] = useState(undefined)

  const onAktoerIdChange = (e) => {
    setValidation(undefined)
    setAktoerId(e.target.value.trim())
  }

  const onSubmitAktoerId = () => {
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

  const onSubmitSakId = () => {
    if (!_sakId || !_sakId.match(/^\d+$/)) {
      setValidation(t('buc:validation-noSakId'))
    } else {
      actions.setStatusParam('sakId', _sakId)
    }
  }

  return (
    <>
      <div className='panel a-buc-p-bucempty s-border d-flex'>
        <div className='a-buc-p-bucempty__artwork'>
          <img alt='' className='monitor' src={MonitorPNG} />
          <img alt='' className='cup' src={CupPNG} />
          <img alt='' className='mouse' src={MousePNG} />
          <img alt='' className='map' src={MapPNG} />
        </div>
        <Nav.Undertittel className='a-buc-bucempty__title mb-3'>
          <Nav.Lenke
            id='a-buc-p-bucempty__newbuc-link-id'
            className='a-buc-p-bucempty__newbuc-link'
            href='#' onClick={onBUCNew}
          >
            {t('buc:form-empty-startANewCase')}
          </Nav.Lenke>
        </Nav.Undertittel>
        {!aktoerId ? (
          <div className='a-buc-p-bucempty__form'>
            <Nav.Input
              id='a-buc-p-bucempty__aktoerid-input-id'
              className='a-buc-p-bucempty__aktoerid-input'
              label={t('ui:aktoerId')}
              value={_aktoerId || ''}
              bredde='fullbredde'
              onChange={onAktoerIdChange}
              feil={validation ? { feilmelding: validation } : null}
            />
            <Nav.Hovedknapp
              id='a-buc-p-bucempty__aktoerid-button-id'
              className='a-buc-p-bucempty__aktoerid-button ml-3'
              onClick={onSubmitAktoerId}
            >
              {t('ui:add')}
            </Nav.Hovedknapp>
          </div>
        ) : null}
        {!sakId ? (
          <div className='a-buc-p-bucempty__form'>
            <Nav.Input
              id='a-buc-p-bucempty__sakid-input-id'
              className='a-buc-p-bucempty__sakid-input'
              label={t('buc:form-caseId')}
              value={_sakId || ''}
              bredde='fullbredde'
              onChange={onSakIdChange}
              feil={validation ? { feilmelding: validation } : null}
            />
            <Nav.Hovedknapp
              id='a-buc-p-bucempty__sakid-button-id'
              className='a-buc-p-bucempty__sakid-button ml-3'
              onClick={onSubmitSakId}
            >
              {t('ui:add')}
            </Nav.Hovedknapp>
          </div>
        ) : null}
      </div>
      <BUCFooter className='w-100 mt-2 mb-2' rinaUrl={rinaUrl} t={t} />
    </>
  )
}

BUCEmpty.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  onBUCNew: PT.func.isRequired,
  sakId: PT.string,
  t: PT.func.isRequired
}

export default BUCEmpty
