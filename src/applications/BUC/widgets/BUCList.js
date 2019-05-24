import React, { useState } from 'react'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'
import BUCEmpty from './BUCEmpty'
import { EkspanderbartpanelBase, Flatknapp } from 'components/ui/Nav'
import * as bucActions from 'actions/buc'

import './BUCList.css'

const BUCList = (props) => {
  const { t, list, actions, locale } = props
  const [seds, setSeds] = useState({})

  const onBUCNew = () => {
    actions.setMode('newbuc')
  }

  /* useEffect(() => {
      if (!list) {
        actions.fetchBucList()
      }
  }, [list, actions])
  */

  const getBucList = () => {
    actions.fetchBucList()
  }

  const updateSeds = async (buc) => {
    if (seds[buc.type]) {
      return seds
    }
    const newSeds = Object.assign({}, seds, {
      [buc.type]: await bucActions.fetchSedListForBuc(buc)
    })
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
      <Flatknapp onClick={onBUCNew}>{t('buc:form-createNewCase')}</Flatknapp>
    </div>
    {list ? list.map((buc, index) => {
      return <EkspanderbartpanelBase
        className='mb-3'
        key={index}
        heading={<BUCHeader t={t} buc={buc} locale={locale} onBUCEdit={onBUCEdit} />}
        onClick={() => onExpandBUCClick(buc)}>
        <SEDHeader t={t} />
        {seds[buc.type] ? seds[buc.type].map((sed, index) => (
          <SEDRow t={t} key={index} sed={sed} border />
        )) : null}
      </EkspanderbartpanelBase>
    }) : <BUCEmpty t={t} getBucList={getBucList} /> }
  </React.Fragment>
}

export default BUCList
