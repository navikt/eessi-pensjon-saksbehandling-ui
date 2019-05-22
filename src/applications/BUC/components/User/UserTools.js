import React, {useState} from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress } from 'components/ui/Nav'
import _ from 'lodash'

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
