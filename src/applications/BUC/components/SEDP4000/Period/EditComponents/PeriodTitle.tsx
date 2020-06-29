
import React from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Undertittel } from 'nav-frontend-typografi'

export interface PeriodTitleProps {
  mode: string;
}

const PeriodTitle: React.FC<PeriodTitleProps> = ({ mode }: PeriodTitleProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>
      {t('buc:p4000-title-' + mode)}
    </Undertittel>
  )
}

PeriodTitle.propTypes = {
  mode: PT.string.isRequired
}

export default PeriodTitle
