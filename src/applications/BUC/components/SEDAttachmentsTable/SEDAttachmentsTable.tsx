import { AttachedFiles, BUCAttachment } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFile } from 'declarations/joark'
import _ from 'lodash'
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import TableSorter from 'tabell'

export interface SEDAttachmentsTableProps {
  attachments: AttachedFiles
}

export interface SEDAttachmentsTableRow {
  key: string
  namespace: string
  title: string
}

export type SEDAttachmentsTableRows = Array<SEDAttachmentsTableRow>

const SEDAttachmentsTableDiv = styled.div`
  td {
    padding: 0.5rem;
  }
`

const SEDAttachmentsTable: React.FC<SEDAttachmentsTableProps> = ({
  attachments = {}
}: SEDAttachmentsTableProps): JSX.Element => {
  const items: SEDAttachmentsTableRows = []
  const { t } = useTranslation()

  Object.keys(attachments).forEach((namespace, index1) => {
    attachments[namespace].forEach((att: JoarkFile | BUCAttachment, index2: number) => {
      items.push({
        key: index1 + '_' + index2,
        namespace: namespace,
        title: (att as JoarkFile).tittel || (att as BUCAttachment).name +
          ((att as JoarkFile).variant ? ' + ' +
            (att as JoarkFile).variant.variantformat +
            ' (' + (att as JoarkFile).variant.filnavn + ')' : '')
      })
    })
  })

  if (_.isEmpty(items)) {
    return (
      <Normaltekst>
        {t('buc:form-noAttachmentsYet')}
      </Normaltekst>
    )
  }

  return (
    <SEDAttachmentsTableDiv>
      <TableSorter
        items={items}
        sortable={false}
        searchable={false}
        selectable={false}
        columns={[
          {
            id: 'namespace',
            label: t('ui:type'),
            type: 'string',
            renderCell: (item: any, value: any) => <EtikettLiten>{value}</EtikettLiten>
          }, {
            id: 'title', label: t('ui:title'), type: 'string'
          }, {
            id: 'buttons',
            label: '',
            type: 'object',
            renderCell: () => (<div />)
          }
        ]}
      />
    </SEDAttachmentsTableDiv>
  )
}

SEDAttachmentsTable.propTypes = {
  attachments: AttachedFilesPropType.isRequired
}

export default SEDAttachmentsTable
