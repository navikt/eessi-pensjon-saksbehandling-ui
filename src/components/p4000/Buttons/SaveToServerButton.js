import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import Icons from '../../ui/Icons';
import * as Nav from '../../ui/Nav';
import P4000Util from '../Util';

import * as uiActions from '../../../actions/ui';
import * as storageActions from '../../../actions/storage';
import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events   : state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, storageActions, p4000Actions), dispatch)};
};

class SaveToServerButton extends Component {

    handleFileSaveToServer() {

        const { actions, events } = this.props;

        let fileOutput = P4000Util.writeEventsToString(events);

        actions.openStorageModal({
            action  : 'save',
            content : fileOutput
        });
    }

    render () {

        const { t, events, style } = this.props;

        return <Nav.Knapp style={style} className='bigButton saveToServerButton saveP4000toServerButton' disabled={_.isEmpty(events)}
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
    style   : PT.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SaveToServerButton)
);
