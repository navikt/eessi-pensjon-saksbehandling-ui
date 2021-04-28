import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDP5000 from 'applications/BUC/components/SEDP5000/SEDP5000'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import { BUCMode } from 'applications/BUC/index'
import FilledPaperClipIcon from 'assets/icons/filled-version-paperclip-2'
import SEDLoadSave from 'components/SEDLoadSave/SEDLoadSave'
import { PileDiv } from 'components/StyledComponents'

import { AllowedLocaleString } from 'declarations/app.d'
import { Buc, Institutions, Participant, Sed } from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import AlertStripe from 'nav-frontend-alertstriper'
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, {
  HighContrastFlatknapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  slideInFromLeft,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const SEDListActionsDiv = styled.div`
  flex: 2;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const SEDListAttachmentsDiv = styled.div`
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
  animation: ${slideInFromLeft(20)} 0.2s forwards;
  border: none;
`
const SEDListInstitutionsDiv = styled.div`
  flex: 3;
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: flex-start;
  padding: 0.3rem;
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
  margin-top: 0.5rem;
`
const SEDVersion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export interface SEDHeaderProps {
  buc: Buc
  className ?: string
  onSEDNew: (buc: Buc, sed: Sed, replySed: Sed | undefined) => void
  onP5000Edit: (sed: Sed) => void
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  p5000Storage: any
  setP5000Storage: any
  sed: Sed
  style?: React.CSSProperties
}

export interface SEDListSelector {
  highContrast: boolean
  locale: AllowedLocaleString
}

const mapState = (state: State): SEDListSelector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale
})

const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc,
  className,
  onSEDNew,
  onP5000Edit,
  setMode,
  p5000Storage,
  setP5000Storage,
  sed,
  style
}: SEDHeaderProps): JSX.Element => {
  const { highContrast, locale }: SEDListSelector = useSelector<State, SEDListSelector>(mapState)
  const { t } = useTranslation()
  const followUpSed: Sed | undefined = buc.seds!.find(_sed => _sed.parentDocumentId === sed.id && _sed.status !== 'sent')

  const institutionSenderList: Institutions = sed.participants
    ? sed.participants
        .filter((participant: Participant) => participant.role === 'Sender')
        .map((participant: Participant) => ({
          country: participant.organisation.countryCode,
          name: participant.organisation.name,
          institution: participant.organisation.id,
          acronym: participant.organisation.acronym || participant.organisation.id.split(':')[1]
        }))
    : []

  const institutionReceiverList: Institutions = sed.participants
    ? sed.participants
        .filter((participant: Participant) => participant.role === 'Receiver')
        .map((participant: Participant) => ({
          country: participant.organisation.countryCode,
          name: participant.organisation.name,
          institution: participant.organisation.id,
          acronym: participant.organisation.acronym || participant.organisation.id.split(':')[1]
        }))
    : []

  const sedLabel: string = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  const onReplySed = (e: React.MouseEvent) => {
    buttonLogger(e)
    onSEDNew(buc, sed, followUpSed)
  }

  const P5000Draft: Sed | undefined = (
    sed.type === 'P5000' &&
    !!p5000Storage &&
    !!p5000Storage[buc.caseId!] &&
    _.find(p5000Storage[buc.caseId!], (_sed: Sed) => _sed.id === sed.id)
  )

  return (
    <NavHighContrast highContrast={highContrast}>
      <SEDHeaderPanel
        style={style}
        className={className}
      >
        <SEDHeaderContent>
          <SEDListStatusDiv>
            <Element
              data-test-id='a-buc-c-sedheader__name-id'
            >
              {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
            </Element>
            <SEDListStatusItemDiv>
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
                  {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
                </Normaltekst>
                {sed.version && (
                  <Normaltekst
                    data-test-id='a-buc-c-sedheader__version-id'
                  >
                    {t('ui:version')}{': '}{sed.version || '-'}
                  </Normaltekst>
                )}
              </SEDVersion>
            </SEDListStatusItemDiv>
          </SEDListStatusDiv>
          <SEDListInstitutionsDiv>
            <InstitutionList
              data-test-id='a-buc-c-sedheader__institutions-id'
              locale={locale}
              type='separated'
              institutions={institutionSenderList}
            />
          </SEDListInstitutionsDiv>
          <SEDListInstitutionsDiv>
            <InstitutionList
              data-test-id='a-buc-c-sedheader__institutions-id'
              locale={locale}
              type='separated'
              institutions={institutionReceiverList}
            />
          </SEDListInstitutionsDiv>
          <SEDListActionsDiv
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
                <SEDListAttachmentsDiv
                  data-test-id='a-buc-c-sedheader__actions-attachments'
                >
                  <FilledPaperClipIcon />
                </SEDListAttachmentsDiv>
              </Tooltip>
            )}
            {(followUpSed && sed.status === 'received') && (
              <HighContrastFlatknapp
                mini
                disabled={buc.readOnly === true}
                data-amplitude='buc.edit.besvarSed'
                data-test-id='a-buc-c-sedheader__answer-button-id'
                onClick={onReplySed}
              >
                {t('buc:form-answerSED')}
              </HighContrastFlatknapp>
            )}

            {sed.type === 'P5000' && (
              <PileDiv>
                <HighContrastFlatknapp
                  mini
                  data-amplitude='buc.edit.p5000'
                  data-test-id='a-buc-c-sedheader__p5000-button-id'
                  onClick={() => onP5000Edit(sed)}
                >
                  {t('buc:form-seeP5000edit')}
                  <HorizontalSeparatorDiv data-size='0.3' />
                  <HoyreChevron />
                </HighContrastFlatknapp>
                <VerticalSeparatorDiv />
                {P5000Draft && (
                  <HighContrastFlatknapp
                    mini
                    data-amplitude='buc.edit.p5000'
                    data-test-id='a-buc-c-sedheader__p5000-button-id'
                    onClick={() => {
                      setMode('p5000', 'forward', undefined, (
                        <SEDP5000
                          buc={buc}
                          setMode={setMode}
                          fromStorage={P5000Draft}
                          p5000Storage={p5000Storage}
                          setP5000Storage={setP5000Storage}
                        />
                      ))
                    }}
                  >
                    {t('ui:load-draft')}
                    <HorizontalSeparatorDiv data-size='0.3' />
                    <HoyreChevron />
                  </HighContrastFlatknapp>
                )}
              </PileDiv>
            )}
          </SEDListActionsDiv>
        </SEDHeaderContent>
        {P5000Draft && (
          <SEDLoadSave
            buc={buc}
            sedId={sed.id}
            highContrast={highContrast}
            p5000Storage={p5000Storage}
            setP5000Storage={setP5000Storage}
          />
        )}
        {sed.type === 'X100' &&
        _.find(sed.participants, p => p.role === 'Sender')?.organisation.countryCode === 'DE' && (
          <AlertStripe
            data-test-id='a-buc-c-sedheader__x100'
            type='advarsel'
          >
            {t('buc:alert-X100')}
          </AlertStripe>
        )}
      </SEDHeaderPanel>
    </NavHighContrast>
  )
}

SEDHeader.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  onSEDNew: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object
}

export default SEDHeader
