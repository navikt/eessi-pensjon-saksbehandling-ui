import React, { useState } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { MultipleSelect, Nav } from 'eessi-pensjon-ui'

import './SEDSearch.css'

const SEDSearch = ({ className, onSearch, onStatusSearch, t }) => {
  const [_query, setQuery] = useState(undefined)
  const [_status, setStatus] = useState([])

  const onQueryChange = (e) => {
    if (typeof onSearch === 'function') {
      setQuery(e.target.value)
      onSearch(e.target.value)
    }
  }

  const onStatusChange = (statusList) => {
    if (typeof onStatusSearch === 'function') {
      onStatusSearch(statusList)
      setStatus(statusList)
    }
  }

  const availableStatuses = [{
    label: t('ui:new'),
    value: 'new'
  }, {
    label: t('ui:cancelled'),
    value: 'cancelled'
  }, {
    label: t('ui:received'),
    value: 'received'
  }, {
    label: t('ui:sent'),
    value: 'sent'
  }]

  return (
    <Nav.Panel
      id='a-buc-c-sedsearch__panel-id'
      className={classNames('a-buc-c-sedsearch', 'p-2', 's-border', className)}
    >
      <Nav.Input
        id='a-buc-c-sedsearch__query-input-id'
        className='a-buc-c-sedsearch__query-input pl-1 pr-1 w-50'
        label=''
        bredde='fullbredde'
        value={_query || ''}
        onChange={onQueryChange}
        placeholder={t('buc:form-filterSED')}
      />
      <MultipleSelect
        id='a-buc-c-sedsearch__status-select-id'
        className='a-buc-c-sedsearch__status-select multipleSelect pl-1 pr-1 w-50'
        placeholder={t('buc:form-searchForStatus')}
        values={_status}
        hideSelectedOptions={false}
        onSelect={onStatusChange}
        options={availableStatuses.sort((a, b) => a.label.localeCompare(b.label))}
      />
    </Nav.Panel>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  locale: PT.string.isRequired,
  onSearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  seds: PT.array,
  t: PT.func.isRequired
}

export default SEDSearch
