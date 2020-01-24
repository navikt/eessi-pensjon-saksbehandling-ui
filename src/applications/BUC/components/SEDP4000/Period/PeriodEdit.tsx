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
import PeriodWork from 'applications/BUC/components/SEDP4000/Period/EditComponents/PeriodWork'
import 'applications/BUC/components/SEDP4000/Period/Period.css'
import classNames from 'classnames'
import { Period, Periods } from 'declarations/period'
import { PeriodPropType, PeriodsPropType } from 'declarations/period.pt'
import { AllowedLocaleString, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType, TPropType, ValidationPropType } from 'declarations/types.pt'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import PT from 'prop-types'
import React from 'react'

export interface PeriodEditProps {
  blurChildBirthDate?: () => void;
  blurEndDate?: () => void;
  blurStartDate?: () => void;
  cancelPeriodRequest?: () => void;
  closeModal: () => void;
  locale: AllowedLocaleString;
  localErrors: Validation;
  mode: string;
  openModal: (m: ModalContent) => void;
  period: Period;
  periods: Periods;
  saveEditPeriod: () => void;
  saveNewPeriod: () => void;
  setAttachments: (e: any) => void;
  setChildBirthDate: (e: any) => void;
  setChildFirstName: (e: any) => void;
  setChildLastName: (e: any) => void;
  setComment: (e: any) => void;
  setCountry: (e: any) => void;
  setDateType: (e: any) => void;
  setEndDate: (e: any) => void;
  setInsuranceId: (e: any) => void;
  setLearnInstitution: (e: any) => void;
  setOtherType: (e: any) => void;
  setPayingInstitution: (e: any) => void;
  setStartDate: (e: any) => void;
  setType: (e: any) => void;
  setUncertainDate: (e: any) => void;
  setWorkActivity: (e: any) => void;
  setWorkCity: (e: any) => void;
  setWorkName: (e: any) => void;
  setWorkRegion: (e: any) => void;
  setWorkStreet: (e: any) => void;
  setWorkType: (e: any) => void;
  setWorkZipCode: (e: any) => void;
  t: any;
}

const PeriodEdit: React.FC<PeriodEditProps> = ({
  blurChildBirthDate,
  blurEndDate,
  blurStartDate,
  cancelPeriodRequest,
  closeModal,
  locale,
  localErrors,
  mode,
  openModal,
  period,
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
}: PeriodEditProps): JSX.Element => {
  return (
    <div className={classNames('a-buc-c-sedp4000-period', mode)}>
      <PeriodTitle mode={mode} t={t} />
      <PeriodCategorySelect mode={mode} period={period} setType={setType} t={t} />
      {period.type ? (
        <>
          <PeriodDate
            blurEndDate={blurEndDate!}
            blurStartDate={blurStartDate!}
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
                blurChildBirthDate={blurChildBirthDate!}
                localErrors={localErrors}
                setChildBirthDate={setChildBirthDate}
                setChildFirstName={setChildFirstName}
                setChildLastName={setChildLastName}
                t={t} period={period}
              />
            ) : null}
          <PeriodComment period={period} setComment={setComment} t={t} />
          <PeriodAttachments closeModal={closeModal} openModal={openModal} period={period} setAttachments={setAttachments} t={t} />
          <PeriodButtons cancelPeriodRequest={cancelPeriodRequest!} mode={mode} saveEditPeriod={saveEditPeriod} saveNewPeriod={saveNewPeriod} t={t} />
        </>
      ) : null}
    </div>
  )
}

PeriodEdit.propTypes = {
  blurChildBirthDate: PT.func,
  blurEndDate: PT.func,
  blurStartDate: PT.func,
  cancelPeriodRequest: PT.func,
  closeModal: PT.func.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  localErrors: ValidationPropType.isRequired,
  mode: PT.string.isRequired,
  openModal: PT.func.isRequired,
  period: PeriodPropType.isRequired,
  periods: PeriodsPropType.isRequired,
  saveEditPeriod: PT.func.isRequired,
  saveNewPeriod: PT.func.isRequired,
  setAttachments: PT.func.isRequired,
  setChildBirthDate: PT.func.isRequired,
  setChildFirstName: PT.func.isRequired,
  setChildLastName: PT.func.isRequired,
  setComment: PT.func.isRequired,
  setCountry: PT.func.isRequired,
  setDateType: PT.func.isRequired,
  setEndDate: PT.func.isRequired,
  setInsuranceId: PT.func.isRequired,
  setLearnInstitution: PT.func.isRequired,
  setOtherType: PT.func.isRequired,
  setPayingInstitution: PT.func.isRequired,
  setStartDate: PT.func.isRequired,
  setType: PT.func.isRequired,
  setUncertainDate: PT.func.isRequired,
  setWorkActivity: PT.func.isRequired,
  setWorkCity: PT.func.isRequired,
  setWorkName: PT.func.isRequired,
  setWorkRegion: PT.func.isRequired,
  setWorkStreet: PT.func.isRequired,
  setWorkType: PT.func.isRequired,
  setWorkZipCode: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodEdit
