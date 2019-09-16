import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import PeriodNotWork from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodNotWork'
import PeriodWork from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodWork'
import PeriodLearn from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodLearn'
import PeriodOther from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodOther'
import PeriodDailySick from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodDailySick'
import PeriodChild from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodChild'
import PeriodTitle from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodTitle'
import PeriodCategorySelect from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodCategorySelect'
import PeriodDate from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodDate'
import PeriodComment from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodComment'
import PeriodAttachments from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodAttachments'
import PeriodButtons from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodButtons'
import PeriodWarn from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodWarn'

import 'applications/BUC/components/SEDP4000/Period/Period.css'

const PeriodEdit = ({
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
}) => {
  return (
    <div className={classNames('a-buc-c-sedp4000-period', mode)}>
      <PeriodTitle t={t} mode={mode} errorMessage={errorMessage} />
      <PeriodCategorySelect mode={mode} t={t} period={period} setType={setType} />
      {period.type ? (
        <>
          <PeriodDate
            period={period}
            t={t}
            localErrors={localErrors}
            setUncertainDate={setUncertainDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setDateType={setDateType}
            blurStartDate={blurStartDate}
            blurEndDate={blurEndDate}
          />
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
          ) : <PeriodNotWork t={t} setCountry={setCountry} localErrors={localErrors} locale={locale} period={period} />}
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
          <PeriodComment t={t} period={period} setComment={setComment} />
          <PeriodAttachments t={t} period={period} setAttachments={setAttachments} openModal={actions.openModal} closeModal={actions.closeModal} />
          <PeriodButtons t={t} mode={mode} saveNewPeriod={saveNewPeriod} saveEditPeriod={saveEditPeriod} cancelPeriodRequest={cancelPeriodRequest} />
        </>
      ) : null}
      <PeriodWarn t={t} period={period} periods={periods} errorMessage={errorMessage} />
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
