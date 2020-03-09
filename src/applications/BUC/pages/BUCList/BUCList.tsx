import { fetchBucsInfo, getInstitutionsListForBucAndCountry, setCurrentBuc, setCurrentSed } from 'actions/buc'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import { bucFilter, bucSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDList from 'applications/BUC/components/SEDList/SEDList'
import { BUCMode } from 'applications/BUC/index'
import classNames from 'classnames'
import * as storage from 'constants/storage'
import {
  Buc,
  BucInfo,
  Bucs,
  BucsInfo,
  Institution,
  InstitutionListMap,
  Participant,
  RawInstitution,
  Sed
} from 'declarations/buc'
import { BucsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Loading } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './BUCList.css'

export interface BUCListProps {
  aktoerId: string;
  bucs: Bucs;
  setMode: (mode: BUCMode) => void;
}

export interface BUCListSelector {
  bucsInfo: BucsInfo | undefined;
  bucsInfoList: Array<string> | undefined;
  institutionList: InstitutionListMap<RawInstitution> | undefined;
  loading: Loading;
  locale: AllowedLocaleString;
}

const mapState = (state: State): BUCListSelector => ({
  bucsInfo: state.buc.bucsInfo,
  bucsInfoList: state.buc.bucsInfoList,
  institutionList: state.buc.institutionList,
  loading: state.loading,
  locale: state.ui.locale
})

type Country = {country: string, buc: string}
type CountryList = Array<Country>

const BUCList: React.FC<BUCListProps> = ({
  aktoerId, bucs, setMode
}: BUCListProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const { bucsInfo, bucsInfoList, institutionList, loading } = useSelector<State, BUCListSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onBUCNew = (): void => {
    setMode('bucnew')
  }

  const onSEDNew = (buc: Buc, sed: Sed): void => {
    dispatch(setCurrentBuc(buc ? buc.caseId! : undefined))
    dispatch(setCurrentSed(sed ? sed.id : undefined))
    setMode('sednew')
  }

  const onBUCEdit = (buc: Buc) => {
    dispatch(setCurrentBuc(buc.caseId!))
    setMode('bucedit')
  }

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && bucsInfo === undefined && !loading.gettingBUCinfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, loading])

  useEffect(() => {
    if (!mounted && !_.isEmpty(bucs)) {
      const listOfCountries: CountryList = []
      Object.keys(bucs).forEach(key => {
        const buc: Buc = bucs[key]
        if (_.isArray(buc.institusjon)) {
          buc.institusjon.forEach((it: Institution) => {
            if (!_.find(listOfCountries, { country: it.country })) {
              listOfCountries.push({
                country: it.country,
                buc: buc.type!
              })
            }
          })
        }
        if (_.isArray(buc.seds)) {
          buc.seds.forEach((sed: Sed) => {
            if (_.isArray(sed.participants)) {
              sed.participants.forEach((participant: Participant) => {
                const country = participant.organisation.countryCode
                if (!_.find(listOfCountries, { country: country })) {
                  listOfCountries.push({
                    country: country,
                    buc: buc.type!
                  })
                }
              })
            }
          })
        }
      })

      listOfCountries.forEach((country: Country) => {
        if (institutionList && !_.find(Object.keys(institutionList), country.country)) {
          dispatch(getInstitutionsListForBucAndCountry(country.buc, country.country))
        }
      })
      setMounted(true)
    }
  }, [institutionList, bucs, dispatch, mounted])

  return (
    <div className='a-buc-p-buclist'>
      <div className='a-buc-p-buclist__buttons mb-3'>
        <Ui.Nav.Knapp
          id='a-buc-p-buclist__newbuc-button-id'
          className='a-buc-p-buclist__newbuc-button'
          onClick={onBUCNew}
        >
          {t('buc:form-createNewCase')}
        </Ui.Nav.Knapp>
      </div>
      {loading.gettingBUCs
        ? (
          <Ui.WaitingPanel className='mt-5 a-buc-p-buclist__loading' size='XL' message={t('buc:loading-bucs')} />
        ) : null}
      {bucs === null
        ? (
          <div className='mt-5 a-buc-p-buclist__message'>
            {t('buc:error-noBucs')}
          </div>
        ) : null}
      {!loading.gettingBUCs && !_.isEmpty(bucs)
        ? Object.keys(bucs).map(key => bucs[key])
          .filter(bucFilter)
          .sort(bucSorter)
          .map((buc: Buc, index: number) => {
            if (buc.error) {
              return (
                <div key={index} className='a-buc-c-bucheader p-0 w-100'>
                  <Ui.Nav.AlertStripe type='advarsel' className='w-100'>{buc.error}</Ui.Nav.AlertStripe>
                </div>
              )
            }
            const bucId: string = buc.caseId!
            const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
            return (
              <Ui.ExpandingPanel
                id={'a-buc-p-buclist__buc-' + bucId}
                key={index}
                collapseProps={{ id: 'a-buc-p-buclist__buc-' + bucId }}
                className={classNames('a-buc-p-buclist__buc', 'mb-3', 's-border')}
                style={{ animationDelay: (0.2 * index) + 's' }}
                heading={
                  <BUCHeader
                    buc={buc}
                    bucInfo={bucInfo}
                    onBUCEdit={onBUCEdit}
                  />
                }
              >
                <div
                  id='a-buc-p-buclist__seadheader-div-id'
                  className='a-buc-p-buclist__sedheader pb-1'
                >
                  <div className='a-buc-p-buclist__sedheader-head col-4'>
                    <Ui.Nav.Element>{t('buc:form-name')}</Ui.Nav.Element>
                  </div>
                  <div className='a-buc-p-buclist__sedheader_head col-3'>
                    <Ui.Nav.Element>{t('buc:form-status')}</Ui.Nav.Element>
                  </div>
                  <div className='a-buc-p-buclist__sedheader-head col-3'>
                    <Ui.Nav.Element>{t('buc:form-senderreceiver')}</Ui.Nav.Element>
                  </div>
                  <div className='a-buc-p-buclist__sedheader-head col-2' />
                </div>
                <SEDList
                  seds={buc.seds}
                  buc={buc}
                  onSEDNew={onSEDNew}
                />
              </Ui.ExpandingPanel>
            )
          }) : null}
      <BUCFooter className='w-100 mt-2 mb-2' />
    </div>
  )
}

BUCList.propTypes = {
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  setMode: PT.func.isRequired
}

export default BUCList
