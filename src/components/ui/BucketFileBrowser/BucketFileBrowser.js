import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import _ from 'lodash';

import Icons from '../Icons';
import * as Nav from '../Nav';

import * as routes from '../../../constants/routes';
import * as statusActions from '../../../actions/status';
import * as p4000Actions from '../../../actions/p4000';

import './BucketFileBrowser.css';

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, statusActions, p4000Actions), dispatch)};
};

class BucketFileBrowser extends Component {

    state = {}

    render() {

        const { className } = this.props;

        return <div className={classNames('c-ui-bucketFilebrowser', className)}>
            Yo
        </div>
    }
}

BucketFileBrowser.propTypes = {
    t                 : PT.func.isRequired,
    className         : PT.object,
    actions           : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(BucketFileBrowser)
);
