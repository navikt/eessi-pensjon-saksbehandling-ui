import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import FilledPaperClipIcon from 'assets/icons/filled-version-paperclip-2'
import { HighContrastFlatknapp, HighContrastPanel, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { Buc, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Tooltip from 'rc-tooltip'
import styled, { keyframes, ThemeProvider } from 'styled-components'

export interface SEDListHeaderProps {
  buc: Buc
  className ?: string
  onSEDNew: (buc: Buc, sed: Sed) => void
  sed: Sed
  style?: React.CSSProperties
  followUpSeds: Seds
}

export interface SEDListSelector {
  highContrast: boolean
  locale: AllowedLocaleString
}

const mapState = (state: State): SEDListSelector => ({
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
const SEDListHeaderPanel = styled(HighContrastPanel)`
  width: 100%;
  padding: 0rem;
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  border: none;
`
const SEDListHeaderContent = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`
const SEDListStatusDiv = styled.div`
  display: flex;
  flex: 4;
  width: 100%;
  flex-direction: column;
  justify-content: center;
`
const SEDListStatusItemDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
`
const SEDListInstitutionsDiv = styled.div`
  flex: 3;
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: flex-start;
`
const SEDListActionsDiv = styled.div`
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
const SEDListAttachmentsDiv = styled.div``

const SEDListHeader: React.FC<SEDListHeaderProps> = ({
  buc, className, followUpSeds, onSEDNew, sed, style
}: SEDListHeaderProps): JSX.Element => {
  const { highContrast, locale }: SEDListSelector = useSelector<State, SEDListSelector>(mapState)
  const { t } = useTranslation()
  const institutionSenderList: Institutions = sed.participants ? sed.participants
    .filter((participant: Participant) => participant.role === 'Sender')
    .map((participant: Participant) => ({
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    })) : []

  const institutionReceiverList: Institutions = sed.participants ? sed.participants
    .filter((participant: Participant) => participant.role === 'Receiver')
    .map((participant: Participant) => ({
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    })) : []

  const sedLabel: string = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDListHeaderPanel
        style={style}
        className={className}
      >
        <SEDListHeaderContent>
          <SEDListStatusDiv>
            <Element>
              {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
            </Element>
            <SEDListStatusItemDiv>
              <Tooltip
                placement='top' trigger={[sed.version !== '1' ? 'hover': 'none']} overlay={(
                <Normaltekst>
                  {t('ui:firstVersion')}
                  {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                </Normaltekst>
              )}
              >
                <SEDStatus
                highContrast={highContrast}
                status={sed.status}
              />
              </Tooltip>
              <HorizontalSeparatorDiv date-size='0.5' />
              <SEDVersion>
                <Normaltekst
                  data-testid='a-buc-c-sedlistheader__lastUpdate'
                >
                  {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
                </Normaltekst>
                {sed.version && (
                  <Normaltekst
                    data-testid='a-buc-c-sedlistheader__version'
                  >
                    {t('ui:version')}{': '}{sed.version || '-'}
                  </Normaltekst>
                )}
              </SEDVersion>
            </SEDListStatusItemDiv>
          </SEDListStatusDiv>
          <SEDListInstitutionsDiv>
            <InstitutionList
              locale={locale}
              type='separated'
              institutions={institutionSenderList}
            />
          </SEDListInstitutionsDiv>
          <SEDListInstitutionsDiv>
            <InstitutionList
              locale={locale}
              type='separated'
              institutions={institutionReceiverList}
            />
          </SEDListInstitutionsDiv>
          <SEDListActionsDiv>
            {!_.isEmpty(sed.attachments) && (
              <Tooltip
                placement='top' trigger={['hover']} overlay={(
                  <span>{t('buc:form-youHaveXAttachmentsInSed',
                    { attachments: sed.attachments.length })}
                  </span>
                )}
              >
                <SEDListAttachmentsDiv
                  data-testid='a-buc-c-sedlistheader__actions-attachments'
                >
                  <FilledPaperClipIcon />
                </SEDListAttachmentsDiv>
              </Tooltip>
            )}
            {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
              <HighContrastFlatknapp
                mini
                disabled={buc.readOnly === true}
                data-amplitude='buc.edit.besvarSed'
                data-testid='a-buc-c-sedlistheader__actions-answer-button'
                onClick={(e: React.MouseEvent) => {
                  buttonLogger(e)
                  onSEDNew(buc, sed)
                }}
              >
                {t('buc:form-answerSED')}
              </HighContrastFlatknapp>
            )}
          </SEDListActionsDiv>
        </SEDListHeaderContent>
      </SEDListHeaderPanel>
    </ThemeProvider>
  )
}

SEDListHeader.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  onSEDNew: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object,
  followUpSeds: SedsPropType.isRequired
}

export default SEDListHeader
