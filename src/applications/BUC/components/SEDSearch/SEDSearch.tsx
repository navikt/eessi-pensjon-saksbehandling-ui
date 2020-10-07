import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { HighContrastInput, HighContrastPanel } from 'components/StyledComponents'
import { standardLogger } from 'metrics/loggers'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

const SEDSearchPanel = styled(HighContrastPanel)`
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
const SearchInput = styled(HighContrastInput)`
  margin-right: 0.5rem;
  margin-bottom: 0.25rem !important;
  margin-left: 0.25rem;
  .skjemaelement__label {
    display: none;
  }
`
const SearchSelect = styled(MultipleSelect)`
  .skjemaelement__label {
    margin-bottom: 0px !important;
  }
`

export type StatusList = Array<{label: string, value: string}>

export interface SEDSearchProps {
  className ?: string
  highContrast: boolean
  onSearch: (e: string) => void
  onStatusSearch: (sl: StatusList) => void
  value: string | undefined
}

const SEDSearch: React.FC<SEDSearchProps> = ({
  className, highContrast, onSearch, onStatusSearch, value
}: SEDSearchProps): JSX.Element => {
  const [_query, setQuery] = useState<string | undefined>(value || '')
  const [_status, setStatus] = useState<StatusList>([])
  const [_timer, setTimer] = useState<number | undefined>(undefined)
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

  const onStatusChange = (statusList: StatusList) => {
    onStatusSearch(statusList)
    setStatus(statusList)
    standardLogger('buc.edit.filter.status.select')
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
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDSearchPanel
        data-test-id='a-buc-c-sedsearch__panel-id'
        className={className}
      >
        <PaddedDiv>
          <SearchInput
            bredde='fullbredde'
            data-test-id='a-buc-c-sedsearch__query-input-id'
            id='a-buc-c-sedsearch__query-input-id'
            label=''
            onChange={onQueryChange}
            placeholder={t('buc:form-filterSED')}
            value={_query || ''}
          />
        </PaddedDiv>
        <PaddedDiv>
          <SearchSelect
            ariaLabel={t('buc:form-searchForStatus')}
            data-test-id='a-buc-c-sedsearch__status-select-id'
            id='a-buc-c-sedsearch__status-select-id'
            hideSelectedOptions={false}
            highContrast={highContrast}
            label=''
            onSelect={onStatusChange}
            options={availableStatuses.sort((a, b) => a.label.localeCompare(b.label))}
            placeholder={t('buc:form-searchForStatus')}
            values={_status}
          />
        </PaddedDiv>
      </SEDSearchPanel>
    </ThemeProvider>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  highContrast: PT.bool.isRequired,
  onSearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  value: PT.string
}

export default SEDSearch
