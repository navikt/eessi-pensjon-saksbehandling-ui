import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Nav, TableSorter } from 'eessi-pensjon-ui'
import './SEDAttachmentsTable.css'

const SEDAttachmentsTable = ({ attachments = {}, t }) => {
  const items = []

  Object.keys(attachments).forEach((key, index1) => {
    attachments[key].forEach((att, index2) => {
      items.push({
        key: index1 + '_' + index2,
        bucket: key,
        title: (att.tittel || att.name) +
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
          renderCell: (item, value) => <Nav.EtikettLiten>{value}</Nav.EtikettLiten>
        }, {
          id: 'title', label: t('ui:title'), type: 'string'
        }, {
          id: 'buttons',
          label: '',
          type: 'object',
          renderCell: (item, value) => {
            return <div />
          }
        }
      ]}
    />
  )
}

SEDAttachmentsTable.propTypes = {
  attachments: PT.object
}

export default SEDAttachmentsTable
