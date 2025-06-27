import { getBucTypeLabel } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'src/applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'src/applications/BUC/components/SEDStatus/SEDStatus'
import P5000 from 'src/applications/P5000/P5000'
import P2000 from 'src/applications/P2000/P2000'
import SEDLoadSave from 'src/applications/P5000/components/SEDLoadSave/SEDLoadSave'
import { AllowedLocaleString, LocalStorageEntriesMap, BUCMode, FeatureToggles, LocalStorageEntry } from 'src/declarations/app.d'
import { Buc, Institutions, Participant, Sed } from 'src/declarations/buc'
import { BucPropType, SedPropType } from 'src/declarations/buc.pt'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import {buttonLogger} from 'src/metrics/loggers'
import moment from 'moment'
import {Alert, Detail, BodyLong, Button, Panel, HStack} from '@navikt/ds-react'
import {ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, PaperclipIcon} from '@navikt/aksel-icons'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import { slideInFromLeft } from "src/components/Animations/Animations";
import {JoarkPreview} from "src/declarations/joark";
import PreviewSED from "src/components/PreviewSED/PreviewSED";
import {CenterHStack} from "src/components/StyledComponents";
import P8000 from "src/applications/P8000/P8000";

const SEDListActionsDiv = styled.div`
  flex: 2;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
`
const SEDListAttachmentsDiv = styled.div`
margin-right: 0.5rem;
`
const SEDHeaderContent = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`
export const SEDHeaderPanel = styled(Panel)`
  width: 100%;
  padding: 0rem;
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft(20)} 0.2s forwards;
  border: none;
  background: transparent !important;
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

const ExpandDiv = styled.div`
  margin-left: auto;
`



export interface SEDHeaderProps {
  buc: Buc
  className ?: string
  onFollowUpSed: (buc: Buc, sed: Sed, followUpSeds: Array<Sed> | undefined) => void
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  sed: Sed
  style?: React.CSSProperties
  toggleOpen?: (b:boolean) => void
  toggleState?: boolean
}

export interface SEDListSelector {
  locale: AllowedLocaleString
  featureToggles: FeatureToggles
  storageEntries: LocalStorageEntriesMap
  gettingPreviewPDF: boolean
  previewPDF: JoarkPreview | null | undefined
}

const mapState = (state: State): SEDListSelector => ({
  locale: state.ui.locale,
  featureToggles: state.app.featureToggles,
  storageEntries: state.localStorage.entries,
  gettingPreviewPDF: state.loading.gettingPreviewPDF,
  previewPDF: state.buc.previewPDF
})


const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc,
  className,
  onFollowUpSed,
  setMode,
  sed,
  style,
  toggleOpen,
  toggleState
}: SEDHeaderProps): JSX.Element => {
  const { locale, storageEntries }: SEDListSelector = useSelector<State, SEDListSelector>(mapState)
  const { t } = useTranslation()
  const followUpSeds: Array<Sed> = buc.seds!.filter(_sed => _sed.parentDocumentId === sed.id && _sed.status === 'empty')

  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return !buc.readOnly && sed !== undefined && sed.allowsAttachments && _.includes(['new', 'active'], sed.status)
  }

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
    t,
    type: sed.type,
    locale
  })

  const onFollowUpSedClicked = (e: React.MouseEvent) => {
    buttonLogger(e)
    onFollowUpSed(buc, sed, followUpSeds)
  }

  const P5000Draft: LocalStorageEntry | undefined = (
    sed.type === 'P5000' &&
    !_.isNil(storageEntries)
      ? _.find(storageEntries[buc.caseId!], { sedId: sed.id }) as LocalStorageEntry | undefined
      : undefined
  )

  return (
    <SEDHeaderPanel
      style={style}
      className={className}
    >
      <SEDHeaderContent>
        <SEDListStatusDiv>
          <CenterHStack>
            <Detail
              data-testid='a_buc_c_sedheader--name-id'
            >
              {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
            </Detail>
            <PreviewSED
              size='small'
              short={true}
              bucId={buc.caseId!}
              sedId={sed.id}
              disabled={false}
            />
          </CenterHStack>
          <SEDListStatusItemDiv>
            <HStack gap="4">
              <PopoverCustomized
                label={(
                  <BodyLong>
                    {t('ui:firstVersion')}: &nbsp;
                    {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                    <br/>
                    Dokument ID: {sed.id}
                  </BodyLong>
                  )}
              >
                <SEDStatus
                  data-testid='a_buc_c_sedheader--status-id'
                  status={sed.type === 'P5000' && P5000Draft ? 'active' : sed.status}
                />
              </PopoverCustomized>
              <SEDVersion>
                <BodyLong
                  data-testid='a_buc_c_sedheader--version-date-id'
                >
                  {sed.receiveDate
                    ? moment(sed.receiveDate).format('DD.MM.YYYY')
                    : sed.lastUpdate
                      ? moment(sed.lastUpdate).format('DD.MM.YYYY')
                      : null}
                </BodyLong>
                {sed.version && (
                  <BodyLong
                    data-testid='a_buc_c_sedheader--version-id'
                  >
                    {t('ui:version')}{': '}{sed.version || '-'}
                  </BodyLong>
                )}
              </SEDVersion>
            </HStack>
          </SEDListStatusItemDiv>
        </SEDListStatusDiv>
        <SEDListInstitutionsDiv>
          <InstitutionList
            data-testid='a_buc_c_sedheader--institutions-id'
            locale={locale}
            type='separated'
            institutions={institutionSenderList}
          />
        </SEDListInstitutionsDiv>
        <SEDListInstitutionsDiv>
          <InstitutionList
            data-testid='a_buc_c_sedheader--institutions-id'
            locale={locale}
            type='separated'
            institutions={institutionReceiverList}
          />
        </SEDListInstitutionsDiv>
        <SEDListActionsDiv
          data-testid='a_buc_c_sedheader--actions-id'
        >
          {!_.isEmpty(sed.attachments) && (
            <PopoverCustomized
              label={(
                <span>
                  {t('buc:form-youHaveXAttachmentsInSed',
                    { attachments: sed.attachments.length })}
                </span>
                )}
            >
              <SEDListAttachmentsDiv
                data-testid='a_buc_c_sedheader--actions-attachments'
              >
                <PaperclipIcon fontSize="1.5rem" />
              </SEDListAttachmentsDiv>
            </PopoverCustomized>
          )}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
            <Button
              variant='secondary'
              disabled={buc.readOnly === true}
              data-amplitude='buc.view.besvarSed'
              data-testid='a_buc_c_sedheader--answer-button-id'
              onClick={onFollowUpSedClicked}
            >
              {t('buc:form-answerSED')}
            </Button>
          )}
          <div>
            {sed.type === 'P5000' && (sed.status !== 'received') && (
            <>
              <Button
                variant='secondary'
                data-amplitude='buc.view.p5000.edit'
                data-testid='a_buc_c_sedheader--p5000-button-id'
                onClick={(e) => {
                  buttonLogger(e)
                  setMode('p5000', 'forward', undefined, (
                    <P5000
                      buc={buc}
                      setMode={setMode}
                      mainSed={sed}
                    />
                  ))
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  })
                }}
              iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
              >
                {P5000Draft
                  ? t('p5000:rediger')
                  : sed.status === 'sent'
                    ? t('p5000:updating')
                    : t('p5000:registrert')}
              </Button>
            </>
          )}
          </div>
          {sed.type === 'P2000' && (sed.status !== 'received') &&
            <>
              <Button
                variant='secondary'
                data-amplitude='buc.view.p2000.edit'
                data-testid='a_buc_c_sedheader--p2000-button-id'
                onClick={(e) => {
                  buttonLogger(e)
                  setMode('p2000', 'forward', undefined, (
                    <P2000
                      buc={buc}
                      setMode={setMode}
                      sed={sed}
                    />
                  ))
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  })
                }}
                iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
              >
                Oppdater P2000
              </Button>
            </>
          }
          {sed.type === 'P8000' && (sed.status !== 'received') &&
            <>
              <Button
                variant='secondary'
                data-amplitude='buc.view.p8000.edit'
                data-testid='a_buc_c_sedheader--p8000-button-id'
                onClick={(e) => {
                  buttonLogger(e)
                  setMode('p8000', 'forward', undefined, (
                    <P8000
                      buc={buc}
                      setMode={setMode}
                      sed={sed}
                    />
                  ))
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  })
                }}
                iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
              >
                Oppdater P8000
              </Button>
            </>
          }
          {sedCanHaveAttachments(sed) && toggleOpen &&
            <ExpandDiv>
              <Button variant="tertiary" onClick={() => toggleOpen(!toggleState)}>
                {!toggleState && <ChevronDownIcon fontSize="1.5rem" />}
                {toggleState && <ChevronUpIcon fontSize="1.5rem" />}
              </Button>
            </ExpandDiv>
          }
        </SEDListActionsDiv>
      </SEDHeaderContent>
      {P5000Draft !== undefined
        ? (
          <SEDLoadSave
            buc={buc}
            sedId={sed.id}
          />
          )
        : null}
      {sed.type === 'X100' &&
        _.find(sed.participants, p => p.role === 'Sender')?.organisation.countryCode === 'DE' && (
          <Alert
            data-testid='a_buc_c_sedheader--x100'
            variant='warning'
          >
            {t('message:alert-X100')}
          </Alert>
      )}
    </SEDHeaderPanel>
  )
}

SEDHeader.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  onFollowUpSed: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object
}

export default SEDHeader
