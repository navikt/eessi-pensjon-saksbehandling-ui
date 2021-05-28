import Modal from 'components/Modal/Modal'
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron'
import { Normaltekst } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, VerticalSeparatorDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { useTranslation } from 'react-i18next'
import P5000HelpPNG from 'assets/images/p5000help.png'
const P5000HelpModal = ({
  highContrast, onClose
}: any) => {
  const { t } = useTranslation()
  return (
    <Modal
      highContrast={highContrast}
      modal={{
        closeButton: true,
        modalContent: (
          <div style={{ maxWidth: '600px' }}>
            <VerticalSeparatorDiv size='2' />
            <Normaltekst>
              When you edit a P5000 by clicking on
              <HighContrastFlatknapp
                mini
                onClick={() => {}}
              >
                {t('buc:p5000-registrert')}
                <HorizontalSeparatorDiv size='0.3' />
                <HoyreChevron />
              </HighContrastFlatknapp>
              , you begin with a list of all periods found in RINA.
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              When you add a new period, or change an existing one, we create a "working copy" and save it in your
              computer immmediately.
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              This ensures that you do not lose any changes and you can resume work, after a token expiration.
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              You can see which P5000s have a saved working copy, when this panel appears:
            </Normaltekst>
            <VerticalSeparatorDiv size='0.5' />
            <img alt='p5000help' src={P5000HelpPNG} />
            <VerticalSeparatorDiv size='0.5' />
            <Normaltekst>
              From there, you can either delete the working copy (start again from the initial RINA version), or resume the work.
            </Normaltekst>
            <VerticalSeparatorDiv />
            <Normaltekst>
              When you send the P5000 SED to Rina, the working copy will be deleted.
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
