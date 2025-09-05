import { getBucTypeLabel } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'src/applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'src/applications/BUC/components/SEDStatus/SEDStatus'
import P5000 from 'src/applications/P5000/P5000'
import P2000 from 'src/applications/P2000/P2000'
import SEDLoadSave from 'src/applications/P5000/components/SEDLoadSave/SEDLoadSave'
import { AllowedLocaleString, LocalStorageEntriesMap, BUCMode, FeatureToggles, LocalStorageEntry } from 'src/declarations/app.d'
import { Buc, Institutions, Participant, Sed } from 'src/declarations/buc'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import moment from 'moment'
import {Alert, Detail, BodyLong, Button, HStack, Box, VStack, HGrid} from '@navikt/ds-react'
import {ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, PaperclipIcon} from '@navikt/aksel-icons'
import { useTranslation } from 'react-i18next'
import {useSelector} from 'react-redux'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import {JoarkPreview} from "src/declarations/joark";
import PreviewSED from "src/components/PreviewSED/PreviewSED";
import P8000 from "src/applications/P8000/P8000";
import {umamiButtonLogger} from "src/metrics/umami";
import styles from './SEDHeader.module.css'
import classNames from "classnames";
import React from "react";

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

  const onFollowUpSedClicked = () => {
    onFollowUpSed(buc, sed, followUpSeds)
  }

  const P5000Draft: LocalStorageEntry | undefined = (
    sed.type === 'P5000' &&
    !_.isNil(storageEntries)
      ? _.find(storageEntries[buc.caseId!], { sedId: sed.id }) as LocalStorageEntry | undefined
      : undefined
  )

  return (
    <Box
      style={style}
      className={classNames(styles.sedHeader, className)}
    >
      <HGrid gap="4" paddingBlock="1" align="start" columns={4}>
        <VStack>
          <HStack align="center" minWidth="max-content">
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
          </HStack>
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
            <VStack>
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
            </VStack>
          </HStack>
        </VStack>
        <VStack>
          <InstitutionList
            data-testid='a_buc_c_sedheader--institutions-id'
            locale={locale}
            type='separated'
            institutions={institutionSenderList}
          />
        </VStack>
        <VStack>
          <InstitutionList
            data-testid='a_buc_c_sedheader--institutions-id'
            locale={locale}
            type='separated'
            institutions={institutionReceiverList}
          />
        </VStack>
        <HStack data-testid='a_buc_c_sedheader--actions-id' justify="start">
          {!_.isEmpty(sed.attachments) && (
            <PopoverCustomized
              label={(
                <span>
                  {t('buc:form-youHaveXAttachmentsInSed',
                    { attachments: sed.attachments.length })}
                </span>
              )}
            >
              <div className={styles.attachmentsDiv}
                   data-testid='a_buc_c_sedheader--actions-attachments'
              >
                <PaperclipIcon fontSize="1.5rem" />
              </div>
            </PopoverCustomized>
          )}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received') && (
            <Button
              variant='secondary'
              disabled={buc.readOnly === true}
              data-testid='a_buc_c_sedheader--answer-button-id'
              onClick={onFollowUpSedClicked}
            >
              {t('buc:form-answerSED')}
            </Button>
          )}
          <div>
            {sed.type === 'P5000'
              && (sed.status !== 'received' && sed.status !== 'cancelled')
              && (['NO:889640782', 'NO:NAVAT07'].includes(sed.participants.find(p => p.role === 'Sender')?.organisation.id ?? ''))
              && (
                <>
                  <Button
                    variant='secondary'
                    data-testid='a_buc_c_sedheader--p5000-button-id'
                    onClick={() => {
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
                data-testid='a_buc_c_sedheader--p2000-button-id'
                onClick={() => {
                  umamiButtonLogger({
                    tekst: "Oppdater P2000",
                    bucType: buc.type
                  });
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
                data-testid='a_buc_c_sedheader--p8000-button-id'
                onClick={() => {
                  umamiButtonLogger({
                    tekst: "Oppdater P8000",
                    bucType: buc.type
                  });
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
            <div className={styles.expandDiv}>
              <Button variant="tertiary" onClick={() => toggleOpen(!toggleState)}>
                {!toggleState && <ChevronDownIcon fontSize="1.5rem" />}
                {toggleState && <ChevronUpIcon fontSize="1.5rem" />}
              </Button>
            </div>
          }
        </HStack>
      </HGrid>
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
    </Box>
  )
}

export default SEDHeader
