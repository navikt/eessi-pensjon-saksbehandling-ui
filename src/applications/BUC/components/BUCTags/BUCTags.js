import React from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress } from 'components/ui/Nav'

const BUCTags = (props) => {
  const { t, className } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-buctags', className)}
    heading={<Ingress className='a-buc-c-sedanswer-buctags'>{t('buc:form-BUCtags')}</Ingress>
    }>
      Hello
  </EkspanderbartpanelBase>
}

export default BUCTags
