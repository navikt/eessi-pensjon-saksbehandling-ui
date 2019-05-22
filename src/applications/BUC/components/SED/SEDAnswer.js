import React, {useState} from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress, Normaltekst } from 'components/ui/Nav'
import SEDStart from '../../steps/SEDStart'
import _ from 'lodash'

const SEDAnswer = (props) => {

  const { t, buc, className, locale } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-sedanswer', className)}
    heading={<Ingress className='a-buc-c-sedanswer-header'>{t('buc:form-answerSED')}</Ingress>
    }>
      <SEDStart {...props} layout='column'/>
    </EkspanderbartpanelBase>
}

export default SEDAnswer
