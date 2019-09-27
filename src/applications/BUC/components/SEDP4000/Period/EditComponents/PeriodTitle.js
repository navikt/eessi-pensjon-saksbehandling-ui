import React from 'react'
import PT from 'prop-types'
import { Nav } from 'eessi-pensjon-ui'

const PeriodTitle = ({ mode, t }) => (
  <Nav.Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>
    {t('buc:p4000-title-' + mode)}
  </Nav.Undertittel>
)

PeriodTitle.propTypes = {
  mode: PT.string.isRequired,
  t: PT.func.isRequired
}

export default PeriodTitle
