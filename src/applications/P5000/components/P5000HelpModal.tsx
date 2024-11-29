import Modal from 'src/components/Modal/Modal'
import { ChevronRightIcon , TrashIcon } from '@navikt/aksel-icons'
import {BodyLong, Box, Button, VStack} from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import P5000HelpPNG from 'src/assets/images/p5000help.png'

const P5000HelpModal = ({
  open, onClose
}: any) => {
  const { t } = useTranslation()
  return (
    <Modal
      open={open}
      modal={{
        modalTitle: t('p5000:saved-working-copy') + ' ' + t('ui:hva-betyr-det'),
        modalContent: (
          <div style={{ maxWidth: '800px' }}>
            <Box paddingBlock="8 0">
              <VStack gap="4">
                <BodyLong>
                  {t('p5000:help-modal-1')}
                  <Button
                    size='small'
                    variant='tertiary'
                    onClick={() => {}}
                    iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
                  >
                    {t('p5000:registrert')}
                  </Button>
                  {t('p5000:help-modal-2')}
                </BodyLong>
                <BodyLong>
                  {t('p5000:help-modal-3')}
                </BodyLong>
                <BodyLong>
                  {t('p5000:help-modal-4')}
                </BodyLong>
                <div style={{ textAlign: 'center' }}>
                  <img alt='p5000help' src={P5000HelpPNG} />
                </div>
                <BodyLong>
                  {t('p5000:help-modal-5')}
                  <Button
                    size='small'
                    variant='tertiary'
                    onClick={() => {}}
                    iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
                  >
                    {t('p5000:rediger')}
                  </Button>
                  {t('p5000:help-modal-6')}
                  <Button
                    size='small'
                    variant='tertiary'
                    onClick={() => {}}
                    iconPosition="left" icon={<TrashIcon aria-hidden />}
                  >
                    {t('ui:remove')}
                  </Button>
                  .
                </BodyLong>
                <BodyLong>
                  {t('p5000:help-modal-7')}
                </BodyLong>
              </VStack>
            </Box>
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
