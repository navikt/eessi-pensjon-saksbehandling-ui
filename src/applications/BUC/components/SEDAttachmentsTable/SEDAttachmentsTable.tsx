import { AttachedFiles, BUCAttachment } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFile } from 'declarations/joark'
import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React from 'react'
import './SEDAttachmentsTable.css'

export interface SEDAttachmentsTableProps {
  attachments: AttachedFiles;
  t: T;
}

export interface SEDAttachmentsTableRow {
  key: string;
  namespace: string;
  title: string;
}

export type SEDAttachmentsTableRows = Array<SEDAttachmentsTableRow>

const SEDAttachmentsTable: React.FC<SEDAttachmentsTableProps> = ({
  attachments = {}, t
}: SEDAttachmentsTableProps): JSX.Element => {
  const items: SEDAttachmentsTableRows = []

  Object.keys(attachments).forEach((namespace, index1) => {
    attachments[namespace].forEach((att: JoarkFile | BUCAttachment, index2: number) => {
      items.push({
        key: index1 + '_' + index2,
        namespace: namespace,
        title: (att as JoarkFile).tittel +
          ((att as JoarkFile).variant ? ' + ' + (att as JoarkFile).variant.variantformat + ' (' + (att as JoarkFile).variant.filnavn + ')' : '')
      })
    })
  })

  if (_.isEmpty(items)) {
    return <Ui.Nav.Normaltekst>{t('buc:form-noAttachmentsYet')}</Ui.Nav.Normaltekst>
  }

  return (
    <Ui.TableSorter
      className='a-buc-c-sedattachmentstable'
      items={items}
      sortable={false}
      searchable={false}
      selectable={false}
      columns={[
        {
          id: 'namespace',
          label: t('ui:type'),
          type: 'string',
          renderCell: (item: any, value: any) => <Ui.Nav.EtikettLiten>{value}</Ui.Nav.EtikettLiten>
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
  )
}

SEDAttachmentsTable.propTypes = {
  attachments: AttachedFilesPropType.isRequired,
  t: TPropType.isRequired
}

export default SEDAttachmentsTable
