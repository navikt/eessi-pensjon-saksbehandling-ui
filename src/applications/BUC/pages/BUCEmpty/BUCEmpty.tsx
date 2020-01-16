import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import { ActionCreatorsPropType, RinaUrlPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { ActionCreators } from 'eessi-pensjon-ui/dist/declarations/types'
import PT from 'prop-types'
import React, { useState } from 'react'
import MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import CupPNG from 'resources/images/artwork/kop.png'
import MousePNG from 'resources/images/artwork/NAVmusematte.png'
import MapPNG from 'resources/images/artwork/saksstatus.png'
import { RinaUrl, T } from 'declarations/types'
import './BUCEmpty.css'

export interface BUCEmptyProps {
  actions: ActionCreators;
  aktoerId?: string;
  onBUCNew: Function;
  rinaUrl?: RinaUrl;
  sakId?: string;
  t: T;
}

const BUCEmpty: React.FC<BUCEmptyProps> = ({
  actions, aktoerId, onBUCNew, rinaUrl, sakId, t
}: BUCEmptyProps): JSX.Element => {
  const [_sakId, setSakId] = useState<string | undefined>(sakId)
  const [_aktoerId, setAktoerId] = useState<string | undefined>(aktoerId)
  const [validation, setValidation] = useState<string | undefined>(undefined)

  const onAktoerIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setAktoerId(e.target.value.trim())
  }

  const onSubmitAktoerId = (): void => {
    if (!_aktoerId || !_aktoerId.match(/^\d+$/)) {
      setValidation(t('buc:validation-noAktoerId'))
    } else {
      actions.setStatusParam('aktoerId', _aktoerId)
    }
  }

  const onSakIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setSakId(e.target.value.trim())
  }

  const onSubmitSakId = (): void => {
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
        <Ui.Nav.Undertittel className='a-buc-p-bucempty__title mb-3'>
          <Ui.Nav.Lenke
            id='a-buc-p-bucempty__newbuc-link-id'
            className='a-buc-p-bucempty__newbuc-link'
            href='#' onClick={onBUCNew}
          >
            {t('buc:form-empty-startANewCase')}
          </Ui.Nav.Lenke>
        </Ui.Nav.Undertittel>
        {!aktoerId ? (
          <div className='a-buc-p-bucempty__form'>
            <Ui.Nav.Input
              id='a-buc-p-bucempty__aktoerid-input-id'
              className='a-buc-p-bucempty__aktoerid-input'
              label={t('ui:aktoerId')}
              value={_aktoerId || ''}
              bredde='fullbredde'
              onChange={onAktoerIdChange}
              feil={validation ? validation : false}
            />
            <Ui.Nav.Hovedknapp
              id='a-buc-p-bucempty__aktoerid-button-id'
              className='a-buc-p-bucempty__aktoerid-button ml-3'
              onClick={onSubmitAktoerId}
            >
              {t('ui:add')}
            </Ui.Nav.Hovedknapp>
          </div>
        ) : null}
        {!sakId ? (
          <div className='a-buc-p-bucempty__form'>
            <Ui.Nav.Input
              id='a-buc-p-bucempty__sakid-input-id'
              className='a-buc-p-bucempty__sakid-input'
              label={t('buc:form-caseId')}
              value={_sakId || ''}
              bredde='fullbredde'
              onChange={onSakIdChange}
              feil={validation ? validation : false}
            />
            <Ui.Nav.Hovedknapp
              id='a-buc-p-bucempty__sakid-button-id'
              className='a-buc-p-bucempty__sakid-button ml-3'
              onClick={onSubmitSakId}
            >
              {t('ui:add')}
            </Ui.Nav.Hovedknapp>
          </div>
        ) : null}
      </div>
      {rinaUrl ? <BUCFooter className='w-100 mt-2 mb-2' rinaUrl={rinaUrl} t={t} /> : null}
    </>
  )
}

BUCEmpty.propTypes = {
  actions: ActionCreatorsPropType.isRequired,
  aktoerId: PT.string,
  onBUCNew: PT.func.isRequired,
  rinaUrl: RinaUrlPropType,
  sakId: PT.string,
  t: TPropType.isRequired
}

export default BUCEmpty
