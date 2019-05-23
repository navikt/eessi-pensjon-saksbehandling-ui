import React from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress } from 'components/ui/Nav'
import SEDStart from '../../steps/SEDStart'

const SEDAnswer = (props) => {
  const { t, className } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-sedanswer', className)}
    heading={<Ingress className='a-buc-c-sedanswer-header'>{t('buc:form-answerSED')}</Ingress>
    }>
    <SEDStart {...props} layout='column' />
  </EkspanderbartpanelBase>
}

export default SEDAnswer
