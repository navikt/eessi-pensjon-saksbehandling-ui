import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import { Icons, Nav, WaitingPanel } from 'eessi-pensjon-ui'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import SEDList from 'applications/BUC/components/SEDList/SEDList'
import './BUCList.css'

const BUCList = ({ actions, aktoerId, bucs, bucsInfoList, bucsInfo, institutionList, loading, locale, rinaUrl, sakId, t }) => {
  const [gettingBucsInfo, setGettingBucsInfo] = useState(false)
  const [mounted, setMounted] = useState(false)

  const onBUCNew = () => {
    actions.setMode('bucnew')
  }

  const onSEDNew = (buc, sed) => {
    actions.setCurrentBuc(buc ? buc.caseId : undefined)
    actions.setCurrentSed(sed ? sed.id : undefined)
    actions.setMode('sednew')
  }

  const onBUCEdit = async (buc) => {
    actions.setCurrentBuc(buc.caseId)
    actions.setMode('bucedit')
  }

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && !gettingBucsInfo && bucsInfoList.indexOf(aktoerId + '___BUC___INFO') >= 0) {
      actions.fetchBucsInfo(aktoerId, 'BUC', 'INFO')
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
    actions.setMode('bucnew')
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
                    locale={locale}
                    onBUCEdit={onBUCEdit}
                  />
                }
              >
                <div
                  id='a-buc-c-sedheader__div-id'
                  className='a-buc-buclist__sedheader pb-1'
                >
                  <div className='a-buc-buclist__sedheader-head col-2'>
                    <Nav.Element>{t('buc:form-name')}</Nav.Element>
                  </div>
                  <div className='a-buc-buclist__sedheader_head col-4'>
                    <Nav.Element>{t('buc:form-status')}</Nav.Element>
                  </div>
                  <div className='a-buc-buclist__sedheader-head col-4'>
                    <Nav.Element>{t('buc:form-receiver')}</Nav.Element>
                  </div>
                  <div className='a-buc-buclist__sedheader-head col-2' />
                </div>
                <SEDList
                  t={t}
                  seds={buc.seds || []}
                  rinaUrl={rinaUrl}
                  locale={locale}
                  buc={buc}
                  onSEDNew={onSEDNew}
                />
              </Nav.EkspanderbartpanelBase>
            )
          }) : null}
      {(sakId && aktoerId)
        ? (
          <div className='mb-2 a-buc-buclist__footer'>
            <Nav.Lenke
              id='a-buc-c-buclist__gotorina-link'
              className='a-buc-c-buclist__gotorina'
              href={rinaUrl}
              target='rinaWindow'
            >
              <div className='d-flex'>
                <Icons className='mr-2' color='#0067C5' kind='outlink' />
                <span>{t('ui:goToRina')}</span>
              </div>
            </Nav.Lenke>
          </div>
        ) : null}
    </div>
  )
}

BUCList.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  bucs: PT.object,
  rinaUrl: PT.string,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired,
  t: PT.func.isRequired
}

export default BUCList
