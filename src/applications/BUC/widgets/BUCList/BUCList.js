import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import SEDBody from 'applications/BUC/components/SEDBody/SEDBody'
import BUCEmpty from 'applications/BUC/widgets/BUCEmpty/BUCEmpty'
import { EkspanderbartpanelBase, Knapp, Lenke, NavFrontendSpinner } from 'components/Nav'
import Icons from 'components/Icons'
import _ from 'lodash'

import './BUCList.css'

const BUCList = (props) => {
  const { actions, aktoerId, bucs, bucsInfoList, bucsInfo, institutionList, loading, locale, rinaUrl, sakId, t } = props
  const [gettingBucsInfo, setGettingBucsInfo] = useState(false)
  const [mounted, setMounted] = useState(false)

  const onBUCNew = () => {
    actions.setMode('bucnew')
  }

  const onSedNew = (buc) => {
    actions.setCurrentBuc(buc.caseId)
    actions.setMode('sednew')
  }

  const onBUCEdit = async (buc) => {
    actions.setCurrentBuc(buc.caseId)
    actions.setMode('bucedit')
  }

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && !gettingBucsInfo && bucsInfoList.indexOf(aktoerId + '___BUC___INFO') >= 0) {
      actions.fetchBucsInfo(aktoerId + '___BUC___INFO')
      setGettingBucsInfo(true)
    }
  }, [bucsInfoList, gettingBucsInfo, actions, aktoerId])

  useEffect(() => {
    if (!mounted && !_.isEmpty(bucs)) {
      const listOfCountries = []
      Object.keys(bucs).forEach(key => {
        const buc = bucs[key]
        if(_.isArray(buc.institusjon)) {
          buc.institusjon.forEach(it => {
            if (!_.find(listOfCountries, {country: it.country})) {
              listOfCountries.push({
                country: it.country,
                buc: buc.type
              })
            }
          })
        }
        if(_.isArray(buc.seds)) {
          buc.seds.forEach(sed => {
            if (_.isArray(sed.participants)) {
              sed.participants.forEach(it => {
                const country = it.organisation.countryCode
                if (!_.find(listOfCountries, {country: country})) {
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

  if (!loading.gettingBUCs && bucs !== undefined && _.isEmpty(bucs)) {
    actions.setMode('bucnew')
  }

  return <div className='a-buc-buclist'>
    <div className='a-buc-buclist__buttons mb-3'>
      {aktoerId && sakId
        ? (
          <Knapp
            id='a-buc-buclist__newbuc-button-id'
            className='a-buc-buclist__newbuc-button'
            onClick={onBUCNew}
          >
            {t('buc:form-createNewCase')}
          </Knapp>
        )
        : null}
    </div>
    {loading.gettingBUCs
      ? (
        <div className='mt-5 a-buc-widget__loading'>
          <NavFrontendSpinner className='ml-3 mr-3' type='XL'/>
          <span className='pl-2'>{t('buc:loading-bucs')}</span>
        </div>
      ) : null}
    {bucs === null
      ? (
        <div className='mt-5 a-buc-widget__message'>
          {t('buc:error-noBucs')}
        </div>
      ) : null}
    {!loading.gettingBUCs && !_.isEmpty(bucs)
      ? Object.keys(bucs).map( key => bucs[key] )
        .sort((firstEl, secondEl) => {
        return moment(firstEl.startDate).isSameOrAfter(moment(secondEl.startDate)) ? -1 : 1
        }).map((buc, index) => {
        const bucId = buc.caseId
        const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId] : {}
        return (
          <EkspanderbartpanelBase
            id={'a-buc-buclist__buc-' + bucId}
            className={classNames('a-buc-buclist__buc', 'mb-3', 's-border')}
            key={index}
            style={{animationDelay: (0.2 * index) + 's'}}
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
            <SEDHeader t={t}/>
            <SEDBody
              t={t}
              seds={buc.seds || []}
              rinaUrl={rinaUrl}
              locale={locale}
              buc={buc}
              onSEDNew={onSedNew.bind(null, buc)}
            />
          </EkspanderbartpanelBase>
        )
      }) : null}
    {(!sakId || !aktoerId)
      ? <BUCEmpty {...props} />
      : null}
    {(sakId && aktoerId)
      ? (
        <div className='mb-2 a-buc-buclist__footer'>
          <Lenke
            id='a-buc-c-buclist__gotorina-link'
            className='a-buc-c-buclist__gotorina'
            href={rinaUrl}
            target='rinaWindow'
          >
            <div className='d-flex'>
              <Icons className='mr-2' color='#0067C5' kind='outlink'/>
              <span>{props.t('ui:goToRina')}</span>
            </div>
          </Lenke>
        </div>
      ) : null}
  </div>
}

BUCList.propTypes = {
  t: PT.func.isRequired,
  bucs: PT.object,
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  rinaUrl: PT.string,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired
}

export default BUCList
