import { EyeWithPupilIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import {getPreviewFile, getSedPreviewPDF, resetSedPreviewPDF} from 'src/actions/buc'
import Modal from 'src/components/Modal/Modal'
import { ModalContent } from 'src/declarations/components'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'

import {JoarkPreview} from "src/declarations/joark";
import {PSED} from "src/declarations/app";
import PDFViewer from "src/components/PDFViewer/PDFViewer";

export interface PreviewSedProps {
  bucId?: string | undefined
  sedId?: string | undefined
  PSED?: PSED | null | undefined
  short ?: boolean
  size ?: 'medium' | 'small' | 'xsmall' | undefined
  disabled?: boolean
}

export interface PreviewSedSelector {
  gettingPreviewPDF: boolean
  previewPDF: JoarkPreview | null | undefined
  gettingPreviewSed: boolean
}

const mapState = (state: State): any => ({
  gettingPreviewPDF: state.loading.gettingPreviewPDF,
  gettingPreviewSed: state.loading.gettingPreviewSed,
  previewPDF: state.buc.previewPDF
})

const PreviewSED: React.FC<PreviewSedProps> = ({
  bucId,
  sedId,
  PSED,
  short = false,
  size = 'medium',
  disabled = false
}: PreviewSedProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    gettingPreviewPDF,
    gettingPreviewSed,
    previewPDF,
  }: PreviewSedSelector = useSelector(mapState)

  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)
  const [requestPreview, setRequestPreview] = useState<boolean>(false)

  useEffect(() => {
    if (requestPreview && !previewModal && !_.isNil(previewPDF)) {
      setRequestPreview(false)
      showPreviewModal(previewPDF)
    }
  }, [previewPDF])

  const showPreviewModal = (previewPDF: JoarkPreview) => {
    setPreviewModal({
      closeButton: true,
      modalContent: (
        <div style={{cursor: 'pointer'}}>
          <PDFViewer
            file={previewPDF?.filInnhold}
            name={previewPDF?.fileName}
            size={previewPDF?.filInnhold?.length ?? 0}
            width={800}
          />
        </div>
      )
    })
  }

  const handleModalClose = () => {
    dispatch(resetSedPreviewPDF())
    setPreviewModal(undefined)
  }

  const onPreviewSedClicked = (e: any) => {
    /* two modes:
       1) I am alrady editing a SED, so I can use all info from PSED
       2) I am choosing a SED, get PDF from RINA
     */
    if (PSED) {
      const newPSED = _.cloneDeep(PSED)
      //cleanReplySed(newPSED)
      delete newPSED.originalSed
      dispatch(getPreviewFile(newPSED))
    } else {
      if (sedId && bucId) {
        dispatch(getSedPreviewPDF(bucId, sedId))
      }
    }
    setRequestPreview(true)
  }

  return (
    <>
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={handleModalClose}
        width='900px'
      />
      <Button
        variant='tertiary'
        title="Forhåndsvis PDF"
        size={size}
        disabled={gettingPreviewPDF || gettingPreviewSed || disabled}
        onClick={onPreviewSedClicked}
        loading={(short && (gettingPreviewPDF || gettingPreviewSed)) || (!short && gettingPreviewPDF)}
        icon={<EyeWithPupilIcon />}
      >
        {!short && (
          <>
            {gettingPreviewPDF ? t('label:laster-ned-filen') : "Forhåndsvis PDF"}
          </>
        )}
      </Button>

    </>
  )
}

export default PreviewSED
