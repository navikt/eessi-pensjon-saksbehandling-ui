import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import Icons from '../../ui/Icons';
import * as Nav from '../../ui/Nav';
import P4000Util from '../Util';

import * as storageActions from '../../../actions/storage';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, storageActions), dispatch)};
};

class SaveToServerButton extends Component {

    handleFileSaveToServer() {

        const { actions, events } = this.props;

        actions.openStorageModal({
            action   : 'save',
            blob     : {
                content  : P4000Util.writeEvents(events),
                mimetype : 'application/json',
                name     : 'p4000.json'
            }
        });
    }

    render () {

        const { t, events, style } = this.props;

        return <Nav.Knapp title={t('p4000:file-save-to-server-description-1') + '\n' + t('p4000:file-save-to-server-description-2')}
            style={style} className='bigButton saveP4000toServerButton' disabled={_.isEmpty(events)}
            onClick={this.handleFileSaveToServer.bind(this)}>
            <div>
                <Icons className='mr-3' size='4x' kind='document'/>
                <Icons className='mr-3' size='3x' kind='caretRight'/>
                <Icons size='3x' kind='server'/>
            </div>
            <div className='mt-3'>{t('p4000:file-save-to-server')}</div>
        </Nav.Knapp>
    }
}

SaveToServerButton.propTypes = {
    t       : PT.func.isRequired,
    events  : PT.array.isRequired,
    style   : PT.object,
    actions : PT.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SaveToServerButton)
);
