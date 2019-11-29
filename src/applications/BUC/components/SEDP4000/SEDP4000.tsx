import Period from 'applications/BUC/components/SEDP4000/Period/Period'
import { P4000Info, Period as PeriodD, PeriodErrors } from 'applications/BUC/declarations/period'
import classNames from 'classnames'
import * as storage from 'constants/storage'
import { Nav } from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'store'
import { ActionCreators, AllowedLocaleString, State, T } from 'types'
import P4000Payload from './P4000Payload'

export interface SEDP4000Props {
  actions: ActionCreators;
  aktoerId: string;
  loadingP4000info: boolean;
  loadingP4000list: boolean;
  locale: AllowedLocaleString;
  p4000info: P4000Info | undefined;
  p4000list: Array<string> | null | undefined;
  setShowButtons: Function;
  showButtons: boolean;
  t: T
}

export const mapStateToProps: Function = /* istanbul ignore next */ (state: State): any => {
  return {
    aktoerId: state.app.params.aktoerId,
    p4000: state.buc.p4000,
    locale: state.ui.locale,
    loadingP4000list: state.loading.loadingP4000list,
    loadingP4000info: state.loading.loadingP4000info,
    p4000list: state.buc.p4000list,
    p4000info: state.buc.p4000info
  }
}

export const SEDP4000 = ({
  actions, aktoerId, loadingP4000info, loadingP4000list,
  locale, p4000info, p4000list, setShowButtons, showButtons, t
}: SEDP4000Props) => {
  const [period, setPeriod] = useState<PeriodD>({} as PeriodD)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [localErrors, setLocalErrors] = useState<PeriodErrors>({})
  const [p4000file, setP4000file] = useState<string | undefined | null>(undefined)
  const [role, setRole] = useState<string | undefined>(undefined)
  const mode = period.id ? 'edit' : 'new'

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

  const setPeriods = (periods: Array<PeriodD>): void => {
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

  const handleListP4000saksbehandlerButton = () => {
    setRole('saksbehandler')
    setP4000file(aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFOSB)
    actions.listP4000(aktoerId)
  }

  const noP4000Info = () => {
    return p4000list === null || (_.isArray(p4000list) && p4000file && p4000list.indexOf(p4000file) < 0)
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
        {loadingP4000list || loadingP4000info ? <Nav.Spinner className='ml-3 mr-3' type='M' /> : null}
        {loadingP4000list ? <span className='pl-2'>{t('buc:loading-p4000list')}</span> : null}
        {loadingP4000info ? <span className='pl-2'>{t('buc:loading-p4000info')}</span> : null}
        {!loadingP4000info && p4000list !== undefined && p4000info === undefined
          ? (noP4000Info() ? (
            <span>
              <Nav.Normaltekst>{t('buc:p4000-label-p4000' + role + 'FileNotFound')}</Nav.Normaltekst>
              <Nav.Hovedknapp
                id='a-buc-c-sedp4000__continue-button-id'
                className='a-buc-c-sedp4000__continue-button mt-3'
                onClick={handleContinueButton}
              >
                {t('ui:continue')}
              </Nav.Hovedknapp>
            </span>
          ) : (
            <span>
              <Nav.Normaltekst>{t('buc:p4000-label-p4000' + role + 'FileFound')}</Nav.Normaltekst>
              <Nav.Hovedknapp
                id='a-buc-c-sedp4000__getP4000info-button-id'
                className='a-buc-c-sedp4000__getP4000info-button mt-3'
                onClick={handleGetP4000infoButton}
              >
                {t('ui:getInfo')}
              </Nav.Hovedknapp>
            </span>)
          ) : null}
        {!loadingP4000list && p4000list === undefined ? (
          <div className='d-flex flex-column'>
            <div>
              <Nav.Normaltekst>{t('buc:p4000-help-listP4000user')}</Nav.Normaltekst>
              <Nav.Hovedknapp
                id='a-buc-c-sedp4000__listP4000user-button-id'
                className='a-buc-c-sedp4000__listP4000user-button mt-3'
                onClick={handleListP4000userButton}
              >
                {t('buc:p4000-button-listP4000user')}
              </Nav.Hovedknapp>
            </div>
            <div className='mt-3'>
              <Nav.Normaltekst>{t('buc:p4000-help-listP4000saksbehandler')}</Nav.Normaltekst>
              <Nav.Hovedknapp
                id='a-buc-c-sedp4000__listP4000saksbehandler-button-id'
                className='a-buc-c-sedp4000__listP4000saksbehandler-button mt-3'
                onClick={handleListP4000saksbehandlerButton}
              >
                {t('buc:p4000-button-listP4000saksbehandler')}
              </Nav.Hovedknapp>
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
          <Nav.Undertittel className='mb-3'>{t('buc:p4000-app-title')}</Nav.Undertittel>
          <Nav.Undertekst className='mb-2'>{t('buc:p4000-app-description')}</Nav.Undertekst>
          <Nav.Undertekst className='mb-3'>{t('buc:p4000-app-help')}</Nav.Undertekst>
        </>
      ) : null}
      {_errorMessage ? (
        <Nav.AlertStripe className='a-buc-c-sedp4000d__alert mt-4 mb-4' type='advarsel'>
          {t(_errorMessage)}
        </Nav.AlertStripe>
      ) : null}
      {p4000info && !_.isEmpty(p4000info.stayAbroad) && mode === 'new' ? (
        <>
          <Nav.Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-previousPeriods')}</Nav.Undertittel>
          {p4000info ? p4000info.stayAbroad.sort((a: PeriodD, b: PeriodD) => {
            return P4000Payload.pinfoDateToDate(a.startDate)!.getDate()  - P4000Payload.pinfoDateToDate(b.startDate)!.getDate()
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
        <Nav.AlertStripe className='a-buc-c-sedp4000d__alert mt-4 mb-4' type='advarsel'>
          {t(_errorMessage)}
        </Nav.AlertStripe>
      ) : null}
    </div>
  )
}

SEDP4000.propTypes = {
  actions: PT.object,
  aktoerId: PT.string.isRequired,
  loadingP4000info: PT.bool,
  loadingP4000list: PT.bool,
  locale: PT.string.isRequired,
  p4000info: PT.object,
  p4000list: PT.array,
  setShowButtons: PT.func.isRequired,
  showButtons: PT.bool.isRequired,
  t: PT.func
}

export default connect(mapStateToProps, () => {})(SEDP4000)
