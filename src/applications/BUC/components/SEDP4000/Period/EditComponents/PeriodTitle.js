import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

const PeriodTitle = ({ mode, t }) => (
  <Ui.Nav.Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>
    {t('buc:p4000-title-' + mode)}
  </Ui.Nav.Undertittel>
)

PeriodTitle.propTypes = {
  mode: PT.string.isRequired,
  t: PT.func.isRequired
}

export default PeriodTitle
