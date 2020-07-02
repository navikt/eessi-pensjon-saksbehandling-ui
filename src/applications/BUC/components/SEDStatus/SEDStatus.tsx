import classNames from 'classnames'
import { Labels } from 'declarations/types'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EtikettBase from 'nav-frontend-etiketter'
import styled, { ThemeProvider } from 'styled-components'

export interface SEDStatusProps {
  className ?: string;
  highContrast: boolean;
  status: string;
}

const statusList: Labels = {
  new: 'fokus',
  sent: 'suksess',
  received: 'info',
  cancelled: 'advarsel',
  active: 'advarsel',
  unknown: 'info',
  first_new: 'advarsel',
  first_sent: 'advarsel',
  first_received: 'advarsel'
}

type StatusType = 'suksess' | 'info' | 'advarsel' | 'fokus'

const Etikett = styled(EtikettBase)`
  border-radius: 4px;
  text-transform: capitalize;
  font-size: 12px;
  min-width: 70px;
  color: ${({ theme }: any) => theme['main-font-color']};
  font-weight: ${({ theme }: any) => theme.type === 'themeHighContrast' ? 'bold' : 'normal'};
  &.received {
    background-color: @navBlaLighten60 !important;
  }
  &.active {
    background-color: @navLillaLighten60 !important;
  }
  &.first_sent,
  &.first_received,
  &.first_cancelled {
    background-color: @navGra40 !important;
  }
`

const SEDStatus: React.FC<SEDStatusProps> = ({
  className, highContrast, status
}: SEDStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const tagType: StatusType =
    Object.prototype.hasOwnProperty.call(statusList, status) ? (statusList[status] as StatusType)! : (statusList.unknown as StatusType)!
  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <Etikett className={classNames(status, className)} type={tagType}>
        {t('buc:status-' + status)}
      </Etikett>
    </ThemeProvider>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired
}

export default SEDStatus
