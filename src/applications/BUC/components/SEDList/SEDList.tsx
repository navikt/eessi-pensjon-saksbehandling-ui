import { sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Buc, InstitutionNames, Sed, Seds } from 'declarations/buc'
import { BucPropType, InstitutionNamesPropType, SedsPropType } from 'declarations/buc.pt'
import { AllowedLocaleStringPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { AllowedLocaleString, T } from 'declarations/types'
import './SEDList.css'

export interface SEDListProps {
  buc: Buc;
  institutionNames: InstitutionNames;
  locale: AllowedLocaleString;
  maxSeds ?: number;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  seds: Seds;
  t: T;
}

const SEDList: React.FC<SEDListProps> = ({
  buc, institutionNames, locale, maxSeds = 5, onSEDNew, seds, t
}: SEDListProps): JSX.Element => (
  <div className='a-buc-c-sedlist'>
    {seds ? seds
      .filter(sedFilter)
      .sort(sedSorter as (a: Sed, b: Sed) => number)
      .slice(0, maxSeds).map((sed, index) => {
        return (
          <SEDHeader
            style={{ animationDelay: (0.2 * index) + 's' }}
            t={t}
            key={index}
            buc={buc}
            sed={sed}
            followUpSeds={seds.filter(_seds => _seds.parentDocumentId === sed.id)}
            locale={locale}
            onSEDNew={onSEDNew}
            institutionNames={institutionNames}
          />
        )
      }) : null}
    <div className='a-buc-c-sedlist__footer mt-2'>
      {!_.isEmpty(seds) && seds.filter(sedFilter).length > maxSeds
        ? <Ui.Nav.Normaltekst>{t('buc:form-lastNonEmpty5')}</Ui.Nav.Normaltekst> : null}
    </div>
  </div>
)

SEDList.propTypes = {
  buc: BucPropType.isRequired,
  institutionNames: InstitutionNamesPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  maxSeds: PT.number,
  onSEDNew: PT.func.isRequired,
  seds: SedsPropType.isRequired,
  t: TPropType.isRequired
}

export default SEDList
