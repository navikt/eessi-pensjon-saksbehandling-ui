import React, { useState } from 'react'
import PT from 'prop-types'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'
import BUCEmpty from './BUCEmpty'
import { EkspanderbartpanelBase, Flatknapp } from 'components/ui/Nav'
import _ from 'lodash'

import './BUCList.css'

const BUCList = (props) => {
  const { t, bucs, actions, aktoerId, gettingBUCs, locale } = props
  const [seds, setSeds] = useState({})

  const onBUCNew = () => {
    actions.setMode('newbuc')
  }

  const getBucs = () => {
    actions.fetchBucs(aktoerId)
  }

  const updateSeds = (buc) => {
    if (seds[buc.buc]) {
      return seds
    }
    let _buc = _.find(bucs, {buc: buc.buc})
    const newSeds = {
      ...seds,
      [buc.buc]: (_buc ? _buc.seds : [])
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
    actions.setSeds(newSeds[buc.buc])
    actions.setMode('edit')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
      <div />
      { aktoerId ? <Flatknapp onClick={onBUCNew}>{t('buc:form-createNewCase')}</Flatknapp> : null}
    </div>
    {!_.isEmpty(bucs) ? bucs.map((buc, index) => {
      return <EkspanderbartpanelBase
        className='mb-3'
        key={index}
        heading={<BUCHeader t={t} buc={buc} locale={locale} onBUCEdit={onBUCEdit} />}
        onClick={() => onExpandBUCClick(buc)}>
        <SEDHeader t={t} />
        {seds[buc.buc] ? seds[buc.buc].map((sed, index) => (
          <SEDRow t={t} key={index} sed={sed} border />
        )) : null}
      </EkspanderbartpanelBase>
    }): <BUCEmpty t={t} aktoerId={aktoerId} bucs={bucs} gettingBUCs={gettingBUCs} getBucs={getBucs} /> }
  </React.Fragment>
}

BUCList.propTypes = {
 t: PT.func.isRequired,
 bucs: PT.array,
 actions: PT.object.isRequired,
 aktoerId: PT.string,
 gettingBUCs: PT.bool.isRequired,
 locale: PT.string.isRequired
}

export default BUCList
