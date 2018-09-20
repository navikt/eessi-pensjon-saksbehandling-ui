import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as Nav from './Nav';
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Modal from './Modal';

import * as statusActions from '../../actions/status';

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, statusActions), dispatch)};
};

class TopContainer extends Component {

    componentDidMount() {

        const { actions, location } = this.props;

        const rinaId = new URLSearchParams(location.search).get('rinaId');

        actions.setRinaId(rinaId); // if rinaId is undefined, it erases rinaId

        if (rinaId) {
            actions.getStatus(rinaId);
            actions.getCase(rinaId);
        }
    }

    render () {

        const { className, style, history } = this.props;

        return <div style={style} className={classNames('topcontainer', className)}>
            <TopHeader/>
            <ServerAlert/>
            <Modal/>
            <Breadcrumbs history={history}/>
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
    actions   : PT.object.isRequired,
    history   : PT.object.isRequired,
    location  : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopContainer)

