import { JoarkFile } from 'applications/BUC/declarations/joark'
import { Nav, TableSorter } from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { T } from 'types'
import './SEDAttachmentsTable.css'

export interface SEDAttachmentsTableProps {
  attachments: {[namespace: string]: Array<JoarkFile>};
  t: T;
}

export interface SEDAttachmentsTableRow {
  key: string;
  bucket: string;
  title: string;
}

const SEDAttachmentsTable = ({ attachments = {}, t }: SEDAttachmentsTableProps) => {
  const items: Array<SEDAttachmentsTableRow> = []

  Object.keys(attachments).forEach((key, index1) => {
    attachments[key].forEach((att, index2) => {
      items.push({
        key: index1 + '_' + index2,
        bucket: key,
        title: att.tittel +
          (att.variant ? ' + ' + att.variant.variantformat + ' (' + att.variant.filnavn + ')' : '')
      })
    })
  })

  if (_.isEmpty(items)) {
    return <Nav.Normaltekst>{t('buc:form-noAttachmentsYet')}</Nav.Normaltekst>
  }

  return (
    <TableSorter
      className='a-buc-c-sedattachmentstable'
      items={items}
      sortable={false}
      searchable={false}
      selectable={false}
      columns={[
        {
          id: 'bucket',
          label: t('ui:type'),
          type: 'string',
          renderCell: (item: any, value: any) => <Nav.EtikettLiten>{value}</Nav.EtikettLiten>
        }, {
          id: 'title', label: t('ui:title'), type: 'string'
        }, {
          id: 'buttons',
          label: '',
          type: 'object',
          renderCell: (item: any, value: any) => {
            return <div />
          }
        }
      ]}
    />
  )
}

SEDAttachmentsTable.propTypes = {
  attachments: PT.object,
  t: PT.func.isRequired
}

export default SEDAttachmentsTable
