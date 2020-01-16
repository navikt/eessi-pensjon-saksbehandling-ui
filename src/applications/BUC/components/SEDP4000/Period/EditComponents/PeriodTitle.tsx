import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

export interface PeriodTitleProps {
  mode: string;
  t: T
}

const PeriodTitle: React.FC<PeriodTitleProps> = ({ mode, t }: PeriodTitleProps): JSX.Element => (
  <Ui.Nav.Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>
    {t('buc:p4000-title-' + mode)}
  </Ui.Nav.Undertittel>
)

PeriodTitle.propTypes = {
  mode: PT.string.isRequired,
  t: TPropType.isRequired
}

export default PeriodTitle
