import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import P4000 from 'applications/P4000/P4000'
import P5000 from 'applications/P5000/P5000'
import SEDLoadSave from 'applications/P5000/SEDLoadSave/SEDLoadSave'
import { AllowedLocaleString, Entries, BUCMode, FeatureToggles, LocalStorageEntry } from 'declarations/app.d'
import { Buc, Institutions, Participant, Sed } from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import { Alert, Detail, BodyLong, Button, Panel } from '@navikt/ds-react'
import { NextFilled, AttachmentFilled } from '@navikt/ds-icons'
import {
  HorizontalSeparatorDiv,
  PileDiv,
  slideInFromLeft,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
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

export interface SEDHeaderProps {
  buc: Buc
  className ?: string
  onFollowUpSed: (buc: Buc, sed: Sed, followUpSeds: Array<Sed> | undefined) => void
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  sed: Sed
  style?: React.CSSProperties
}

export interface SEDListSelector {
  locale: AllowedLocaleString
  featureToggles: FeatureToggles
  storageEntries: Entries
}

const mapState = (state: State): SEDListSelector => ({
  locale: state.ui.locale,
  featureToggles: state.app.featureToggles,
  storageEntries: state.localStorage.entries
})

const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc,
  className,
  onFollowUpSed,
  setMode,
  sed,
  style
}: SEDHeaderProps): JSX.Element => {
  const { featureToggles, locale, storageEntries }: SEDListSelector = useSelector<State, SEDListSelector>(mapState)
  const { t } = useTranslation()
  const followUpSeds: Array<Sed> =
    buc.seds!.filter(_sed => _sed.parentDocumentId === sed.id && _sed.status !== 'sent' &&
      (sed.type === 'X009' ? featureToggles.X010_X009_VISIBLE : true))

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
          <Detail
            data-test-id='a-buc-c-sedheader__name-id'
          >
            {sed.type}{sedLabel ? ' - ' + sedLabel : ''}
          </Detail>
          <SEDListStatusItemDiv>
            <Tooltip
              placement='top' trigger={[sed.version !== '1' ? 'hover' : 'none']} overlay={(
                <BodyLong>
                  {t('ui:firstVersion')}
                  {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                </BodyLong>
                )}
            >
              <SEDStatus
                data-test-id='a-buc-c-sedheader__status-id'
                status={sed.type === 'P5000' && P5000Draft ? 'active' : sed.status}
              />
            </Tooltip>
            <HorizontalSeparatorDiv date-size='0.5' />
            <SEDVersion>
              <BodyLong
                data-test-id='a-buc-c-sedheader__version-date-id'
              >
                {sed.receiveDate
                  ? moment(sed.receiveDate).format('DD.MM.YYYY')
                  : sed.lastUpdate
                    ? moment(sed.lastUpdate).format('DD.MM.YYYY')
                    : null}
              </BodyLong>
              {sed.version && (
                <BodyLong
                  data-test-id='a-buc-c-sedheader__version-id'
                >
                  {t('ui:version')}{': '}{sed.version || '-'}
                </BodyLong>
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
                <AttachmentFilled />
              </SEDListAttachmentsDiv>
            </Tooltip>
          )}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
            <Button
              variant='secondary'
              disabled={buc.readOnly === true}
              data-amplitude='buc.edit.besvarSed'
              data-test-id='a-buc-c-sedheader__answer-button-id'
              onClick={onFollowUpSedClicked}
            >
              {t('buc:form-answerSED')}
            </Button>
          )}
          <PileDiv>
            {sed.type === 'P5000' &&
          featureToggles.P5000_SUMMER_VISIBLE &&
          (sed.status !== 'received') &&
          (
            <>
              <Button
                variant='secondary'
                data-amplitude='buc.edit.p5000'
                data-test-id='a-buc-c-sedheader__p5000-button-id'
                onClick={() => {
                  setMode('p5000', 'forward', undefined, (
                    <P5000
                      key={sed.id}
                      buc={buc}
                      context='edit'
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
              >
                {P5000Draft
                  ? t('p5000:rediger')
                  : sed.status === 'sent'
                    ? t('p5000:updating')
                    : t('p5000:registrert')}
                <HorizontalSeparatorDiv size='0.3' />
                <NextFilled />
              </Button>
              <VerticalSeparatorDiv />
            </>
          )}
            {sed.type === 'P4000' && featureToggles.P4000_VISIBLE && (
              <>
                <Button
                  variant='secondary'
                  data-amplitude='buc.edit.p4000'
                  data-test-id='a-buc-c-sedheader__p4000-button-id'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMode('p4000', 'forward', undefined, (
                      <P4000
                        key={sed.id}
                        buc={buc}
                        context='edit'
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
                >
                  {P5000Draft
                    ? t('buc:p4000-rediger')
                    : sed.status === 'sent'
                      ? t('buc:p4000-updating')
                      : t('buc:p4000-registrert')}
                  <HorizontalSeparatorDiv size='0.3' />
                  <NextFilled />
                </Button>
                <VerticalSeparatorDiv />
              </>
            )}
          </PileDiv>
        </SEDListActionsDiv>
      </SEDHeaderContent>
      {(featureToggles.P5000_SUMMER_VISIBLE && P5000Draft !== undefined)
        ? (
          <SEDLoadSave
            key={P5000Draft.date}
            buc={buc}
            sedId={sed.id}
          />
          )
        : null}
      {sed.type === 'X100' &&
        _.find(sed.participants, p => p.role === 'Sender')?.organisation.countryCode === 'DE' && (
          <Alert
            data-test-id='a-buc-c-sedheader__x100'
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
