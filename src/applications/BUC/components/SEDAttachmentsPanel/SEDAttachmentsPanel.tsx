import {
  createSavingAttachmentJob,
  resetSavingAttachmentJob,
  sendAttachmentToSed
} from 'src/actions/buc'
import { sedAttachmentSorter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import SEDAttachmentModal from 'src/applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender from 'src/applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SavedAttachmentsTable from 'src/applications/BUC/components/SavedAttachmentsTable/SavedAttachmentsTable'
import JoarkBrowser from 'src/components/JoarkBrowser/JoarkBrowser'
import {
  Buc,
  SavingAttachmentsJob,
  Sed,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile,
  SEDAttachments,
} from 'src/declarations/buc'
import { JoarkBrowserItem, JoarkBrowserItems } from 'src/declarations/joark'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import { Heading, Loader, Button, Box, Alert, BodyShort, HStack, VStack } from '@navikt/ds-react'
import React, { JSX, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { checkSingleFilstoerrelseMB, checkSumFilstoerrelseMB, sumFilstoerrelseMB } from "src/utils/utils";
import { sumFilstoerrelseLimit } from "src/constants/sumFilstoerrelseLimit";
import { singleFilstoerrelseLimit } from "src/constants/singleFilstoerrelseLimit";

export interface SEDAttachmentsPanelProps {
  aktoerId: string | null | undefined
  buc: Buc
  canHaveAttachments: boolean
  initialAttachmentsSent?: boolean
  initialSeeAttachmentPanel?: boolean
  initialSendingAttachments?: boolean
  onAttachmentsSubmit?: (jbi: JoarkBrowserItems) => void
  onAttachmentsPanelOpen?: (o: boolean) => void
  sed: Sed
}

export interface SEDAttachmentsPanelSelector {
  attachmentsError?: boolean
}

const mapState = createSelector(
  (state: State) => state.buc.attachmentsError,
  (attachmentsError: boolean | undefined): SEDAttachmentsPanelSelector => ({
    attachmentsError
  })
)

const SEDAttachmentsPanel: React.FC<SEDAttachmentsPanelProps> = ({
  aktoerId,
  buc,
  canHaveAttachments,
  initialAttachmentsSent = false,
  initialSeeAttachmentPanel = false,
  initialSendingAttachments = false,
  onAttachmentsSubmit,
  sed
}: SEDAttachmentsPanelProps): JSX.Element => {
  const { attachmentsError }: SEDAttachmentsPanelSelector = useSelector<State, SEDAttachmentsPanelSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const savedAttachments: SEDAttachments = sed.attachments || []
  const [_pendingAttachments, setPendingAttachments] = useState<JoarkBrowserItems>([])
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(initialSeeAttachmentPanel)
  const [_pendingCurrentPage, setPendingCurrentPage] = useState<number>(1)
  const attachmentsPerPage = 10

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const onAttachmentsPanelClose = (): void => {
    setAttachmentsTableVisible(false)
  }

  const onAttachmentsPanelOpen = (): void => {
    setAttachmentsTableVisible(true)
    setAttachmentsSent(false)
  }

  const onAttachmentsSubmitted = (): void => {
    setSendingAttachments(true)
    setAttachmentsTableVisible(false)
    dispatch(createSavingAttachmentJob(_pendingAttachments))
    if (_.isFunction(onAttachmentsSubmit)) {
      onAttachmentsSubmit(_pendingAttachments)
    }
  }

  const _onCancel = (): void => {
    setSendingAttachments(false)
    dispatch(resetSavingAttachmentJob())
  }

  const _onFinished = (): void => {
    setPendingAttachments([])
    setAttachmentsSent(true)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    setPendingAttachments([...jbi].sort(sedAttachmentSorter))
  }

  const onRowViewDelete = (newItems: JoarkBrowserItems): void => {
    setPendingAttachments(newItems)
    setPendingCurrentPage((currentPage) => Math.min(
      currentPage,
      Math.max(1, Math.ceil(newItems.length / attachmentsPerPage))
    ))
  }

  const onSaved = (savingAttachmentsJob: SavingAttachmentsJob): void => {
    setPendingAttachments(_.cloneDeep(savingAttachmentsJob.remaining))
  }

  useEffect(() => {
    if (_attachmentsSent) {
      setSendingAttachments(false)
      setAttachmentsTableVisible(false)
      setAttachmentsSent(false)
      dispatch(resetSavingAttachmentJob())
    }
  }, [_attachmentsSent, dispatch])

  return (
    <Box>
      <>
        <Box
          borderWidth="1 0 0 0"
          borderColor="neutral-subtle"
          marginBlock="space-24 space-0"
          paddingBlock="space-16 space-0"
        >
          <Heading size='xsmall'>{t('ui:pendingAttachments')}</Heading>
        </Box>
        {_.isEmpty(_pendingAttachments) && (
          <em>{t('ui:no-attachments')}</em>
        )}
        {!_.isEmpty(_pendingAttachments) && (
        <>
          <Box paddingBlock="space-8 space-32">
            <BodyShort size='small'>
              {t('ui:pendingAttachmentsDescription', { count: _pendingAttachments.length })}
            </BodyShort>
          </Box>
          <Box paddingBlock="space-0 space-8">
            <JoarkBrowser
              data-testid='a_buc_c_sedattachmentspanel--pending-attachments-id'
              existingItems={_pendingAttachments}
              mode='view'
              onRowViewDelete={onRowViewDelete}
              tableId={'pending-sed-' + sed.id}
              itemsPerPage={attachmentsPerPage}
              currentPage={_pendingCurrentPage}
              setCurrentPage={setPendingCurrentPage}
            />
          </Box>
        </>
        )}
      </>
      <>
        {!_attachmentsSent && !_.isEmpty(_pendingAttachments) && (
          <VStack
            gap={"space-16"}
          >
            <VStack gap={"space-16"}>
              {!(checkSumFilstoerrelseMB(sumFilstoerrelseMB(_pendingAttachments), sed.attachmentsSize, sumFilstoerrelseLimit)) &&
                <Alert variant="warning" size="small">
                  {
                    t('message:alert-tooLargeFilstoerrelseSum',
                    { newSum: sumFilstoerrelseMB(_pendingAttachments), oldSum: sed.attachmentsSize ?? 0, max: sumFilstoerrelseLimit })
                  }
                </Alert>
              }
              {!(checkSingleFilstoerrelseMB(_pendingAttachments, singleFilstoerrelseLimit)) &&
                <Alert variant="warning" size="small">
                  {
                    t('message:alert-tooLargeSingleFilstoerrelse', { max: singleFilstoerrelseLimit })
                  }
                </Alert>
              }
            </VStack>
            <HStack gap="space-8">
              <Button
                variant='primary'
                data-testid='a_buc_c_sedattachmentspanel--upload-button-id'
                disabled={_sendingAttachments ||
                  !(checkSumFilstoerrelseMB(sumFilstoerrelseMB(_pendingAttachments), sed.attachmentsSize, sumFilstoerrelseLimit)) ||
                  !(checkSingleFilstoerrelseMB(_pendingAttachments, singleFilstoerrelseLimit))}
                onClick={onAttachmentsSubmitted}
              >
                {_sendingAttachments && <Loader />}
                {_sendingAttachments ? t('ui:uploading') : t('buc:form-submitSelectedAttachments')}
              </Button>
              {!_sendingAttachments && canHaveAttachments && (
                <Button
                  variant='secondary'
                  data-testid='a_buc_c_sedattachmentspanel--show-table-button-id'
                  onClick={() => !_attachmentsTableVisible ? onAttachmentsPanelOpen() : onAttachmentsPanelClose()}
                >
                  {t(_attachmentsTableVisible ? 'ui:cancelAttachmentSelection' : 'ui:selectMoreAttachments')}
                </Button>
              )}
            </HStack>
          </VStack>
        )}
      </>
      {canHaveAttachments && (
        (_sendingAttachments || _attachmentsSent)
          ? (
              <Box marginBlock="space-16" width="100%">
                <>
                  <SEDAttachmentSender
                    attachmentsError={attachmentsError}
                    sendAttachmentToSed={_sendAttachmentToSed}
                    payload={{
                      aktoerId,
                      rinaId: buc.caseId,
                      rinaDokumentId: sed.id
                    } as SEDAttachmentPayload}
                    onCancel={_onCancel}
                    onFinished={_onFinished}
                    onSaved={onSaved}
                  />
                </>
              </Box>
            )
          : (
            _.isEmpty(_pendingAttachments) && (
              <Box paddingBlock="space-16 space-16">
                <Button
                  variant='secondary'
                  data-testid='a_buc_c_sedattachmentspanel--show-table-button-id'
                  onClick={() => !_attachmentsTableVisible ? onAttachmentsPanelOpen() : onAttachmentsPanelClose()}
                >
                  {t(_attachmentsTableVisible ? 'ui:cancelAttachmentSelection' : 'ui:selectAttachments')}
                </Button>
              </Box>
            )
            )
      )}
      <>
        <Box marginBlock="space-48 space-0">
          <Heading size='xsmall'>{t('ui:savedAttachments')}</Heading>
        </Box>
        {_.isEmpty(savedAttachments) && (
          <em>{t('ui:no-attachments')}</em>
        )}
        {!_.isEmpty(savedAttachments) && (
        <>
          <Box paddingBlock="space-8 space-0">
            <BodyShort size='small'>{t('ui:savedAttachmentsDescription')}</BodyShort>
          </Box>
          <Box paddingBlock="space-0 space-32">
            <SavedAttachmentsTable
              attachments={savedAttachments}
              tableId={'saved-sed-' + sed.id}
            />
          </Box>
        </>
        )}
      </>
      <SEDAttachmentModal
        open={_attachmentsTableVisible}
        onModalClose={onAttachmentsPanelClose}
        onFinishedSelection={onJoarkAttachmentsChanged}
        sedAttachments={_pendingAttachments}
        tableId={'sedview' + sed.id + '-modal'}
      />
    </Box>
  );
}

export default SEDAttachmentsPanel
