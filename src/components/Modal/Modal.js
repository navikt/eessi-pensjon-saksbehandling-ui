import React from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'

import { Hovedknapp, Knapp, Modal as NavModal, Undertittel } from 'components/Nav'
import * as uiActions from 'actions/ui'
import { getDisplayName } from 'utils/displayName'

import './Modal.css'

const mapStateToProps = (state) => {
  return {
    modal: state.ui.modal,
    modalOpen: state.ui.modalOpen
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(uiActions, dispatch) }
}

export const Modal = (props) => {
  const { actions, modal, modalOpen } = props

  const closeModal = () => {
    actions.closeModal()
  }

  return (
    <NavModal
      className='c-modal'
      ariaHideApp={false}
      isOpen={modalOpen}
      onRequestClose={closeModal}
      closeButton={false}
      contentLabel='contentLabel'
    >
      {modal ? (
        <div>
          {modal.modalTitle
            ? (
              <div className='m-3 text-center'>
                <Undertittel className='c-modal__title'>{modal.modalTitle}</Undertittel>
              </div>
            )
            : null}
          {modal.modalContent
            ? modal.modalContent
            : (
              <div className='c-modal__text m-4 text-center'>
                {modal.modalText}
              </div>
            )}
          {modal.modalButtons
            ? (
              <div className='c-modal__buttons text-center'>
                {modal.modalButtons.map(button => {
                  const handleClick = button.onClick
                  return button.main
                    ? (
                      <Hovedknapp
                        id='c-modal__main-button-id'
                        disabled={button.disabled || false}
                        className='c-modal__main-button mr-3 mb-3'
                        key={button.text}
                        onClick={handleClick}
                      >
                        {button.text}
                      </Hovedknapp>
                    )
                    : (
                      <Knapp
                        id='c-modal__other-button-id'
                        className='c-modal__other-button mr-3 mb-3'
                        key={button.text}
                        onClick={handleClick}
                      >
                        {button.text}
                      </Knapp>
                    )
                })}
              </div>
            ) : null}
        </div>
      ) : null}
    </NavModal>
  )
}

Modal.propTypes = {
  actions: PT.object.isRequired,
  modal: PT.object,
  modalOpen: PT.bool.isRequired
}

const ConnectedModal = connect(mapStateToProps, mapDispatchToProps)(Modal)
ConnectedModal.displayName = `Connect(${getDisplayName(Modal)})`
export default ConnectedModal
