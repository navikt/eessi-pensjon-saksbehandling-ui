import { JoarkFile } from 'applications/BUC/declarations/joark'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { T } from 'types.d'
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
          id: 'bucket',
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
  attachments: PT.object,
  t: PT.func.isRequired
}

export default SEDAttachmentsTable
