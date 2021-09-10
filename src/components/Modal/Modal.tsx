import classNames from 'classnames'
import { themeKeys, HighContrastFlatknapp, HighContrastHovedknapp, HighContrastKnapp } from 'nav-hoykontrast'
import { ModalContent } from 'declarations/components'
import { ModalContentPropType } from 'declarations/components.pt'
import _ from 'lodash'
import Lukknapp from 'nav-frontend-lukknapp'
import ReactModal from 'react-modal'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const ModalDiv = styled(ReactModal)`
  display: block;
  padding: 1rem 1rem 1rem 1rem;
  border-radius: 4px;
  position: relative;
  flex-grow: 0;
  overflow: inherit;
  max-height: 100%;
  margin-bottom: 0;
  z-index: 1010;
  color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
`
const CloseButton = styled(Lukknapp)`
  position: absolute !important;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 999;
`
const Title = styled(Undertittel)`
  text-align: center;
`
const ModalText = styled.div`
  margin: 1.5rem;
  text-align: center;
`
const ModalButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const ButtonMargin = styled.div`
  margin-right: 1rem;
  margin-top: 0.5rem;
  margin-botton: 0.5rem;
`
const IconDiv = styled.div`
  z-index: 40000;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -3rem;
`
const ContentDiv = styled.div`
  overflow: auto;
  max-height: 85vh;
  &.icon {
    margin-top: 3rem;
  }
  &.buttons {
    margin-top: 3rem;
  }
`

export interface ModalProps {
  appElement?: Element
  className?: string
  highContrast: boolean
  icon?: JSX.Element | undefined
  onModalClose?: () => void
  closeButton?: boolean
  closeButtonLabel?: string
  modal: ModalContent | undefined
}

const Modal: React.FC<ModalProps> = ({
  className,
  icon = undefined,
  onModalClose,
  closeButton = true,
  closeButtonLabel = '',
  modal
}: ModalProps): JSX.Element => {
  const [_modal, setModal] = useState<ModalContent | undefined>(modal)

  useEffect(() => {
    if (!_.isEqual(_modal, modal)) {
      setModal(modal)
    }
  }, [modal, _modal])

  const closeModal = (): void => {
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  const onCloseButtonClicked = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  if (typeof (window) !== 'undefined') {
    ReactModal.setAppElement('body')
  }

  return (
    <ModalDiv
      className={className}
      overlayClassName='modal__overlay'
      isOpen={!_(_modal).isNil()}
      onRequestClose={closeModal}
    >
      {icon && (
        <IconDiv>{icon}</IconDiv>
      )}
      <>
        {_modal && (
          <ContentDiv className={classNames({ icon: !!icon })}>
            {closeButton && (
              <CloseButton
                data-test-id='c-modal__close-button-id'
                onClick={onCloseButtonClicked}
              >
                {closeButtonLabel}
              </CloseButton>
            )}
            {_modal.modalTitle && (
              <Title data-test-id='c-modal__title-id'>
                {_modal.modalTitle}
              </Title>
            )}
            {_modal.modalContent || (
              <ModalText data-test-id='c-modal__text-id'>
                {_modal.modalText}
              </ModalText>
            )}
          </ContentDiv>
        )}
        {_modal && _modal.modalButtons && (
          <ModalButtons className={classNames('buttons')}>
            {_modal.modalButtons.map((button, i) => {
              let Button = HighContrastKnapp
              if (button.main) {
                Button = HighContrastHovedknapp
              }
              if (button.flat) {
                Button = HighContrastFlatknapp
              }
              const handleClick = _.isFunction(button.onClick)
                ? () => {
                    button.onClick!()
                    closeModal()
                  }
                : closeModal

              return (
                <ButtonMargin key={i}>
                  <Button
                    data-test-id={'c-modal__button-id-' + i}
                    disabled={button.disabled || false}
                    key={button.text}
                    id={'c-modal__button-id-' + i}
                    onClick={handleClick}
                  >
                    {button.text}
                  </Button>
                </ButtonMargin>
              )
            })}
          </ModalButtons>
        )}
      </>
    </ModalDiv>
  )
}

Modal.propTypes = {
  appElement: PT.any,
  className: PT.string,
  closeButton: PT.bool,
  closeButtonLabel: PT.string,
  onModalClose: PT.func,
  modal: ModalContentPropType
}

export default Modal
