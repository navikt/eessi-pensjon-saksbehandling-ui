import Trashcan from 'assets/icons/Trashcan'
import Modal from 'components/Modal/Modal'
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron'
import { Normaltekst } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, VerticalSeparatorDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { useTranslation } from 'react-i18next'
import P5000HelpPNG from 'assets/images/p5000help.png'
const P5000HelpModal = ({
  highContrast, open, onClose
}: any) => {
  const { t } = useTranslation()
  return (
    <Modal
      open={open}
      highContrast={highContrast}
      modal={{
        closeButton: true,
        modalTitle: t('buc:p5000-saved-working-copy') + ' ' + t('ui:hva-betyr-det'),
        modalContent: (
          <div style={{ maxWidth: '800px' }}>
            <VerticalSeparatorDiv size='2' />
            <Normaltekst>
              {t('buc:p5000-help-modal-1')}
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => {}}
              >
                {t('buc:p5000-registrert')}
                <HorizontalSeparatorDiv size='0.3' />
                <HoyreChevron />
              </HighContrastFlatknapp>
              {t('buc:p5000-help-modal-2')}
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              {t('buc:p5000-help-modal-3')}
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              {t('buc:p5000-help-modal-4')}
            </Normaltekst>
            <VerticalSeparatorDiv />
            <div style={{ textAlign: 'center' }}>
              <img alt='p5000help' src={P5000HelpPNG} />
            </div>
            <VerticalSeparatorDiv />
            <Normaltekst>
              {t('buc:p5000-help-modal-5')}
              <HighContrastFlatknapp
                mini kompakt
                onClick={() => {}}
              >
                {t('buc:p5000-rediger')}
                <HorizontalSeparatorDiv size='0.3' />
                <HoyreChevron />
              </HighContrastFlatknapp>
              {t('buc:p5000-help-modal-6')}
              <HighContrastFlatknapp
                mini kompakt
                onClick={() => {}}
              >
                <Trashcan />
                <HorizontalSeparatorDiv size='0.5' />
                {t('ui:remove')}
              </HighContrastFlatknapp>
              .
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              {t('buc:p5000-help-modal-7')}
            </Normaltekst>
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
