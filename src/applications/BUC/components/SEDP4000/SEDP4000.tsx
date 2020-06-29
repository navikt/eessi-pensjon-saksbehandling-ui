import { getP4000, listP4000, saveP4000asSaksbehandler, setP4000Info } from 'actions/buc'
import Period from 'applications/BUC/components/SEDP4000/Period/Period'
import classNames from 'classnames'
import * as storage from 'constants/storage'
import { P4000Info, Period as IPeriod, PeriodErrors } from 'declarations/period.d'
import { AllowedLocaleString } from 'declarations/types'
import { AllowedLocaleStringPropType } from 'declarations/types.pt'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import P4000Payload from './P4000Payload'
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi'
import { Hovedknapp } from 'nav-frontend-knapper'
import Alertstripe from 'nav-frontend-alertstriper'
import Spinner from 'nav-frontend-spinner'

export interface SEDP4000Props {
  aktoerId: string;
  locale: AllowedLocaleString;
  setShowButtons: (b: boolean) => void;
  showButtons: boolean;
}

export interface SEDP4000Selector {
  loadingP4000list: boolean;
  loadingP4000info: boolean;
  p4000info?: P4000Info | undefined;
  p4000list?: Array<string> | undefined;
}

const mapState = (state: State): SEDP4000Selector => ({
  loadingP4000list: state.loading.loadingP4000list,
  loadingP4000info: state.loading.loadingP4000info,
  p4000list: state.buc.p4000list,
  p4000info: state.buc.p4000info
})

export const SEDP4000: React.FC<SEDP4000Props> = ({
  aktoerId, locale, setShowButtons, showButtons
}: SEDP4000Props): JSX.Element => {
  const [period, setPeriod] = useState<IPeriod>({} as IPeriod)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [localErrors, setLocalErrors] = useState<PeriodErrors>({})
  const [p4000file, setP4000file] = useState<string | undefined | null>(undefined)
  const [role, setRole] = useState<string | undefined>(undefined)
  const mode: string = period.id ? 'edit' : 'new'
  const { t } = useTranslation()
  const { loadingP4000list, loadingP4000info, p4000list, p4000info }: SEDP4000Selector = useSelector<State, SEDP4000Selector>(mapState)
  const dispatch = useDispatch()

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
    const newLocalErrors = _.cloneDeep(localErrors)
    newLocalErrors[key] = error
    setLocalErrors(newLocalErrors)
  }

  const setPeriods = (periods: Array<IPeriod>): void => {
    dispatch(setP4000Info({
      ...p4000info,
      stayAbroad: periods
    } as P4000Info))
  }

  const handleContinueButton = (): void => {
    dispatch(saveP4000asSaksbehandler(aktoerId, p4000file!))
    setIsReady(true)
  }

  const handleGetP4000infoButton = (): void => {
    dispatch(getP4000(p4000file!))
  }

  const handleListP4000userButton = (): void => {
    setRole('user')
    setP4000file(aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFO)
    dispatch(listP4000(aktoerId))
  }

  const handleListP4000saksbehandlerButton = (): void => {
    setRole('saksbehandler')
    setP4000file(aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFOSB)
    dispatch(listP4000(aktoerId))
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
        {loadingP4000list || loadingP4000info ? <Spinner className='ml-3 mr-3' type='M' /> : null}
        {loadingP4000list ? <span className='pl-2'>{t('buc:loading-p4000list')}</span> : null}
        {loadingP4000info ? <span className='pl-2'>{t('buc:loading-p4000info')}</span> : null}
        {!loadingP4000info && p4000list !== undefined && p4000info === undefined
          ? (noP4000Info() ? (
            <span>
              <Normaltekst>{t('buc:p4000-label-p4000' + role + 'FileNotFound')}</Normaltekst>
              <Hovedknapp
                id='a-buc-c-sedp4000__continue-button-id'
                className='a-buc-c-sedp4000__continue-button mt-3'
                onClick={handleContinueButton}
              >
                {t('ui:continue')}
              </Hovedknapp>
            </span>
          ) : (
            <span>
              <Normaltekst>{t('buc:p4000-label-p4000' + role + 'FileFound')}</Normaltekst>
              <Hovedknapp
                id='a-buc-c-sedp4000__getP4000info-button-id'
                className='a-buc-c-sedp4000__getP4000info-button mt-3'
                onClick={handleGetP4000infoButton}
              >
                {t('ui:getInfo')}
              </Hovedknapp>
            </span>)
          ) : null}
        {!loadingP4000list && p4000list === undefined ? (
          <div className='d-flex flex-column'>
            <div>
              <Normaltekst>{t('buc:p4000-help-listP4000user')}</Normaltekst>
              <Hovedknapp
                id='a-buc-c-sedp4000__listP4000user-button-id'
                className='a-buc-c-sedp4000__listP4000user-button mt-3'
                onClick={handleListP4000userButton}
              >
                {t('buc:p4000-button-listP4000user')}
              </Hovedknapp>
            </div>
            <div className='mt-3'>
              <Normaltekst>{t('buc:p4000-help-listP4000saksbehandler')}</Normaltekst>
              <Hovedknapp
                id='a-buc-c-sedp4000__listP4000saksbehandler-button-id'
                className='a-buc-c-sedp4000__listP4000saksbehandler-button mt-3'
                onClick={handleListP4000saksbehandlerButton}
              >
                {t('buc:p4000-button-listP4000saksbehandler')}
              </Hovedknapp>
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
          <Undertittel className='mb-3'>{t('buc:p4000-app-title')}</Undertittel>
          <Undertekst className='mb-2'>{t('buc:p4000-app-description')}</Undertekst>
          <Undertekst className='mb-3'>{t('buc:p4000-app-help')}</Undertekst>
        </>
      ) : null}
      {_errorMessage ? (
        <Alertstripe className='a-buc-c-sedp4000d__alert mt-4 mb-4' type='advarsel'>
          {t(_errorMessage)}
        </Alertstripe>
      ) : null}
      {p4000info && !_.isEmpty(p4000info.stayAbroad) && mode === 'new' ? (
        <>
          <Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-previousPeriods')}</Undertittel>
          {p4000info ? p4000info.stayAbroad.sort((a: IPeriod, b: IPeriod) => {
            return P4000Payload.pinfoDateToDate(a.startDate)!.getDate() - P4000Payload.pinfoDateToDate(b.startDate)!.getDate()
          }).map((period, index) => {
            return (
              <Period
                locale={locale}
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
        <Alertstripe className='a-buc-c-sedp4000d__alert mt-4 mb-4' type='advarsel'>
          {t(_errorMessage)}
        </Alertstripe>
      ) : null}
    </div>
  )
}

SEDP4000.propTypes = {
  aktoerId: PT.string.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  setShowButtons: PT.func.isRequired,
  showButtons: PT.bool.isRequired
}

export default SEDP4000
