import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import PeriodAttachments from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodAttachments'
import PeriodButtons from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodButtons'
import PeriodCategorySelect from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodCategorySelect'
import PeriodChild from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodChild'
import PeriodComment from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodComment'
import PeriodDailySick from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodDailySick'
import PeriodDate from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodDate'
import PeriodLearn from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodLearn'
import PeriodNotWork from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodNotWork'
import PeriodOther from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodOther'
import PeriodTitle from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodTitle'
import PeriodWarn from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodWarn'
import PeriodWork from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodWork'

import 'applications/BUC/components/SEDP4000/Period/Period.css'

const PeriodEdit = ({
  actions,
  blurChildBirthDate,
  blurEndDate,
  blurStartDate,
  cancelPeriodRequest,
  errorMessage,
  locale,
  localErrors,
  mode,
  period,
  periods,
  saveEditPeriod,
  saveNewPeriod,
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
  setWorkCity,
  setWorkName,
  setWorkRegion,
  setWorkStreet,
  setWorkType,
  setWorkZipCode,
  t
}) => {
  return (
    <div className={classNames('a-buc-c-sedp4000-period', mode)}>
      <PeriodTitle errorMessage={errorMessage} mode={mode} t={t} />
      <PeriodCategorySelect mode={mode} period={period} setType={setType} t={t} />
      {period.type ? (
        <>
          <PeriodDate
            blurEndDate={blurEndDate}
            blurStartDate={blurStartDate}
            localErrors={localErrors}
            period={period}
            setDateType={setDateType}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            setUncertainDate={setUncertainDate}
            t={t}
          />
          {period.type === 'work' ? (
            <PeriodWork
              locale={locale}
              localErrors={localErrors}
              period={period}
              setCountry={setCountry}
              setInsuranceId={setInsuranceId}
              setWorkActivity={setWorkActivity}
              setWorkCity={setWorkCity}
              setWorkName={setWorkName}
              setWorkRegion={setWorkRegion}
              setWorkStreet={setWorkStreet}
              setWorkType={setWorkType}
              setWorkZipCode={setWorkZipCode}
              t={t}
            />
          ) : <PeriodNotWork locale={locale} localErrors={localErrors} period={period} setCountry={setCountry} t={t} />}
          {period.type === 'learn' ? (
            <PeriodLearn localErrors={localErrors} period={period} setLearnInstitution={setLearnInstitution} t={t} />
          ) : null}
          {period.type === 'other'
            ? <PeriodOther localErrors={localErrors} period={period} setOtherType={setOtherType} t={t} />
            : null}
          {period.type === 'daily' || period.type === 'sick'
            ? (
              <PeriodDailySick localErrors={localErrors} period={period} setPayingInstitution={setPayingInstitution} t={t} />
            ) : null}
          {period.type === 'child'
            ? (
              <PeriodChild
                blurChildBirthDate={blurChildBirthDate}
                localErrors={localErrors}
                setChildBirthDate={setChildBirthDate}
                setChildFirstName={setChildFirstName}
                setChildLastName={setChildLastName}
                t={t} period={period}
              />
            ) : null}
          <PeriodComment period={period} setComment={setComment} t={t} />
          <PeriodAttachments closeModal={actions.closeModal} openModal={actions.openModal} period={period} setAttachments={setAttachments} t={t} />
          <PeriodButtons cancelPeriodRequest={cancelPeriodRequest} mode={mode} saveEditPeriod={saveEditPeriod} saveNewPeriod={saveNewPeriod} t={t} />
        </>
      ) : null}
      <PeriodWarn errorMessage={errorMessage} period={period} periods={periods} t={t} />
    </div>
  )
}

PeriodEdit.propTypes = {
  actions: PT.object.isRequired,
  blurChildBirthDate: PT.func,
  blurEndDate: PT.func,
  blurStartDate: PT.func,
  cancelPeriodRequest: PT.func,
  errorMessage: PT.string,
  locale: PT.string.isRequired,
  localErrors: PT.object,
  mode: PT.string.isRequired,
  period: PT.object,
  periods: PT.array,
  saveEditPeriod: PT.func,
  saveNewPeriod: PT.func,
  setAttachments: PT.func.isRequired,
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
  setWorkCity: PT.func,
  setWorkName: PT.func,
  setWorkRegion: PT.func,
  setWorkStreet: PT.func,
  setWorkType: PT.func,
  setWorkZipCode: PT.func,
  t: PT.func.isRequired
}

export default PeriodEdit
