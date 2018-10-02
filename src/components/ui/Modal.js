import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as Nav from './Nav'
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        modalOpen : state.ui.modalOpen,
        modal     : state.ui.modal
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions), dispatch)};
};

class Modal extends Component {

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    render () {

        const { modalOpen, modal } = this.props;

        return <Nav.Modal className='c-ui-modal'
            isOpen={modalOpen}
            onRequestClose={this.closeModal.bind(this)}
            closeButton={false}
            contentLabel='contentLabel'>
            {modal ? modal.content || <div>
                <div className='m-3 text-center'><h4>{modal.modalTitle}</h4></div>
                <div className='m-4 text-center'>{modal.modalText}</div>
                <div className='text-center'>{modal.modalButtons.map(button => {
                    return button.main ?
                        <Nav.Hovedknapp className='mr-3 mb-3 modal-main-button' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Hovedknapp>
                        : <Nav.Knapp className='mr-3 mb-3 modal-other-button' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Knapp>
                })}
                </div>
            </div> : null}
        </Nav.Modal>
    }
}

Modal.propTypes = {
    modalOpen : PT.bool.isRequired,
    modal     : PT.object,
    actions   : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);
