import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import SEDBody from 'applications/BUC/components/SEDBody/SEDBody'
import RefreshButton from 'components/ui/RefreshButton/RefreshButton'
import BUCEmpty from './BUCEmpty'
import { EkspanderbartpanelBase, Flatknapp, NavFrontendSpinner } from 'components/ui/Nav'
import _ from 'lodash'

import './BUCList.css'

const BUCList = (props) => {
  const { t, bucs, bucsInfoList, institutionList, bucsInfo, actions, sakId, aktoerId, rinaUrl, gettingBUCs, locale } = props
  const [ seds, setSeds ] = useState({})
  const [ gettingBucsInfo, setGettingBucsInfo ] = useState(false)
  const [ mounted, setMounted ] = useState(false)

  const onBUCNew = () => {
    actions.setMode('newbuc')
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
      bucs.forEach(buc => {
        buc.institusjon.forEach(it => {
          if (!_.find(listOfCountries, { country: it.country })) {
            listOfCountries.push({
              country: it.country,
              buc: buc.type
            })
          }
        })
        buc.seds.forEach(sed => {
          sed.participants.forEach(it => {
            const country = it.organisation.countryCode
            if (!_.find(listOfCountries, { country: country })) {
              listOfCountries.push({
                country: country,
                buc: buc.type
              })
            }
          })
        })
      })

      listOfCountries.forEach(it => {
        if (!_.find(institutionList, it)) {
          actions.getInstitutionsListForBucAndCountry(it.buc, it.country)
        }
      })
      setMounted(true)
    }
  }, [institutionList, bucs, mounted])

  const getBucs = () => {
    actions.fetchBucs(aktoerId)
    actions.fetchBucsInfoList(aktoerId)
  }

  const updateSeds = (buc) => {
    if (seds[buc.type + '-' + buc.caseId]) {
      return seds
    }
    let _buc = _.find(bucs, { type: buc.type, caseId: buc.caseId })
    const newSeds = {
      ...seds,
      [buc.type + '-' + buc.caseId]: (_buc ? _buc.seds : [])
    }
    setSeds(newSeds)
    return newSeds
  }

  const onExpandBUCClick = async (buc) => {
    await updateSeds(buc)
  }

  const onBUCEdit = async (buc) => {
    const newSeds = await updateSeds(buc)
    actions.setBuc(buc)
    actions.setSeds(newSeds[buc.type + '-' + buc.caseId])
    actions.setMode('edit')
  }

  return <React.Fragment>
    <div className='a-buc-buclist__buttons mb-2'>
      <RefreshButton t={t} onRefreshClick={getBucs} rotating={gettingBUCs} />
      {aktoerId && sakId ? <Flatknapp onClick={onBUCNew}>{t('buc:form-createNewCase')}</Flatknapp> : null}
    </div>
    {gettingBUCs ? <div className='mt-5 a-buc-widget__loading'>
      <NavFrontendSpinner className='ml-3 mr-3' type='XL' />
      <span className='pl-2'>{t('buc:loading-bucs')}</span>
    </div> : null}
    {bucs === null ? <div className='mt-5 a-buc-widget__loading'>
      {t('buc:error-noBucs')}
    </div> : null}
    {!gettingBUCs && !_.isEmpty(bucs) ? bucs.map((buc, index) => {
      let bucId = buc.type + '-' + buc.caseId
      let bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId] : {}
      return <EkspanderbartpanelBase
        className='a-buc-buclist__buc mb-3'
        key={index}
        style={{ animationDelay: (0.2 * index) + 's' }}
        heading={<BUCHeader t={t}
          buc={buc}
          bucInfo={bucInfo}
          locale={locale}
          onBUCEdit={onBUCEdit}
        />}
        onClick={() => onExpandBUCClick(buc)}>
        <SEDHeader t={t} />
        <SEDBody t={t} seds={seds[bucId] || []} rinaUrl={rinaUrl} locale={locale} buc={buc} />
      </EkspanderbartpanelBase>
    }) : null}
    {(!sakId || !aktoerId) || (_.isArray(bucs) && _.isEmpty(bucs)) ?
      <BUCEmpty actions={actions} onBUCNew={onBUCNew} t={t} sakId={sakId}
      aktoerId={aktoerId} bucs={bucs} gettingBUCs={gettingBUCs} getBucs={getBucs} /> : null}
  </React.Fragment>
}

BUCList.propTypes = {
  t: PT.func.isRequired,
  bucs: PT.array,
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  rinaUrl: PT.string,
  gettingBUCs: PT.bool.isRequired,
  locale: PT.string.isRequired
}

export default BUCList
