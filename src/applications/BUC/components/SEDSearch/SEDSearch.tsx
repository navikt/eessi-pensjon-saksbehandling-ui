import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { standardLogger } from 'metrics/loggers'
import Panel from 'nav-frontend-paneler'
import { Input } from 'nav-frontend-skjema'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

export interface SEDSearchProps {
  className ?: string
  highContrast: boolean
  onSearch: (e: string) => void
  onStatusSearch: (sl: StatusList) => void
  value: string | undefined
}

export type StatusList = Array<{label: string, value: string}>

const SEDSearchPanel = styled(Panel)`
  display: flex !important;
  align-items: flex-start;
  padding: 0.5rem;
  border: 1px solid ${({theme}): any => theme['main-disabled-color']};
  background: ${({theme}: any) => theme['main-background-color']};
  .ekspanderbartPanel__hode {
    padding: 0.25rem;
  }
`
const PaddedDiv = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  width: 50%;
`
const SearchInput = styled(Input)`
  margin-right: 0.5rem;
  margin-bottom: 0.25rem !important;
  margin-left: 0.25rem;
  .skjemaelement__label {
    display: none;
  }
  .skjemaelement__input {
    background: ${({theme}: any) => theme['main-background-color']};
  }
`
const SearchSelect = styled(MultipleSelect)`
  .skjemaelement__label {
    margin-bottom: 0px !important;
  }
`

const SEDSearch: React.FC<SEDSearchProps> = ({
  className, highContrast, onSearch, onStatusSearch, value
}: SEDSearchProps): JSX.Element => {
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
    <ThemeProvider theme={highContrast ? themeHighContrast: theme}>
      <SEDSearchPanel
        data-testId='a-buc-c-sedsearch__panel-id'
        className={className}
      >
        <PaddedDiv>
          <SearchInput
            data-testId='a-buc-c-sedsearch__query-input-id'
            label=''
            bredde='fullbredde'
            value={_query || ''}
            onChange={onQueryChange}
            placeholder={t('buc:form-filterSED')}
          />
        </PaddedDiv>
        <PaddedDiv>
          <SearchSelect
            ariaLabel={t('buc:form-searchForStatus')}
            label=''
            data-testId='a-buc-c-sedsearch__status-select-id'
            placeholder={t('buc:form-searchForStatus')}
            values={_status}
            hideSelectedOptions={false}
            onSelect={onStatusChange}
            options={availableStatuses.sort((a, b) => a.label.localeCompare(b.label))}
          />
        </PaddedDiv>
      </SEDSearchPanel>
    </ThemeProvider>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  onSearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  value: PT.string
}

export default SEDSearch
