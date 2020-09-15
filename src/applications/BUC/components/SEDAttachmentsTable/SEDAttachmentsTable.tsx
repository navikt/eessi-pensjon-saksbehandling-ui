import Trashcan from 'assets/icons/Trashcan'
import { HighContrastKnapp } from 'components/StyledComponents'
import { AttachedFiles, BUCAttachment } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
import _ from 'lodash'
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TableSorter, { Item } from 'tabell'

export interface SEDAttachmentsTableProps {
  attachments: AttachedFiles
  highContrast: boolean,
  onAttachmentsChanged ?: (files: any) => void
}

export interface SEDAttachmentsTableRow<T> extends Item {
  value: T
  namespace: string
  title: string
}

export type SEDAttachmentsTableRows = Array<SEDAttachmentsTableRow<JoarkFile | BUCAttachment>>

const SEDAttachmentsTable: React.FC<SEDAttachmentsTableProps> = ({
  attachments = {}, highContrast = false, onAttachmentsChanged
}: SEDAttachmentsTableProps): JSX.Element => {
  const items: SEDAttachmentsTableRows = []
  const { t } = useTranslation()
  Object.keys(attachments).forEach((namespace, index1) => {
    attachments[namespace].forEach((att: JoarkFile | BUCAttachment, index2: number) => {
      items.push({
        key: (att as JoarkFile).dokumentInfoId ? 'id-' + (att as JoarkFile).dokumentInfoId : 'id-' + index1 + '_' + index2,
        value: att,
        namespace: namespace,
        title: (att as JoarkFile).title || (att as BUCAttachment).name +
          ((att as JoarkFile).variant ? ' + ' +
            (att as JoarkFile).variant!.variantformat +
            ' (' + (att as JoarkFile).variant!.filnavn + ')' : '')
      })
    })
  })

  const handleDelete = (itemToDelete: SEDAttachmentsTableRow<JoarkFile>, contextAttachments: AttachedFiles) => {
    const newJoarkAttachments: JoarkFiles = _.reject(contextAttachments.joark as JoarkFiles, (att: JoarkFile) => {
      return itemToDelete.value.dokumentInfoId === att.dokumentInfoId
    })
    if (onAttachmentsChanged) {
      onAttachmentsChanged({
        ...contextAttachments,
        joark: newJoarkAttachments
      })
    }
  }

  if (_.isEmpty(items)) {
    return (
      <Normaltekst>
        {t('buc:form-noAttachmentsYet')}
      </Normaltekst>
    )
  }

  return (
    <TableSorter
      highContrast={highContrast}
      items={items}
      compact
      sortable={false}
      searchable={false}
      selectable={false}
      context={{ attachments: attachments }}
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
          renderCell: (item: any, value: any, context: any) => (
            <>
              {item.namespace === 'joark' ? (
                <HighContrastKnapp
                  kompakt
                  mini
                  onClick={(e: any) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete(item, context.attachments)
                  }}
                >
                  <Trashcan />
                </HighContrastKnapp>
              ) : <div />}
            </>
          )
        }
      ]}
    />
  )
}

SEDAttachmentsTable.propTypes = {
  attachments: AttachedFilesPropType.isRequired
}

export default SEDAttachmentsTable
