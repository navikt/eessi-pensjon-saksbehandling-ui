import { sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import { Buc, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedsPropType } from 'declarations/buc.pt'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const SEDFooterDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const SEDListDiv = styled.div``

export interface SEDListProps {
  buc: Buc
  maxSeds?: number
  onSEDNew: (buc: Buc, sed: Sed) => void
  seds?: Seds | null
}

const SEDList: React.FC<SEDListProps> = ({
  buc, maxSeds = 5, onSEDNew, seds
}: SEDListProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <SEDListDiv>
      {seds && seds
        .filter(sedFilter)
        .sort(sedSorter as (a: Sed, b: Sed) => number)
        .slice(0, maxSeds).map((sed, index) => {
          return (
            <SEDHeader
              buc={buc}
              followUpSeds={seds.filter(_seds => _seds.parentDocumentId === sed.id)}
              key={index}
              onSEDNew={onSEDNew}
              sed={sed}
              style={{ animationDelay: (0.2 * index) + 's' }}
            />
          )
        })}
      <VerticalSeparatorDiv />
      <SEDFooterDiv>
        {!_.isEmpty(seds) && seds!.filter(sedFilter).length > maxSeds && (
          <Normaltekst>
            {t('buc:form-lastNonEmpty5')}
          </Normaltekst>
        )}
      </SEDFooterDiv>
    </SEDListDiv>
  )
}

SEDList.propTypes = {
  buc: BucPropType.isRequired,
  maxSeds: PT.number,
  onSEDNew: PT.func.isRequired,
  seds: SedsPropType
}

export default SEDList
