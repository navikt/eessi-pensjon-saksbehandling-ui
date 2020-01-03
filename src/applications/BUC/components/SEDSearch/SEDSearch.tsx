import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useState } from 'react'
import { T } from 'types'
import './SEDSearch.css'

export interface SEDSearchProps {
  className ?: string;
  onSearch: Function;
  onStatusSearch: Function;
  t: T;
  value: string | undefined;
}

export type StatusList = Array<{label: string, value: string}>

const SEDSearch = ({ className, onSearch, onStatusSearch, t, value }: SEDSearchProps) => {
  const [_query, setQuery] = useState<string | undefined>(value)
  const [_status, setStatus] = useState<StatusList>([])

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onSearch === 'function') {
      setQuery(e.target.value)
      onSearch(e.target.value)
    }
  }

  const onStatusChange = (statusList: StatusList) => {
    if (typeof onStatusSearch === 'function') {
      onStatusSearch(statusList)
      setStatus(statusList)
    }
  }

  const availableStatuses: StatusList = [{
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
    <Ui.Nav.Panel
      id='a-buc-c-sedsearch__panel-id'
      className={classNames('a-buc-c-sedsearch', 'p-2', 's-border', className)}
    >
      <Ui.Nav.Input
        id='a-buc-c-sedsearch__query-input-id'
        className='a-buc-c-sedsearch__query-input pl-1 pr-1 w-50'
        label=''
        bredde='fullbredde'
        value={_query || ''}
        onChange={onQueryChange}
        placeholder={t('buc:form-filterSED')}
      />
      <Ui.MultipleSelect
        ariaLabel={t('buc:form-searchForStatus')}
        label=''
        id='a-buc-c-sedsearch__status-select-id'
        className='a-buc-c-sedsearch__status-select multipleSelect pl-1 pr-1 w-50'
        placeholder={t('buc:form-searchForStatus')}
        values={_status}
        hideSelectedOptions={false}
        onSelect={onStatusChange}
        options={availableStatuses.sort((a, b) => a.label.localeCompare(b.label))}
      />
    </Ui.Nav.Panel>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  onSearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  t: PT.func.isRequired
}

export default SEDSearch
