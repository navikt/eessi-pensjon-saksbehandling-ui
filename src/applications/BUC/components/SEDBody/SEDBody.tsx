import {
  createSavingAttachmentJob,
  resetSavingAttachmentJob,
  resetSedAttachments,
  sendAttachmentToSed
} from 'actions/buc'
import { sedAttachmentSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDAttachmentModal from 'applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import {
  Buc,
  SavingAttachmentsJob,
  Sed,
  SEDAttachment,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile,
  SEDAttachments
} from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Heading, Loader, Button } from '@navikt/ds-react'
import PT from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export const SEDAttachmentSenderDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
   width: 100%;
`
export const SEDBodyDiv = styled.div``

export interface SEDBodyProps {
  aktoerId: string
  buc: Buc
  canHaveAttachments: boolean
  initialAttachmentsSent?: boolean
  initialSeeAttachmentPanel?: boolean
  initialSendingAttachments?: boolean
  onAttachmentsSubmit?: (jbi: JoarkBrowserItems) => void
  onAttachmentsPanelOpen?: (o: boolean) => void
  sed: Sed
}

export interface SEDBodySelector {
  attachmentsError?: boolean
}

const mapState = (state: State): SEDBodySelector => ({
  attachmentsError: state.buc.attachmentsError
})

const SEDBody: React.FC<SEDBodyProps> = ({
  aktoerId,
  buc,
  canHaveAttachments,
  initialAttachmentsSent = false,
  initialSeeAttachmentPanel = false,
  initialSendingAttachments = false,
  onAttachmentsSubmit, sed
}: SEDBodyProps): JSX.Element => {
  const { attachmentsError }: SEDBodySelector = useSelector<State, SEDBodySelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const convertSedAttachmentsToJoarkBrowserItems = (sedAttachments: SEDAttachments): JoarkBrowserItems | undefined => {
    if (!sedAttachments) {
      return undefined
    }
    return sedAttachments.map((att: SEDAttachment) => {
      return {
        key: att.id,
        type: 'sed',
        title: att.name,
        date: new Date(att.lastUpdate),
        hasSubrows: false,
        disabled: false,
        dokumentInfoId: att.documentId,
        journalpostId: '',
        openSubrows: false,
        tema: undefined,
        variant: undefined,
        visible: true,
        selected: false
      } as JoarkBrowserItem
    })
  }
  // initially, joark is empty
  const [_items, setItems] = useState<JoarkBrowserItems>(
    convertSedAttachmentsToJoarkBrowserItems(sed.attachments) || []
  )
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(initialSeeAttachmentPanel)

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
    const joarkItemsToUpload: JoarkBrowserItems = _.filter(_items, f => f.type === 'joark')
    standardLogger('buc.edit.attachments.data', {
      numberOfJoarkAttachments: joarkItemsToUpload.length
    })
    dispatch(createSavingAttachmentJob(joarkItemsToUpload))
    if (_.isFunction(onAttachmentsSubmit)) {
      onAttachmentsSubmit(joarkItemsToUpload)
    }
  }

  const _onCancel = (): void => {
    setSendingAttachments(false)
    dispatch(resetSavingAttachmentJob())
  }

  const _onFinished = (): void => {
    setItems(_items.map(item => {
      item.type = 'sed'
      return item
    }))
    setAttachmentsSent(true)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    const sedOriginalAttachments: JoarkBrowserItems = _.filter(_items, (att) => att.type !== 'joark')
    const newAttachments = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setItems(newAttachments)
  }

  const onRowViewDelete = (newItems: JoarkBrowserItems): void => {
    setItems(newItems)
  }

  const _onSaved = (savingAttachmentsJob: SavingAttachmentsJob): void => {
    const sedOriginalAttachments: JoarkBrowserItems = _.filter(_items, (att) => att.type === 'sed')
    const newAttachments: JoarkBrowserItems = sedOriginalAttachments
      .concat(savingAttachmentsJob.saved)
      .concat(savingAttachmentsJob.remaining)
      .sort(sedAttachmentSorter)
    setItems(newAttachments)
  }

  const onSedAttachmentsChanged = useCallback((sedAttachments: SEDAttachments) => {
    setItems(convertSedAttachmentsToJoarkBrowserItems(sedAttachments) || [])
  }, [setItems])

  useEffect(() => {
    // cleanup after attachments sent
    if (_sendingAttachments && _attachmentsSent) {
      setSendingAttachments(false)
      setAttachmentsTableVisible(false)
      dispatch(resetSedAttachments())
    }
    if (!_sendingAttachments && _attachmentsSent) {
      setAttachmentsSent(false)
      dispatch(resetSavingAttachmentJob())
    }
  }, [_attachmentsSent, dispatch, _sendingAttachments])

  useEffect(() => {
    onSedAttachmentsChanged(sed.attachments)
  }, [onSedAttachmentsChanged, sed])

  return (
    <SEDBodyDiv>
      <VerticalSeparatorDiv />
      <Heading size='small'>
        {t('ui:attachments')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      {!_.isEmpty(_items) && (
        <JoarkBrowser
          data-test-id='a-buc-c-sedbody__attachments-id'
          existingItems={_items}
          mode='view'
          onRowViewDelete={onRowViewDelete}
          tableId={'viewsed-' + sed.id}
        />
      )}
      <>
        <VerticalSeparatorDiv />
        {!_attachmentsSent && _.find(_items, (item) => item.type === 'joark') !== undefined && (
          <Button
            variant='primary'
            data-test-id='a-buc-c-sedbody__upload-button-id'
            disabled={_sendingAttachments}

            onClick={onAttachmentsSubmitted}
          >
            {_sendingAttachments && <Loader />}
            {_sendingAttachments ? t('ui:uploading') : t('buc:form-submitSelectedAttachments')}
          </Button>
        )}
      </>
      <VerticalSeparatorDiv />
      {canHaveAttachments && (
        (_sendingAttachments || _attachmentsSent)
          ? (
            <SEDAttachmentSenderDiv>
              <>
                <SEDAttachmentSender
                  attachmentsError={attachmentsError}
                  sendAttachmentToSed={_sendAttachmentToSed}
                  payload={{
                    aktoerId: aktoerId,
                    rinaId: buc.caseId,
                    rinaDokumentId: sed.id
                  } as SEDAttachmentPayload}
                  onCancel={_onCancel}
                  onFinished={_onFinished}
                  onSaved={_onSaved}
                />
                <VerticalSeparatorDiv />
              </>
            </SEDAttachmentSenderDiv>
            )
          : (
            <>
              <Button
                variant='secondary'
                data-test-id='a-buc-c-sedbody__show-table-button-id'
                onClick={() => !_attachmentsTableVisible ? onAttachmentsPanelOpen() : onAttachmentsPanelClose()}
              >
                {t(_attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
              </Button>
              <VerticalSeparatorDiv />
            </>
            )
      )}
      <SEDAttachmentModal
        open={_attachmentsTableVisible}
        onModalClose={onAttachmentsPanelClose}
        onFinishedSelection={onJoarkAttachmentsChanged}
        sedAttachments={_items}
        tableId={'sedview' + sed.id + '-modal'}
      />
    </SEDBodyDiv>
  )
}

SEDBody.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  canHaveAttachments: PT.bool.isRequired,
  initialAttachmentsSent: PT.bool,
  initialSeeAttachmentPanel: PT.bool,
  initialSendingAttachments: PT.bool,
  onAttachmentsSubmit: PT.func,
  onAttachmentsPanelOpen: PT.func,
  sed: SedPropType.isRequired
}

export default SEDBody
