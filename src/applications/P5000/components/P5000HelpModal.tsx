import Modal from 'components/Modal/Modal'
import { ChevronRightIcon , TrashIcon } from '@navikt/aksel-icons'
import { BodyLong, Button } from '@navikt/ds-react'
import { VerticalSeparatorDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { useTranslation } from 'react-i18next'
import P5000HelpPNG from 'assets/images/p5000help.png'

const P5000HelpModal = ({
  open, onClose
}: any) => {
  const { t } = useTranslation()
  return (
    <Modal
      open={open}
      modal={{
        closeButton: true,
        modalTitle: t('p5000:saved-working-copy') + ' ' + t('ui:hva-betyr-det'),
        modalContent: (
          <div style={{ maxWidth: '800px' }}>
            <VerticalSeparatorDiv size='2' />
            <BodyLong>
              {t('p5000:help-modal-1')}
              <Button
                size='small'
                variant='tertiary'
                onClick={() => {}}
              >
                {t('p5000:registrert')}
                <HorizontalSeparatorDiv size='0.3' />
                <ChevronRightIcon fontSize="1.5rem" />
              </Button>
              {t('p5000:help-modal-2')}
            </BodyLong>
            <VerticalSeparatorDiv />
            <BodyLong>
              {t('p5000:help-modal-3')}
            </BodyLong>
            <VerticalSeparatorDiv />
            <BodyLong>
              {t('p5000:help-modal-4')}
            </BodyLong>
            <VerticalSeparatorDiv />
            <div style={{ textAlign: 'center' }}>
              <img alt='p5000help' src={P5000HelpPNG} />
            </div>
            <VerticalSeparatorDiv />
            <BodyLong>
              {t('p5000:help-modal-5')}
              <Button
                size='small'
                variant='tertiary'
                onClick={() => {}}
              >
                {t('p5000:rediger')}
                <HorizontalSeparatorDiv size='0.3' />
                <ChevronRightIcon />
              </Button>
              {t('p5000:help-modal-6')}
              <Button
                size='small'
                variant='tertiary'
                onClick={() => {}}
              >
                <TrashIcon fontSize="1.5rem" />
                <HorizontalSeparatorDiv size='0.5' />
                {t('ui:remove')}
              </Button>
              .
            </BodyLong>
            <VerticalSeparatorDiv />
            <BodyLong>
              {t('p5000:help-modal-7')}
            </BodyLong>
            <VerticalSeparatorDiv size='2' />
          </div>
        ),
        modalButtons: [{
          main: true,
          text: 'OK',
          onClick: onClose
        }]
      }}
      onModalClose={onClose}
    />
  )
}

export default P5000HelpModal
