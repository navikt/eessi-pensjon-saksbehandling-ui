import Period from 'applications/BUC/components/SEDP4000/Period/Period'
import { P4000Info, Period as IPeriod, PeriodErrors } from 'declarations/period.d'
import classNames from 'classnames'
import * as storage from 'constants/storage'
import { P4000InfoPropType } from 'declarations/period.pt'
import { ActionCreatorsPropType, AllowedLocaleStringPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { ActionCreators, State } from 'eessi-pensjon-ui/dist/declarations/types.d'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'store'
import { AllowedLocaleString, T } from 'declarations/types'
import P4000Payload from './P4000Payload'

export interface SEDP4000Props {
  actions: ActionCreators;
  aktoerId: string;
  loadingP4000info: boolean;
  loadingP4000list: boolean;
  locale: AllowedLocaleString;
  p4000info?: P4000Info | undefined;
  p4000list: Array<string> | null | undefined;
  setShowButtons: (b: boolean) => void;
  showButtons: boolean;
  t: T
}

export const mapStateToProps: Function = /* istanbul ignore next */ (state: State): State => ({
  aktoerId: state.app.params.aktoerId,
  p4000: state.buc.p4000,
  locale: state.ui.locale,
  loadingP4000list: state.loading.loadingP4000list,
  loadingP4000info: state.loading.loadingP4000info,
  p4000list: state.buc.p4000list,
  p4000info: state.buc.p4000info
})

export const SEDP4000: React.FC<SEDP4000Props> = ({
  actions, aktoerId, loadingP4000info, loadingP4000list,
  locale, p4000info, p4000list, setShowButtons, showButtons, t
}: SEDP4000Props): JSX.Element => {
  const [period, setPeriod] = useState<IPeriod>({} as IPeriod)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [localErrors, setLocalErrors] = useState<PeriodErrors>({})
  const [p4000file, setP4000file] = useState<string | undefined | null>(undefined)
  const [role, setRole] = useState<string | undefined>(undefined)
  const mode: string = period.id ? 'edit' : 'new'

  // check aktoerId
  useEffect(() => {
    if (!aktoerId) {
      setIsReady(true)
    }
  }, [aktoerId])

  // mark component as ready if p4000 info file is ready
  useEffect(() => {
    if (!isReady && p4000info !== undefined) {
      setIsReady(true)
    }
  }, [isReady, p4000info])

  useEffect(() => {
    // we are editing a period or adding a new period => hide main buttons
    if ((period.type || period.id) && showButtons) {
      setShowButtons(false)
    }
    // we are NOT editing a period or adding a new period => show main buttons
    if (!period.type && !period.id && !showButtons) {
      setShowButtons(true)
    }
  }, [mode, setShowButtons, showButtons, period])

  const setLocalError = (key: string, error: string | undefined): void => {
    setLocalErrors({
      ...localErrors,
      [key]: error
    })
  }

  const setPeriods = (periods: Array<IPeriod>): void => {
    actions.setP4000Info({
      ...p4000info,
      stayAbroad: periods
    })
  }

  const handleContinueButton: Function = (): void => {
    actions.saveP4000asSaksbehandler(aktoerId, p4000file)
    setIsReady(true)
  }

  const handleGetP4000infoButton: Function = (): void => {
    actions.getP4000(p4000file)
  }

  const handleListP4000userButton: Function = (): void => {
    setRole('user')
    setP4000file(aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFO)
    actions.listP4000(aktoerId)
  }

  const handleListP4000saksbehandlerButton = (): void => {
    setRole('saksbehandler')
    setP4000file(aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFOSB)
    actions.listP4000(aktoerId)
  }

  const noP4000Info = (): boolean => {
    return !!(p4000list === null || (_.isArray(p4000list) && p4000file && p4000list.indexOf(p4000file) < 0))
  }

  if (!aktoerId) {
    return <div>{t('buc:validation-noAktoerId')}</div>
  }

  const errorMessage = () => {
    for (var key in localErrors) {
      if (localErrors[key]) {
        return localErrors[key]
      }
    }
    return undefined
  }

  const _errorMessage = errorMessage()

  if (!isReady) {
    return (
      <div className='a-buc-c-sedp4000__notReady col-md-8 d-flex mt-5 mb-5 align-items-center justify-content-center'>
        {loadingP4000list || loadingP4000info ? <Ui.Nav.Spinner className='ml-3 mr-3' type='M' /> : null}
        {loadingP4000list ? <span className='pl-2'>{t('buc:loading-p4000list')}</span> : null}
        {loadingP4000info ? <span className='pl-2'>{t('buc:loading-p4000info')}</span> : null}
        {!loadingP4000info && p4000list !== undefined && p4000info === undefined
          ? (noP4000Info() ? (
            <span>
              <Ui.Nav.Normaltekst>{t('buc:p4000-label-p4000' + role + 'FileNotFound')}</Ui.Nav.Normaltekst>
              <Ui.Nav.Hovedknapp
                id='a-buc-c-sedp4000__continue-button-id'
                className='a-buc-c-sedp4000__continue-button mt-3'
                onClick={handleContinueButton}
              >
                {t('ui:continue')}
              </Ui.Nav.Hovedknapp>
            </span>
          ) : (
            <span>
              <Ui.Nav.Normaltekst>{t('buc:p4000-label-p4000' + role + 'FileFound')}</Ui.Nav.Normaltekst>
              <Ui.Nav.Hovedknapp
                id='a-buc-c-sedp4000__getP4000info-button-id'
                className='a-buc-c-sedp4000__getP4000info-button mt-3'
                onClick={handleGetP4000infoButton}
              >
                {t('ui:getInfo')}
              </Ui.Nav.Hovedknapp>
            </span>)
          ) : null}
        {!loadingP4000list && p4000list === undefined ? (
          <div className='d-flex flex-column'>
            <div>
              <Ui.Nav.Normaltekst>{t('buc:p4000-help-listP4000user')}</Ui.Nav.Normaltekst>
              <Ui.Nav.Hovedknapp
                id='a-buc-c-sedp4000__listP4000user-button-id'
                className='a-buc-c-sedp4000__listP4000user-button mt-3'
                onClick={handleListP4000userButton}
              >
                {t('buc:p4000-button-listP4000user')}
              </Ui.Nav.Hovedknapp>
            </div>
            <div className='mt-3'>
              <Ui.Nav.Normaltekst>{t('buc:p4000-help-listP4000saksbehandler')}</Ui.Nav.Normaltekst>
              <Ui.Nav.Hovedknapp
                id='a-buc-c-sedp4000__listP4000saksbehandler-button-id'
                className='a-buc-c-sedp4000__listP4000saksbehandler-button mt-3'
                onClick={handleListP4000saksbehandlerButton}
              >
                {t('buc:p4000-button-listP4000saksbehandler')}
              </Ui.Nav.Hovedknapp>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className={classNames('a-buc-c-sedp4000', mode)}>
      {mode === 'new' ? (
        <>
          <Ui.Nav.Undertittel className='mb-3'>{t('buc:p4000-app-title')}</Ui.Nav.Undertittel>
          <Ui.Nav.Undertekst className='mb-2'>{t('buc:p4000-app-description')}</Ui.Nav.Undertekst>
          <Ui.Nav.Undertekst className='mb-3'>{t('buc:p4000-app-help')}</Ui.Nav.Undertekst>
        </>
      ) : null}
      {_errorMessage ? (
        <Ui.Nav.AlertStripe className='a-buc-c-sedp4000d__alert mt-4 mb-4' type='advarsel'>
          {t(_errorMessage)}
        </Ui.Nav.AlertStripe>
      ) : null}
      {p4000info && !_.isEmpty(p4000info.stayAbroad) && mode === 'new' ? (
        <>
          <Ui.Nav.Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-previousPeriods')}</Ui.Nav.Undertittel>
          {p4000info ? p4000info.stayAbroad.sort((a: IPeriod, b: IPeriod) => {
            return P4000Payload.pinfoDateToDate(a.startDate)!.getDate() - P4000Payload.pinfoDateToDate(b.startDate)!.getDate()
          }).map((period, index) => {
            return (
              <Period
                t={t}
                locale={locale}
                actions={actions}
                mode='view'
                first={index === 0}
                last={index === p4000info.stayAbroad.length - 1}
                period={period}
                periods={p4000info.stayAbroad}
                localErrors={localErrors}
                setLocalError={setLocalError}
                setLocalErrors={setLocalErrors}
                setPeriod={setPeriod}
                setPeriods={setPeriods}
                key={index}
              />
            )
          }) : null}
        </>
      )
        : null}
      <Period
        t={t}
        actions={actions}
        mode={mode}
        period={period}
        periods={p4000info ? p4000info.stayAbroad : []}
        locale={locale}
        localErrors={localErrors}
        setLocalError={setLocalError}
        setLocalErrors={setLocalErrors}
        setPeriod={setPeriod}
        setPeriods={setPeriods}
      />
      {_errorMessage ? (
        <Ui.Nav.AlertStripe className='a-buc-c-sedp4000d__alert mt-4 mb-4' type='advarsel'>
          {t(_errorMessage)}
        </Ui.Nav.AlertStripe>
      ) : null}
    </div>
  )
}

SEDP4000.propTypes = {
  actions: ActionCreatorsPropType.isRequired,
  aktoerId: PT.string.isRequired,
  loadingP4000info: PT.bool.isRequired,
  loadingP4000list: PT.bool.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  p4000info: P4000InfoPropType,
  p4000list: PT.arrayOf(PT.string.isRequired),
  setShowButtons: PT.func.isRequired,
  showButtons: PT.bool.isRequired,
  t: TPropType.isRequired
}

export default connect(mapStateToProps, () => {})(SEDP4000)
