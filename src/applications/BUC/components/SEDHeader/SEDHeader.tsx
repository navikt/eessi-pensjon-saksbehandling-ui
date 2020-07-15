import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import FilledPaperClipIcon from 'assets/icons/filled-version-paperclip-2'
import { HighContrastFlatknapp, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { Buc, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import Panel from 'nav-frontend-paneler'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Tooltip from 'rc-tooltip'
import styled, { keyframes, ThemeProvider } from 'styled-components'

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

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
const SEDHeaderPanel = styled(Panel)`
  width: 100%;
  padding: 0rem;
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  border-bottom: ${({ theme }: any) => theme.type === 'themeHighContrast'
  ? '2px solid $theme[\'main-disabled-color\']'
  : '1px solid $theme[\'navGra60\']'};
`
const SEDHeaderContent = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
const SEDInstitutionsDiv = styled.div`
  flex: 3;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  & > div {
   margin-bottom: 0.35rem;
  }
`
const SEDActionsDiv = styled.div`
  flex: 2;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const SEDVersion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const SEDAttachmentsDiv = styled.div``

const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc, className, followUpSeds, onSEDNew, sed, style
}: SEDHeaderProps): JSX.Element => {
  const institutionList: Institutions = sed.participants
    ? sed.participants.filter((participant) => {
      return (sed.status === 'received') ? participant.role === 'Sender'
        : (sed.status !== 'draft') ? participant.role !== 'Sender'
          : participant.organisation.countryCode === 'NO'
    })
      .map((participant: Participant) => ({
        country: participant.organisation.countryCode,
        institution: participant.organisation.name
      })) : []
  const { highContrast, locale }: SEDHeaderSelector = useSelector<State, SEDHeaderSelector>(mapState)
  const { t } = useTranslation()
  const sedLabel: string = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDHeaderPanel
        style={style}
        className={className}
      >
        <SEDHeaderContent>
          <SEDNameDiv>
            <Element>
              {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
            </Element>
          </SEDNameDiv>
          <SEDStatusDiv>
            <SEDStatusItemDiv>
              <Tooltip
                placement='top' trigger={[sed.version !== '1' ? 'hover': 'none']} overlay={(
                <Normaltekst>
                  {t('ui:firstVersion')}
                  {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                </Normaltekst>
              )}
              >
                <SEDStatus highContrast={highContrast} status={sed.status} />
              </Tooltip>
              <HorizontalSeparatorDiv date-size='0.5' />
                <SEDVersion>
                  <Normaltekst
                    data-testid='a-buc-c-sedheader__lastUpdate'
                  >
                    {sed.lastUpdate && moment(sed.lastUpdate).format('DD.MM.YYYY')}
                  </Normaltekst>
                  {sed.version && (
                    <Normaltekst
                      data-testid='a-buc-c-sedheader__version'
                    >
                      {t('ui:version')}{': '}{sed.version || '-'}
                    </Normaltekst>
                  )}
                </SEDVersion>
            </SEDStatusItemDiv>
          </SEDStatusDiv>
          <SEDInstitutionsDiv>
            <InstitutionList
              locale={locale}
              type='separated'
              institutions={institutionList}
            />
          </SEDInstitutionsDiv>
          <SEDActionsDiv>
            {!_.isEmpty(sed.attachments) && (
              <Tooltip
                placement='top' trigger={['hover']} overlay={(
                  <span>{t('buc:form-youHaveXAttachmentsInSed',
                    { attachments: sed.attachments.length })}
                  </span>
                )}
              >
                <SEDAttachmentsDiv
                  data-testid='a-buc-c-sedheader__actions-attachments'
                >
                  <FilledPaperClipIcon />
                </SEDAttachmentsDiv>
              </Tooltip>
            )}
            {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
              <HighContrastFlatknapp
                mini
                data-amplitude='buc.list.besvarSed'
                data-testid='a-buc-c-sedheader__actions-answer-button'
                disabled={buc.readOnly === true}
                onClick={(e: React.MouseEvent) => {
                  buttonLogger(e)
                  onSEDNew(buc, sed)
                }}
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
