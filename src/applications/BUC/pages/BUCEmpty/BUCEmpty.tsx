import { setStatusParam } from 'actions/app'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import { State } from 'declarations/reducers'
import { RinaUrl } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import MonitorPNG from 'resources/images/artwork/dataskjerm.png'
import CupPNG from 'resources/images/artwork/kop.png'
import MousePNG from 'resources/images/artwork/NAVmusematte.png'
import MapPNG from 'resources/images/artwork/saksstatus.png'
import './BUCEmpty.css'

export interface BUCEmptySelector {
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCEmptySelector => ({
  rinaUrl: state.buc.rinaUrl
})

export interface BUCEmptyProps {
  aktoerId?: string;
  onBUCNew: () => void;
  sakId?: string;
}

const BUCEmpty: React.FC<BUCEmptyProps> = ({
  aktoerId, onBUCNew, sakId
}: BUCEmptyProps): JSX.Element => {
  const [_sakId, setSakId] = useState<string | undefined>(sakId)
  const [_aktoerId, setAktoerId] = useState<string | undefined>(aktoerId)
  const [validation, setValidation] = useState<string | undefined>(undefined)
  const dispatch = useDispatch()
  const { rinaUrl }: BUCEmptySelector = useSelector<State, BUCEmptySelector>(mapState)
  const { t } = useTranslation()

  const onAktoerIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setAktoerId(e.target.value.trim())
  }

  const onSubmitAktoerId = (): void => {
    if (!_aktoerId || !_aktoerId.match(/^\d+$/)) {
      setValidation(t('buc:validation-noAktoerId'))
    } else {
      dispatch(setStatusParam('aktoerId', _aktoerId))
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
      dispatch(setStatusParam('sakId', _sakId))
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
              feil={validation || false}
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
              feil={validation || false}
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
      {rinaUrl ? <BUCFooter className='w-100 mt-2 mb-2' /> : null}
    </>
  )
}

BUCEmpty.propTypes = {
  aktoerId: PT.string,
  onBUCNew: PT.func.isRequired,
  sakId: PT.string
}

export default BUCEmpty
