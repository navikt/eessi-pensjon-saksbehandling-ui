import classNames from 'classnames'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { standardLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SEDSearch.css'
import { Input } from 'nav-frontend-skjema'
import Panel from 'nav-frontend-paneler'

export interface SEDSearchProps {
  className ?: string;
  onSearch: (e: string) => void;
  onStatusSearch: (sl: StatusList) => void;
  value: string | undefined;
}

export type StatusList = Array<{label: string, value: string}>

const SEDSearch = ({ className, onSearch, onStatusSearch, value }: SEDSearchProps) => {
  const [_query, setQuery] = useState<string | undefined>(value || '')
  const [_status, setStatus] = useState<StatusList>([])
  const [timer, setTimer] = useState<any>()
  const { t } = useTranslation()

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onSearch === 'function') {
      setQuery(e.target.value)
      onSearch(e.target.value)

      const _timer = setTimeout(() => {
        standardLogger('buc.edit.filter.text.input')
        clearTimeout(timer)
        setTimer(undefined)
      }, 1000)
      setTimer(_timer)
    }
  }

  const onStatusChange = (statusList: StatusList) => {
    if (typeof onStatusSearch === 'function') {
      onStatusSearch(statusList)
      setStatus(statusList)
      standardLogger('buc.edit.filter.status.select')
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
    <Panel
      id='a-buc-c-sedsearch__panel-id'
      className={classNames('a-buc-c-sedsearch', 'p-2', 's-border', className)}
    >
      <Input
        id='a-buc-c-sedsearch__query-input-id'
        className='a-buc-c-sedsearch__query-input pl-1 pr-1 w-50'
        label=''
        bredde='fullbredde'
        value={_query || ''}
        onChange={onQueryChange}
        placeholder={t('buc:form-filterSED')}
      />
      <MultipleSelect
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
    </Panel>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  onSearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  value: PT.string
}

export default SEDSearch
