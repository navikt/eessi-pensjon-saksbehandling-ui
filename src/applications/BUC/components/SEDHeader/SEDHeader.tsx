import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import FilledPaperClipIcon from 'assets/icons/filled-version-paperclip-2'
import { slideInFromLeft } from 'components/keyframes'
import { HighContrastFlatknapp, HighContrastPanel, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { Buc, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const SEDActionsDiv = styled.div`
  flex: 2;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const SEDAttachmentsDiv = styled.div`
`
const SEDHeaderContent = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`
export const SEDHeaderPanel = styled(HighContrastPanel)`
  width: 100%;
  padding: 0rem;
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  border-bottom-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-bottom-color: ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
  border-bottom-style: solid;
`
const SEDInstitutionsDiv = styled.div`
  flex: 3;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`
const SEDNameDiv = styled.div`
  display: flex;
  flex: 4;
  width: 100%;
  flex-direction: column;
  justify-content: center;
`
const SEDStatusDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
`
const SEDStatusItemDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
`
const SEDVersion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export interface SEDHeaderProps {
  buc: Buc
  className ?: string
  followUpSeds: Seds
  onSEDNew: (buc: Buc, sed: Sed) => void
  sed: Sed
  style?: React.CSSProperties
}

export interface SEDHeaderSelector {
  highContrast: boolean
  locale: AllowedLocaleString
}

const mapState = (state: State): SEDHeaderSelector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale
})

const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc, className, followUpSeds, onSEDNew, sed, style
}: SEDHeaderProps): JSX.Element => {
  const { highContrast, locale }: SEDHeaderSelector = useSelector<State, SEDHeaderSelector>(mapState)
  const { t } = useTranslation()

  const institutionList: Institutions = sed.participants ? sed.participants
    .filter((participant) => (
      (sed.status === 'received') ? participant.role === 'Sender'
        : (sed.status !== 'draft') ? participant.role !== 'Sender'
          : participant.organisation.countryCode === 'NO'
    ))
    .map((participant: Participant) => ({
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    })) : []

  const sedLabel: string = getBucTypeLabel({
    locale: locale,
    t: t,
    type: sed.type
  })

  const onReplySed = (e: React.MouseEvent<HTMLButtonElement>) => {
    buttonLogger(e)
    onSEDNew(buc, sed)
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDHeaderPanel
        style={style}
        className={className}
      >
        <SEDHeaderContent>
          <SEDNameDiv>
            <Element
              data-test-id='a-buc-c-sedheader__name-id'
            >
              {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
            </Element>
          </SEDNameDiv>
          <SEDStatusDiv>
            <SEDStatusItemDiv>
              <Tooltip
                placement='top' trigger={[sed.version !== '1' ? 'hover' : 'none']} overlay={(
                  <Normaltekst>
                    {t('ui:firstVersion')}
                    {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                  </Normaltekst>
                )}
              >
                <SEDStatus
                  data-test-id='a-buc-c-sedheader__status-id'
                  highContrast={highContrast}
                  status={sed.status}
                />
              </Tooltip>
              <HorizontalSeparatorDiv date-size='0.5' />
              <SEDVersion>
                <Normaltekst
                  data-test-id='a-buc-c-sedheader__version-date-id'
                >
                  {sed.lastUpdate && moment(sed.lastUpdate).format('DD.MM.YYYY')}
                </Normaltekst>
                {sed.version && (
                  <Normaltekst
                    data-test-id='a-buc-c-sedheader__version-id'
                  >
                    {t('ui:version')}{': '}{sed.version || '-'}
                  </Normaltekst>
                )}
              </SEDVersion>
            </SEDStatusItemDiv>
          </SEDStatusDiv>
          <SEDInstitutionsDiv>
            <InstitutionList
              data-test-id='a-buc-c-sedheader__institutions-id'
              locale={locale}
              type='separated'
              institutions={institutionList}
            />
          </SEDInstitutionsDiv>
          <SEDActionsDiv
            data-test-id='a-buc-c-sedheader__actions-id'
          >
            {!_.isEmpty(sed.attachments) && (
              <Tooltip
                placement='top' trigger={['hover']} overlay={(
                  <span>
                    {t('buc:form-youHaveXAttachmentsInSed',
                      { attachments: sed.attachments.length })}
                  </span>
                )}
              >
                <SEDAttachmentsDiv
                  data-test-id='a-buc-c-sedheader__actions-attachments-id'
                >
                  <FilledPaperClipIcon />
                </SEDAttachmentsDiv>
              </Tooltip>
            )}
            {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
              <HighContrastFlatknapp
                mini
                data-amplitude='buc.list.besvarSed'
                data-test-id='a-buc-c-sedheader__answer-button-id'
                disabled={buc.readOnly === true}
                onClick={onReplySed}
              >
                {t('buc:form-answerSED')}
              </HighContrastFlatknapp>
            )}
          </SEDActionsDiv>
        </SEDHeaderContent>
      </SEDHeaderPanel>
    </ThemeProvider>
  )
}

SEDHeader.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  followUpSeds: SedsPropType.isRequired,
  onSEDNew: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object
}

export default SEDHeader
