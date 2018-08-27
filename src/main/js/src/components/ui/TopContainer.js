import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as Nav from './Nav'
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';

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

class TopContainer extends Component {

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    render () {

        const { className, style, modalOpen, modal } = this.props;

        return <div style={style} className={classNames(className)}>
            <TopHeader/>
            <ServerAlert/>
            <Nav.Modal isOpen={modalOpen}
                onRequestClose={this.closeModal.bind(this)}
                closeButton={false}
                contentLabel='contentLabel'>
                {modal ? (modal.content ? modal.content : <div>
                    <div className='m-3 text-center'><h4>{modal.modalTitle}</h4></div>
                    <div className='m-4 text-center'>{modal.modalText}</div>
                    <div className='text-center'>{modal.modalButtons.map(button => {
                        return button.main ?
                            <Nav.Hovedknapp className='mr-3 mb-3 modal-main-button' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Hovedknapp>
                            : <Nav.Knapp className='mr-3 mb-3 modal-other-button' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Knapp>
                    })}
                    </div>
                </div>) : null}
            </Nav.Modal>
            <Nav.Container fluid={true}>
                {this.props.children}
            </Nav.Container>
        </div>
    }
}

TopContainer.propTypes = {
    children  : PT.node.isRequired,
    className : PT.string,
    style     : PT.object,
    modalOpen : PT.bool.isRequired,
    modal     : PT.object,
    actions   : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopContainer);
