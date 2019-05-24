import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress } from 'components/ui/Nav'
import SEDStart from '../../steps/SEDStart'

const SEDTools = (props) => {

  const { t, className } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-sedtools', className)}
    id='a-buc-c-sedtools__panel-id'
    heading={<Ingress
      className='a-buc-c-sedtools__header'>
        {t('buc:form-answerSED')}
      </Ingress>
    }>
    <SEDStart {...props} layout='column'/>
  </EkspanderbartpanelBase>
}

SEDTools.propTypes = {
  className: PT.string,
  t: PT.func.isRequired
}

export default SEDTools
