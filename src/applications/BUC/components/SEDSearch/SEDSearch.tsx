import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { TextField, Panel } from '@navikt/ds-react'
import { Option } from 'declarations/app'
import { standardLogger } from 'metrics/loggers'
import PT from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const SEDSearchPanel = styled(Panel)`
  display: flex !important;
  align-items: flex-start;
  padding: 0.5rem;
  .ekspanderbartPanel__hode {
    padding: 0.25rem;
  }
`
const PaddedDiv = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  width: 50%;
`
const SearchInput = styled(TextField)`
  margin-right: 0.5rem;
  margin-bottom: 0.25rem !important;
  margin-left: 0.25rem;
  .navds-text-field__label navds-label {
    display: none;
  }
`

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
      standardLogger('buc.edit.filter.text.input')
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
      standardLogger('buc.edit.filter.status.select')
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

    <SEDSearchPanel
      border
      data-test-id='a-buc-c-sedsearch__panel-id'
      className={className}
    >
      <PaddedDiv>
        <SearchInput
          data-test-id='a-buc-c-sedsearch__query-input-id'
          id='a-buc-c-sedsearch__query-input-id'
          onChange={onQueryChange}
          label={t('buc:form-filterSED')}
          value={_query || ''}
        />
      </PaddedDiv>
      <PaddedDiv>
        <MultipleSelect<Option>
          ariaLabel={t('buc:form-searchForStatus')}
          className='a-buc-c-sedsearch'
          data-test-id='a-buc-c-sedsearch__status-select-id'
          id='a-buc-c-sedsearch__status-select-id'
          hideSelectedOptions={false}
          onSelect={onStatusChange}
          options={availableStatuses.sort((a, b) => a.label.localeCompare(b.label))}
          label={t('buc:form-searchForStatus')}
          values={_status}
        />
      </PaddedDiv>
    </SEDSearchPanel>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  onSearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  value: PT.string
}

export default SEDSearch
