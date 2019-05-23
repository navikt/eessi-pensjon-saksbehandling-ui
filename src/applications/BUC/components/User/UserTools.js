import React from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress } from 'components/ui/Nav'

const UserTools = (props) => {
  const { t, className } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-usertools', className)}
    heading={<Ingress className='a-buc-c-usertools-buctags'>{t('buc:form-notifyUser')}</Ingress>
    }>
      Hello
  </EkspanderbartpanelBase>
}

export default UserTools
