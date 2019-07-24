import React, { Component } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'

import * as Nav from 'components/Nav'
import * as uiActions from 'actions/ui'
import { getDisplayName } from 'utils/displayName'

import './Modal.css'

const mapStateToProps = (state) => {
  return {
    modalOpen: state.ui.modalOpen,
    modal: state.ui.modal
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions), dispatch) }
}

export class Modal extends Component {
  closeModal () {
    const { actions } = this.props

    actions.closeModal()
  }

  render () {
    const { modalOpen, modal } = this.props

    return <Nav.Modal className='c-modal'
      ariaHideApp={false}
      isOpen={modalOpen}
      onRequestClose={this.closeModal.bind(this)}
      closeButton={false}
      contentLabel='contentLabel'>
      {modal ? <div>
        {modal.modalTitle ? <div className='m-3 text-center'><h4 id='modalTitle'>{modal.modalTitle}</h4></div> : null}
        {modal.modalContent ? modal.modalContent : <div id='modalText' className='m-4 text-center'>{modal.modalText}</div>}
        {modal.modalButtons ? <div className='text-center'>{modal.modalButtons.map(button => {
          return button.main
            ? <Nav.Hovedknapp id='c-modal-main-button' disabled={button.disabled || false} className='mr-3 mb-3 modal-main-button' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Hovedknapp>
            : <Nav.Knapp id='c-modal-other-button' className='mr-3 mb-3 modal-other-button' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Knapp>
        })}
        </div> : null }
      </div> : null}
    </Nav.Modal>
  }
}

Modal.propTypes = {
  modalOpen: PT.bool.isRequired,
  modal: PT.object,
  actions: PT.object.isRequired
}

const ConnectedModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)

ConnectedModal.displayName = `Connect(${getDisplayName(Modal)})`

export default ConnectedModal
