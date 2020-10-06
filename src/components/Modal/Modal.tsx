import classNames from 'classnames'
import { HighContrastFlatknapp, HighContrastHovedknapp, HighContrastKnapp } from 'components/StyledComponents'
import { ModalContent } from 'declarations/components'
import { ModalContentPropType } from 'declarations/components.pt'
import _ from 'lodash'
import Lukknapp from 'nav-frontend-lukknapp'
import ReactModal from 'react-modal'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

export interface ModalProps {
  appElement?: Element
  className?: string
  icon?: JSX.Element | undefined
  onModalClose?: () => void
  closeButton?: boolean
  closeButtonLabel?: string
  modal: ModalContent | undefined
}

const ModalDiv = styled(ReactModal)`
  background-color: #FFF;
  display: block;
  padding: 1rem 1rem 1rem 1rem;
  border-radius: 4px;
  position: relative;
  flex-grow: 0;
  overflow: inherit;
  max-height: 100%;
  margin-bottom: 0;
  z-index: 1010;
`
const OverlayStyle = createGlobalStyle`
  modal__overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(61, 56, 49, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
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
  &.burrons {
    margin-top: 3rem;
  }
`
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

  // ReactModal.setAppElement(appElement)

  return (
    <>
      <OverlayStyle />
      <ModalDiv
        overlayClassName='modal__overlay'
        className={className}
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
                  onClick={onCloseButtonClicked}
                >
                  {closeButtonLabel}
                </CloseButton>
              )}
              {_modal.modalTitle && (
                <Title>
                  {_modal.modalTitle}
                </Title>
              )}
              {_modal.modalContent || (
                <ModalText>
                  {_modal.modalText}
                </ModalText>
              )}
            </ContentDiv>
          )}
          {_modal && _modal.modalButtons && (
            <ModalButtons>
              {_modal.modalButtons.map((button, i) => {
                let Button = HighContrastKnapp
                if (button.main) {
                  Button = HighContrastHovedknapp
                }
                if (button.flat) {
                  Button = HighContrastFlatknapp
                }
                const handleClick = _.isFunction(button.onClick) ? () => {
                button.onClick!()
                closeModal()
                } : closeModal

                return (
                  <ButtonMargin key={i}>
                    <Button
                      id={'c-modal__button-id-' + i}
                      disabled={button.disabled || false}
                      key={button.text}
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
    </>
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
