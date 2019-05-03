import React, { useState } from 'react'

import BUCHeader from '../BUCHeader/BUCHeader'
import SedHeader from '../SED/SedHeader'
import SedLabel from '../SED/SedLabel'
import { EkspanderbartpanelBase } from '../../../components/ui/Nav'

import * as actions from '../../../actions/buc'

const BUCPanel = (props) => {
  const [seds, setSeds] = useState(null)

  const onClick = async (props) => {
    if (seds === null) {
      const _seds = await actions.fetchSedListForBuc('buc')
      setSeds(_seds)
    }
  }

  return <EkspanderbartpanelBase
    className='mb-3'
    ariaTittel='foo'
    heading={<BUCHeader t={props.t} {...props.buc} />}
    onClick={onClick}>
    <SedHeader t={props.t} />
    {seds ? seds.map((sed, index) => (
      <SedLabel t={props.t} key={index} sed={sed} />
    )) : null}
  </EkspanderbartpanelBase>
}

export default BUCPanel
