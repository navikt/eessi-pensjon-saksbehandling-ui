import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import FilledPaperClipIcon from 'assets/icons/filled-version-paperclip-2'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import { Buc, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import { Flatknapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

export interface SEDListHeaderProps {
  buc: Buc;
  className ?: string;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style?: React.CSSProperties;
  followUpSeds: Seds;
}

export interface SEDListSelector {
  highContrast: boolean
  locale: AllowedLocaleString
}

const mapState = (state: State): SEDListSelector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale
})

const SEDListHeaderPanel = styled(Panel)`
  width: 100%;
  padding: 0rem;
  transform: translateX(-20px);
  opacity: 0;
  animation: slideInFromLeft 0.2s forwards;
  border-bottom: ${({theme}: any) => theme.type === 'themeHighContrast' ?
  `2px solid $theme['main-disabled-color']` :
  `1px solid $theme['navGra60']`};
`
const SEDListHeaderContent = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`
const SEDListNameDiv = styled.div`
  display: flex;
  flex: 4;
  flex-direction: column;
  justify-content: center;
`
const SEDListStatusDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
`
const SEDListStatusItemDiv= styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
`
const SEDListInstitutionsDiv = styled.div`
  flex: 3;
  flex-direction: row;
  display: flex;
  align-items: center;
`
const SEDListActionsDiv = styled.div`
  flex: 2;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
    <ThemeProvider theme={highContrast ? themeHighContrast: theme}>
      <SEDListHeaderPanel
        style={style}
        className={className}
      >
        <SEDListHeaderContent>
          <SEDListNameDiv>
            <Element>
             {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
            </Element>
          </SEDListNameDiv>
          <SEDListStatusDiv>
            <SEDListStatusItemDiv>
              <SEDStatus
                highContrast={highContrast}
                status={sed.status}
              />
              <HorizontalSeparatorDiv date-size='0.5'/>
              <Normaltekst
                 data-testId='a-buc-c-sedlistheader__lastUpdate'
                 data-tip={t('ui:lastUpdate')}
              >
                  {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
              </Normaltekst>
                {sed.version && (
                  <Normaltekst
                    data-testId='a-buc-c-sedlistheader__version'
                  >
                    {t('ui:version')}{': '}{sed.version || '-'}
                  </Normaltekst>
                )}
            </SEDListStatusItemDiv>
            {sed.version !== '1' && (
              <SEDListStatusItemDiv>
                <SEDStatus highContrast={highContrast} status={'first_' + sed.status} />
                <HorizontalSeparatorDiv date-size='0.5'/>
                <Normaltekst
                  data-testId='a-buc-c-sedlistheader__firstSend'
                  data-tip={t('ui:status-first')}
                >
                  {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                </Normaltekst>
              </SEDListStatusItemDiv>
            )}
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
              <SEDListAttachmentsDiv
                data-test='a-buc-c-sedlistheader__actions-attachments'
                data-tip={t('buc:form-youHaveXAttachmentsInSed',
                  { attachments: sed.attachments.length })}
              >
                <FilledPaperClipIcon/>
              </SEDListAttachmentsDiv>
            )}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
            <Flatknapp
              mini
              data-amplitude='buc.edit.besvarSed'
              data-testId='a-buc-c-sedlistheader__actions-answer-button'
              onClick={(e: React.MouseEvent) => {
                buttonLogger(e)
                onSEDNew(buc, sed)
              }}
            >
              {t('buc:form-answerSED')}
            </Flatknapp>
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
