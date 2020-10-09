import classNames from 'classnames'
import { Labels } from 'declarations/app.d'
import EtikettBase from 'nav-frontend-etiketter'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

export interface SEDStatusProps {
  className ?: string
  highContrast: boolean
  status: string
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

export type StatusType = 'suksess' | 'info' | 'advarsel' | 'fokus'

export const Etikett = styled(EtikettBase)`
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  text-transform: capitalize;
  font-size: 12px;
  min-width: 70px;
  color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.black : theme.navMorkGra};
  font-weight: ${({ theme }) => theme.type === 'themeHighContrast' ? 'bold' : 'normal'};
  &.received {
    background-color: ${({ theme }) => theme[themeKeys.NAVBLALIGHTEN60]} !important;
  }
  &.active {
    background-color: ${({ theme }) => theme[themeKeys.NAVLILLALIGHTEN60]} !important;
    border-color: ${({ theme }) => theme[themeKeys.NAVLILLA]} !important;
  }
  &.first_sent,
  &.first_received,
  &.first_cancelled {
    background-color:  ${({ theme }) => theme[themeKeys.NAVGRA40]} !important;
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
  highContrast: PT.bool.isRequired,
  status: PT.string.isRequired
}

export default SEDStatus
