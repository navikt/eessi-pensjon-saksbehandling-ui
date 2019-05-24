import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress } from 'components/ui/Nav'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'

const BUCTags = (props) => {

  const { t, buc, className } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-buctags', className)}
    id='a-buc-c-buctags__panel-id'
    heading={<Ingress
      className='a-buc-c-buctags__title'>
        {t('buc:form-BUCtags')}
      </Ingress>
    }>
    {buc.merknader.map(merknad => {
      return <SEDStatus className='a-buc-c-buctags__tag'>{t(merknad)}</SEDStatus>
    })}
  </EkspanderbartpanelBase>
}

BUCTags.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  className: PT.string
}

export default BUCTags
