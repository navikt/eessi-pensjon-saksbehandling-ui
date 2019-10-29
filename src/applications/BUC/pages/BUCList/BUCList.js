import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import * as storage from 'constants/storage'
import _ from 'lodash'
import moment from 'moment'
import { Nav, WaitingPanel } from 'eessi-pensjon-ui'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import SEDList from 'applications/BUC/components/SEDList/SEDList'
import './BUCList.css'

const BUCList = ({ actions, aktoerId, bucs, bucsInfoList, bucsInfo, institutionList, institutionNames, loading, locale, rinaUrl, sakId, setMode, t }) => {
  const [gettingBucsInfo, setGettingBucsInfo] = useState(false)
  const [mounted, setMounted] = useState(false)

  const onBUCNew = () => {
    setMode('bucnew')
  }

  const onSEDNew = (buc, sed) => {
    actions.setCurrentBuc(buc ? buc.caseId : undefined)
    actions.setCurrentSed(sed ? sed.id : undefined)
    setMode('sednew')
  }

  const onBUCEdit = async (buc) => {
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
      const listOfCountries = []
      Object.keys(bucs).forEach(key => {
        const buc = bucs[key]
        if (_.isArray(buc.institusjon)) {
          buc.institusjon.forEach(it => {
            if (!_.find(listOfCountries, { country: it.country })) {
              listOfCountries.push({
                country: it.country,
                buc: buc.type
              })
            }
          })
        }
        if (_.isArray(buc.seds)) {
          buc.seds.forEach(sed => {
            if (_.isArray(sed.participants)) {
              sed.participants.forEach(it => {
                const country = it.organisation.countryCode
                if (!_.find(listOfCountries, { country: country })) {
                  listOfCountries.push({
                    country: country,
                    buc: buc.type
                  })
                }
              })
            }
          })
        }
      })

      listOfCountries.forEach(it => {
        if (!_.find(institutionList, it)) {
          actions.getInstitutionsListForBucAndCountry(it.buc, it.country)
        }
      })
      setMounted(true)
    }
  }, [institutionList, bucs, mounted, actions])

  if (aktoerId && sakId && !loading.gettingBUCs && bucs !== undefined && _.isEmpty(bucs)) {
    setMode('bucnew')
  }

  return (
    <div className='a-buc-buclist'>
      <div className='a-buc-buclist__buttons mb-3'>
        {aktoerId && sakId
          ? (
            <Nav.Knapp
              id='a-buc-buclist__newbuc-button-id'
              className='a-buc-buclist__newbuc-button'
              onClick={onBUCNew}
            >
              {t('buc:form-createNewCase')}
            </Nav.Knapp>
          )
          : null}
      </div>
      {loading.gettingBUCs
        ? (
          <WaitingPanel className='mt-5 a-buc-widget__loading' size='XL' message={t('buc:loading-bucs')} />
        ) : null}
      {bucs === null
        ? (
          <div className='mt-5 a-buc-widget__message'>
            {t('buc:error-noBucs')}
          </div>
        ) : null}
      {!loading.gettingBUCs && !_.isEmpty(bucs)
        ? Object.keys(bucs).map(key => bucs[key])
          .sort((firstEl, secondEl) => {
            return moment(firstEl.startDate).isSameOrAfter(moment(secondEl.startDate)) ? -1 : 1
          }).map((buc, index) => {
            const bucId = buc.caseId
            const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId] : {}
            return (
              <Nav.EkspanderbartpanelBase
                id={'a-buc-buclist__buc-' + bucId}
                className={classNames('a-buc-buclist__buc', 'mb-3', 's-border')}
                key={index}
                style={{ animationDelay: (0.2 * index) + 's' }}
                heading={
                  <BUCHeader
                    t={t}
                    buc={buc}
                    bucInfo={bucInfo}
                    institutionNames={institutionNames}
                    locale={locale}
                    rinaUrl={rinaUrl}
                    onBUCEdit={onBUCEdit}
                  />
                }
              >
                <div
                  id='a-buc-c-sedheader__div-id'
                  className='a-buc-buclist__sedheader pb-1'
                >
                  <div className='a-buc-buclist__sedheader-head col-4'>
                    <Nav.Element>{t('buc:form-name')}</Nav.Element>
                  </div>
                  <div className='a-buc-buclist__sedheader_head col-3'>
                    <Nav.Element>{t('buc:form-status')}</Nav.Element>
                  </div>
                  <div className='a-buc-buclist__sedheader-head col-3'>
                    <Nav.Element>{t('buc:form-senderreceiver')}</Nav.Element>
                  </div>
                  <div className='a-buc-buclist__sedheader-head col-2' />
                </div>
                <SEDList
                  t={t}
                  seds={buc.seds || []}
                  locale={locale}
                  buc={buc}
                  institutionNames={institutionNames}
                  onSEDNew={onSEDNew}
                />
              </Nav.EkspanderbartpanelBase>
            )
          }) : null}
      <BUCFooter className='w-100 mt-2 mb-2' rinaUrl={rinaUrl} t={t} />
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
