import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Systemtittel } from 'components/ui/Nav'

const UserTools = (props) => {
  const { t, className } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-usertools', className)}
    id='a-buc-c-usertools__panel-id'
    heading={<Systemtittel
      className='a-buc-c-usertools-buctags'>
      {t('buc:form-notifyUser')}
    </Systemtittel>
    }>
      Hello
  </EkspanderbartpanelBase>
}

UserTools.propTypes = {
  className: PT.string,
  t: PT.func.isRequired
}

export default UserTools
