import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'
import BUCEmpty from './BUCEmpty'
import { EkspanderbartpanelBase, Flatknapp } from 'components/ui/Nav'
import _ from 'lodash'

import './BUCList.css'

const BUCList = (props) => {
  const { t, bucs, bucsInfoList, bucsInfo, actions, aktoerId, rinaUrl, gettingBUCs, locale } = props
  const [ seds, setSeds ] = useState({})
  const [ gettingBucsInfo, setGettingBucsInfo ] = useState(false)

  const onBUCNew = () => {
    actions.setMode('newbuc')
  }

  useEffect(() => {
    if (bucsInfoList && !gettingBucsInfo) {
      if (!_.isEmpty(bucsInfoList)) {
        actions.fetchBucsInfo(aktoerId)
      }
      setGettingBucsInfo(true)
    }
  }, [bucsInfoList, gettingBucsInfo, actions, aktoerId])

  const getBucs = () => {
    actions.fetchBucs(aktoerId)
    actions.fetchBucsInfoList(aktoerId)
  }

  const updateSeds = (buc) => {
    if (seds[buc.type]) {
      return seds
    }
    let _buc = _.find(bucs, { type: buc.type })
    const newSeds = {
      ...seds,
      [buc.type]: (_buc ? _buc.seds : [])
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
    actions.setSeds(newSeds[buc.type])
    actions.setMode('edit')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
      <div />
      { aktoerId ? <Flatknapp onClick={onBUCNew}>{t('buc:form-createNewCase')}</Flatknapp> : null}
    </div>
    {!_.isEmpty(bucs) ? bucs.map((buc, index) => {
      let bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.type] : {}
      return <EkspanderbartpanelBase
        className='mb-3'
        key={index}
        heading={<BUCHeader t={t} buc={buc} bucInfo={bucInfo} locale={locale} onBUCEdit={onBUCEdit} />}
        onClick={() => onExpandBUCClick(buc)}>
        <SEDHeader t={t} />
        {seds[buc.type] ? seds[buc.type].map((sed, index) => (
          <SEDRow t={t} key={index} sed={sed} rinaUrl={rinaUrl} rinaId={buc.caseId} locale={locale} border />
        )) : null}
      </EkspanderbartpanelBase>
    }) : <BUCEmpty actions={actions} t={t} aktoerId={aktoerId} bucs={bucs} gettingBUCs={gettingBUCs} getBucs={getBucs} /> }
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
