import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import { bucFilter, bucSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDList from 'applications/BUC/components/SEDList/SEDList'
import {
  Buc,
  BucInfo,
  Bucs,
  BucsInfo,
  Institution,
  InstitutionNames,
  Participant,
  Sed
} from 'applications/BUC/declarations/buc.d'
import classNames from 'classnames'
import * as storage from 'constants/storage'
import Ui from 'eessi-pensjon-ui'

import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { ActionCreators, AllowedLocaleString, Loading, RinaUrl, T } from 'types.d'
import { InstitutionListMap, RawInstitution } from '../../declarations/buc'
import './BUCList.css'

export interface BUCListProps {
  actions: ActionCreators;
  aktoerId?: string;
  bucs: Bucs;
  bucsInfoList: Array<string>;
  bucsInfo: BucsInfo;
  institutionList: InstitutionListMap<RawInstitution>;
  institutionNames: InstitutionNames;
  loading: Loading;
  locale?: AllowedLocaleString;
  rinaUrl?: RinaUrl;
  sakId?: string;
  setMode: Function;
  t: T;
}

type Country = {country: string, buc: string}
type CountryList = Array<Country>

const BUCList = ({
  actions, aktoerId, bucs, bucsInfoList, bucsInfo, institutionList = {}, institutionNames,
  loading, locale, rinaUrl, sakId, setMode, t
}: BUCListProps) => {
  const [gettingBucsInfo, setGettingBucsInfo] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  const onBUCNew = (): void => {
    setMode('bucnew')
  }

  const onSEDNew = (buc: Buc, sed: Sed): void => {
    actions.setCurrentBuc(buc ? buc.caseId : undefined)
    actions.setCurrentSed(sed ? sed.id : undefined)
    setMode('sednew')
  }

  const onBUCEdit = async (buc: Buc) => {
    actions.setCurrentBuc(buc.caseId)
    setMode('bucedit')
  }

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && !gettingBucsInfo &&
      bucsInfoList.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      actions.fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
      setGettingBucsInfo(true)
    }
  }, [bucsInfoList, gettingBucsInfo, actions, aktoerId])

  useEffect(() => {
    if (!mounted && !_.isEmpty(bucs)) {
      const listOfCountries: CountryList = []
      Object.keys(bucs).forEach(key => {
        const buc = bucs[key]
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
        if (!_.find(Object.keys(institutionList), country.country)) {
          actions.getInstitutionsListForBucAndCountry(country.buc, country.country)
        }
      })
      setMounted(true)
    }
  }, [institutionList, bucs, mounted, actions])

  if (aktoerId && sakId && !loading.gettingBUCs && bucs !== undefined && _.isEmpty(bucs)) {
    setMode('bucnew')
  }

  return (
    <div className='a-buc-p-buclist'>
      <div className='a-buc-p-buclist__buttons mb-3'>
        {aktoerId && sakId
          ? (
            <Ui.Nav.Knapp
              id='a-buc-p-buclist__newbuc-button-id'
              className='a-buc-p-buclist__newbuc-button'
              onClick={onBUCNew}
            >
              {t('buc:form-createNewCase')}
            </Ui.Nav.Knapp>
          )
          : null}
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
            const bucId = buc.caseId
            const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId!] : {} as BucInfo
            return (
              <Ui.ExpandingPanel
                id={'a-buc-p-buclist__buc-' + bucId}
                className={classNames('a-buc-p-buclist__buc', 'mb-3', 's-border')}
                key={index}
                style={{ animationDelay: (0.2 * index) + 's' }}
                heading={
                  <BUCHeader
                    t={t}
                    buc={buc}
                    bucInfo={bucInfo}
                    institutionNames={institutionNames}
                    locale={locale!}
                    rinaUrl={rinaUrl!}
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
                  t={t}
                  seds={buc.seds || []}
                  locale={locale!}
                  buc={buc}
                  institutionNames={institutionNames}
                  onSEDNew={onSEDNew}
                />
              </Ui.ExpandingPanel>
            )
          }) : null}
      {rinaUrl ? <BUCFooter className='w-100 mt-2 mb-2' rinaUrl={rinaUrl} t={t} /> : null}
    </div>
  )
}

BUCList.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  bucs: PT.object,
  rinaUrl: PT.string,
  institutionNames: PT.object,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired,
  t: PT.func.isRequired
}

export default BUCList
