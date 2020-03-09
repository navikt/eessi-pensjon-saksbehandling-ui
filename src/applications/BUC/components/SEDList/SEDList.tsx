import { sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Buc, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedsPropType } from 'declarations/buc.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './SEDList.css'

export interface SEDListProps {
  buc: Buc;
  maxSeds ?: number;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  seds?: Seds | null;
}

const SEDList: React.FC<SEDListProps> = ({
  buc, maxSeds = 5, onSEDNew, seds
}: SEDListProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <div className='a-buc-c-sedlist'>
      {seds ? seds
        .filter(sedFilter)
        .sort(sedSorter as (a: Sed, b: Sed) => number)
        .slice(0, maxSeds).map((sed, index) => {
          return (
            <SEDHeader
              style={{ animationDelay: (0.2 * index) + 's' }}
              key={index}
              buc={buc}
              sed={sed}
              followUpSeds={seds.filter(_seds => _seds.parentDocumentId === sed.id)}
              onSEDNew={onSEDNew}
            />
          )
        }) : null}
      <div className='a-buc-c-sedlist__footer mt-2'>
        {!_.isEmpty(seds) && seds!.filter(sedFilter).length > maxSeds
          ? <Ui.Nav.Normaltekst>{t('buc:form-lastNonEmpty5')}</Ui.Nav.Normaltekst> : null}
      </div>
    </div>
  )
}

SEDList.propTypes = {
  buc: BucPropType.isRequired,
  maxSeds: PT.number,
  onSEDNew: PT.func.isRequired,
  seds: SedsPropType
}

export default SEDList
