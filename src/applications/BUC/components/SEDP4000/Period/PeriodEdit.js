import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'

import DatePicker from 'components/DatePicker/DatePicker'
import FocusGroup from 'components/FocusGroup/FocusGroup'
import FileUpload from 'components/FileUpload/FileUpload'
import {
  AlertStripe,
  Checkbox,
  Flatknapp,
  HjelpetekstAuto,
  Hovedknapp,
  Knapp,
  Normaltekst,
  Row,
  Select,
  Textarea,
  Undertekst,
  UndertekstBold,
  Undertittel
} from 'components/Nav'

import 'applications/BUC/components/SEDP4000/Period/Period.css'
import { PeriodNotWork } from 'applications/BUC/components/SEDP4000/Period/PeriodNotWork'
import { PeriodWork } from 'applications/BUC/components/SEDP4000/Period/PeriodWork'
import { PeriodLearn } from 'applications/BUC/components/SEDP4000/Period/PeriodLearn'
import { PeriodOther } from 'applications/BUC/components/SEDP4000/Period/PeriodOther'
import { PeriodDailySick } from 'applications/BUC/components/SEDP4000/Period/PeriodDailySick'
import { PeriodChild } from 'applications/BUC/components/SEDP4000/Period/PeriodChild'

const PeriodAlert = ({ t, errorMessage }) => (
  <AlertStripe
    className='a-buc-c-sedp4000-period__alert mt-4 mb-4'
    type='advarsel'
  >
    {t(errorMessage)}
  </AlertStripe>
)

const PeriodHome = ({ t }) => (
  <AlertStripe
    className='a-buc-c-sedp4000-period__alert_home mt-4 mb-4'
    type='advarsel'
  >
    {t('buc:p4000-warning-home-period')}
  </AlertStripe>
)

const PeriodEdit = (props) => {
  const {
    mode,
    period,
    periods,
    locale,
    errorMessage,
    localErrors,
    t,
    actions,
    blurChildBirthDate,
    blurStartDate,
    blurEndDate,
    saveNewPeriod,
    saveEditPeriod,
    cancelPeriodRequest,
    setAttachments,
    setChildBirthDate,
    setChildFirstName,
    setChildLastName,
    setComment,
    setCountry,
    setDateType,
    setEndDate,
    setInsuranceId,
    setLearnInstitution,
    setOtherType,
    setPayingInstitution,
    setStartDate,
    setType,
    setUncertainDate,
    setWorkActivity,
    setWorkType,
    setWorkName,
    setWorkStreet,
    setWorkCity,
    setWorkRegion,
    setWorkZipCode
  } = props

  return (
    <div className={classNames('a-buc-c-sedp4000-period', mode)}>
      {errorMessage ? <PeriodAlert t={t} errorMessage={errorMessage} /> : null}
      <Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>{t('buc:p4000-title-' + mode)}</Undertittel>
      <Row className={mode}>
        <div className='col-sm-8'>
          <Select
            id='a-buc-c-sedp4000-period__kategori-select'
            label={
              <div className='a-buc-c-sedp4000-period__label'>
                <span>{t('buc:p4000-label-category')}</span>
                <HjelpetekstAuto id='p4000-category-select-help'>
                  {t('buc:p4000-help-category')}
                </HjelpetekstAuto>
              </div>
            }
            value={period.type || ''}
            onChange={setType}
          >
            <option value=''>{t('ui:choose')}</option>
            <option value='work'>{t('buc:p4000-label-category-work')}</option>
            <option value='home'>{t('buc:p4000-label-category-home')}</option>
            <option value='military'>{t('buc:p4000-label-category-military')}</option>
            <option value='learn'>{t('buc:p4000-label-category-learn')}</option>
            <option value='child'>{t('buc:p4000-label-category-child')}</option>
            <option value='voluntary'>{t('buc:p4000-label-category-voluntary')}</option>
            <option value='birth'>{t('buc:p4000-label-category-birth')}</option>
            <option value='daily'>{t('buc:p4000-label-category-daily')}</option>
            <option value='sick'>{t('buc:p4000-label-category-sick')}</option>
            <option value='other'>{t('buc:p4000-label-category-other')}</option>
          </Select>
        </div>
      </Row>
      {period.type ? (
        <>
          {period.type === 'home' ? <PeriodHome t={t} /> : null}
          <Undertittel className='a-buc-c-sedp4000-period__subtitle mt-5 mb-2'>
            {t(`buc:p4000-title-${period.type}`)}
          </Undertittel>
          <Normaltekst className='a-buc-c-sedp4000-period__description mb-3'>
            {t('buc:p4000-help-date')}
          </Normaltekst>
          <Row>
            <div className='a-buc-c-sedp4000-period__dateType col-12 mb-2'>
              <Select
                className='a-buc-c-sedp4000-period__dateType-select flex-fill'
                id='a-buc-c-sedp4000-period__dateType-select-id'
                bredde='fullbredde'
                label={t('buc:p4000-label-date-type')}
                value={period.dateType}
                onChange={setDateType}
              >
                <option value='both'>{t('buc:p4000-label-closedPeriod')}</option>
                <option value='onlyStartDate01'>{t('buc:p4000-label-onlyStartDate01')}</option>
                <option value='onlyStartDate98'>{t('buc:p4000-label-onlyStartDate98')}</option>
              </Select>
            </div>
            <div className='a-buc-c-sedp4000-period__startDate col-sm-6 col-12 mb-2'>
              <label className='datepickerLabel skjemaelement__label'>
                {t('buc:p4000-label-start-date')}
              </label>
              {
                <FocusGroup onBlur={blurStartDate}>
                  <DatePicker
                    id='a-buc-c-sedp4000-period__startdato-date'
                    labels={{ day: t('buc:p4000-label-day'), month: t('buc:p4000-label-month'), year: t('buc:p4000-label-year') }}
                    ids={{ day: 'a-buc-c-sedp4000-period__startdato-day', month: 'a-buc-c-sedp4000-period__startdato-month', year: 'a-buc-c-sedp4000-period__startdato-year' }}
                    placeholders={{ day: t('buc:p4000-placeholder-day'), month: t('buc:p4000-placeholder-month'), year: t('buc:p4000-placeholder-year') }}
                    className='startDate pr-2'
                    initialValues={period.startDate}
                    onChange={setStartDate}
                    feil={localErrors.startDate || localErrors.timeSpan ? { feilmelding: t(localErrors.startDate || localErrors.timeSpan) } : undefined}
                  />
                </FocusGroup>
              }
            </div>
            <div className='a-buc-c-sedp4000-period__endDate col-sm-6 col-12 mb-2'>
              <label className='datepickerLabel skjemaelement__label'>
                {t('buc:p4000-label-end-date')}
              </label>
              {
                <FocusGroup onBlur={blurEndDate}>
                  <DatePicker
                    disabled={period.dateType !== 'both'}
                    id='a-buc-c-sedp4000-period_sluttdato-date'
                    labels={{ day: t('buc:p4000-label-day'), month: t('buc:p4000-label-month'), year: t('buc:p4000-label-year') }}
                    ids={{ day: 'a-buc-c-sedp4000-period__sluttdato-day', month: 'a-buc-c-sedp4000-period__sluttdato-month', year: 'a-buc-c-sedp4000-period__sluttdato-year' }}
                    placeholders={{ day: t('buc:p4000-placeholder-day'), month: t('buc:p4000-placeholder-month'), year: t('buc:p4000-placeholder-year') }}
                    className='endDate pr-2'
                    initialValues={period.endDate}
                    onChange={setEndDate}
                    feil={localErrors.endDate || localErrors.timeSpan ? { feilmelding: t(localErrors.endDate || localErrors.timeSpan) } : undefined}
                  />
                </FocusGroup>
              }
            </div>
            <div className='a-buc-c-sedp4000-period__uncertainDate col-sm-6 col-12 mb-2'>
              <Checkbox
                id='a-buc-c-sedp4000-period__uncertainDate-checkbox-id'
                className='a-buc-c-sedp4000-period__uncertainDate-checkbox'
                label={t('buc:p4000-label-uncertain-date')}
                checked={period.uncertainDate}
                onChange={setUncertainDate}
              />
            </div>
          </Row>
          {
            period.type !== 'work'
              ? <PeriodNotWork t={t} setCountry={setCountry} localErrors={localErrors} locale={locale} period={period} />
              : null
          }
          {period.type === 'work' ? (
            <PeriodWork
              period={period}
              locale={locale}
              localErrors={localErrors}
              setCountry={setCountry}
              t={t}
              setWorkType={setWorkType}
              setWorkStreet={setWorkStreet}
              setWorkRegion={setWorkRegion}
              setWorkName={setWorkName}
              setWorkCity={setWorkCity}
              setWorkActivity={setWorkActivity}
              setInsuranceId={setInsuranceId}
              setWorkZipCode={setWorkZipCode}
            />
          ) : null}
          {period.type === 'learn' ? (
            <PeriodLearn t={t} localErrors={localErrors} period={period} setLearnInstitution={setLearnInstitution} />
          ) : null}
          {period.type === 'other'
            ? <PeriodOther t={t} setOtherType={setOtherType} period={period} localErrors={localErrors} />
            : null}
          {period.type === 'daily' || period.type === 'sick'
            ? (
              <PeriodDailySick localErrors={localErrors} period={period} t={t} setPayingInstitution={setPayingInstitution} />
            ) : null}
          {period.type === 'child'
            ? (
              <PeriodChild
                t={t} period={period}
                localErrors={localErrors}
                setChildLastName={setChildLastName}
                setChildFirstName={setChildFirstName}
                setChildBirthDate={setChildBirthDate}
                blurChildBirthDate={blurChildBirthDate}
              />
            ) : null}
          <Row>
            <div className='col-sm-12'>
              <Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-comment-info')}</Undertittel>
              <Textarea
                id='a-buc-c-sedp4000-period__comment-id'
                className='a-buc-c-sedp4000-period__comment skjemaelement__input'
                label={
                  <div className='a-buc-c-sedp4000-period__label'>
                    <div className='a-buc-c-sedp4000-period__label'>
                      <UndertekstBold>{t('buc:p4000-label-comment-info')}</UndertekstBold>
                      <HjelpetekstAuto id='a-buc-c-sedp4000-period__comment-help'>
                        {t('buc:p4000-help-comment-info')}
                      </HjelpetekstAuto>
                    </div>
                    <Normaltekst className='optional'>{t('ui:optional')}</Normaltekst>
                  </div>
                }
                placeholder={t('buc:p4000-placeholder-comment-info')}
                value={period.comment || ''}
                onChange={setComment}
                maxLength={2300}
              />
            </div>
          </Row>
          <Row>
            <div className='col-sm-12'>
              <Undertittel className='mt-5 mb-2'>
                {t('buc:p4000-attachment-title')}
              </Undertittel>
              <Undertekst>
                {t('buc:p4000-help-attachment')}
              </Undertekst>
              <Normaltekst className='optional mb-1'>{t('ui:optional')}</Normaltekst>
            </div>
            <div className='col-sm-12'>
              <FileUpload
                id='a-buc-c-sedp4000-period__vedlegg-fileupload-id'
                className='a-buc-c-sedp4000-period__vedlegg-fileupload'
                acceptedMimetypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxFileSize={10 * 1024 * 1024}
                maxFiles={10}
                t={t}
                files={period.attachments || []}
                onFileChange={(newFiles) => setAttachments(newFiles)}
                openModal={actions.openModal}
                closeModal={actions.closeModal}
              />
            </div>
          </Row>
          <Row>
            <div className='mt-4 mb-4 col-sm-12'>
              {mode === 'edit' ? (
                <Knapp
                  id='a-buc-c-sedp4000-period__edit-button-id'
                  className='a-buc-c-sedp4000-period__edit-button mb-2 mr-4 w-sm-100'
                  onClick={saveEditPeriod}
                >
                  {t('buc:p4000-button-saveEditPeriod')}
                </Knapp>
              ) : null}
              {mode === 'new' ? (
                <Hovedknapp
                  id='a-buc-c-sedp4000-period__save-button-id'
                  className='a-buc-c-sedp4000-period__save-button mb-2 mr-4 w-sm-100'
                  onClick={saveNewPeriod}
                >
                  {t('buc:p4000-button-saveNewPeriod')}
                </Hovedknapp>
              ) : null}
              <Flatknapp
                id='a-buc-c-sedp4000-period__cancel-button-id'
                className='a-buc-c-sedp4000-period__cancel-button mb-2 w-sm-100'
                onClick={cancelPeriodRequest}
              >
                {t('buc:p4000-button-cancelPeriod')}
              </Flatknapp>
            </div>
          </Row>
        </>
      ) : null}
      {!period.type && _.isEmpty(periods) ? (
        <AlertStripe
          className='mt-4 mb-4' type='advarsel'
        >
          {t('buc:p4000-warning-one-period')}
        </AlertStripe>
      )
        : null}
      {errorMessage ? <AlertStripe className='mt-4 mb-4' type='advarsel'>{t(errorMessage)}</AlertStripe> : null}
    </div>
  )
}

PeriodEdit.propTypes = {
  mode: PT.string.isRequired,
  period: PT.object,
  periods: PT.array,
  locale: PT.string.isRequired,
  errorMessage: PT.string,
  localErrors: PT.object,
  t: PT.func,
  actions: PT.object.isRequired,
  blurChildBirthDate: PT.func,
  blurStartDate: PT.func,
  blurEndDate: PT.func,
  saveNewPeriod: PT.func,
  saveEditPeriod: PT.func,
  cancelPeriodRequest: PT.func,
  setAttachments: PT.func,
  setChildBirthDate: PT.func,
  setChildFirstName: PT.func,
  setChildLastName: PT.func,
  setComment: PT.func,
  setCountry: PT.func,
  setDateType: PT.func,
  setEndDate: PT.func,
  setInsuranceId: PT.func,
  setLearnInstitution: PT.func,
  setOtherType: PT.func,
  setPayingInstitution: PT.func,
  setStartDate: PT.func,
  setType: PT.func,
  setUncertainDate: PT.func,
  setWorkActivity: PT.func,
  setWorkType: PT.func,
  setWorkName: PT.func,
  setWorkStreet: PT.func,
  setWorkCity: PT.func,
  setWorkRegion: PT.func,
  setWorkZipCode: PT.func
}

export default PeriodEdit
