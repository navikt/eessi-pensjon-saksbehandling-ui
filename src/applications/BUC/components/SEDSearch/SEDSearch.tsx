import MultipleSelect from 'src/components/MultipleSelect/MultipleSelect'
import {TextField, Box} from '@navikt/ds-react'
import { Option } from 'src/declarations/app'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SEDSearch.module.css'
import classNames from "classnames";

export interface SEDSearchProps {
  className ?: string
  onSearch: (e: string) => void
  onStatusSearch: (sl: Array<Option>) => void
  value: string | undefined
}

const SEDSearch: React.FC<SEDSearchProps> = ({
  className, onSearch, onStatusSearch, value
}: SEDSearchProps): JSX.Element => {
  const [_query, setQuery] = useState<string | undefined>(value || '')
  const [_status, setStatus] = useState<Array<Option>>([])
  const [_timer, setTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined)
  const { t } = useTranslation()

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value)

    const timer = setTimeout(() => {
      if (_timer) {
        clearTimeout(_timer)
      }
      setTimer(undefined)
    }, 1000)
    setTimer(timer)
  }

  const onStatusChange = (statusList: unknown) => {
    if (statusList) {
      onStatusSearch(statusList as Array<Option>)
      setStatus(statusList as Array<Option>)
    }
  }

  const availableStatuses: Array<Option> = [{
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
    <Box
      data-testid='a_buc_c_sedsearch--panel-id'
      className={classNames(className, styles.SEDSearchPanel)}
      padding="4"
      borderWidth="1"
      borderColor="border-default"
      borderRadius="small"
    >
      <div className={styles.paddedDiv}>
        <TextField
          className={styles.searchInput}
          data-testid='a_buc_c_sedsearch--query-input-id'
          id='a_buc_c_sedsearch--query-input-id'
          onChange={onQueryChange}
          label={t('buc:form-filterSED')}
          value={_query || ''}
        />
      </div>
      <div className={styles.paddedDiv}>
        <MultipleSelect<Option>
          ariaLabel={t('buc:form-searchForStatus')}
          className='a_buc_c_sedsearch'
          data-testid='a_buc_c_sedsearch--status-select-id'
          id='a_buc_c_sedsearch--status-select-id'
          hideSelectedOptions={false}
          onSelect={onStatusChange}
          options={availableStatuses.sort((a, b) => a.label.localeCompare(b.label))}
          label={t('buc:form-searchForStatus')}
          values={_status}
        />
      </div>
    </Box>
  )
}

export default SEDSearch
