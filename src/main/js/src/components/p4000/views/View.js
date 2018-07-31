import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';
import ReactJson from 'react-json-view';

import * as Nav from '../../../components/ui/Nav';
import p4000Util from '../../../components/p4000/Util';

import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const styles = {
    jsonview : {
        overflow: 'auto',
        whiteSpace: 'nowrap'
    }
};

class View extends Component {

    state = {}

    handleClientJSON() {

        this.setState({
            clientJSON: this.props.events
        });
    }

    handleServerJSON() {

        this.setState({
            serverJSON: p4000Util.convertEventsToP4000(this.props.events)
        });
    }

    render() {

        const { t } = this.props;

        return <div className='div-view'>
            <Nav.Row className='fileButtons p-4 fieldset'>
                <Nav.Column className='col-6'>
                    <div className='mb-4 text-center'>
                        <Nav.Hovedknapp onClick={this.handleClientJSON.bind(this)}>
                            <div>{t('p4000:seeClientJSON')}</div>
                        </Nav.Hovedknapp>
                    </div>
                    <div style={styles.jsonview}>
                        {this.state.clientJSON ? <ReactJson src={this.state.clientJSON} theme='monokai'/> : null}
                    </div>
                </Nav.Column>
                <Nav.Column className='col-6'>
                     <div className='mb-4 text-center'>
                        <Nav.Hovedknapp onClick={this.handleServerJSON.bind(this)}>
                            <div>{t('p4000:seeServerJSON')}</div>
                        </Nav.Hovedknapp>
                     </div>
                     <div style={styles.jsonview}>
                         {this.state.serverJSON ? <ReactJson src={this.state.serverJSON} theme='monokai'/> : null}
                     </div>
                </Nav.Column>
            </Nav.Row>
        </div>
    }
}

View.propTypes = {
    t      : PT.func,
    events : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(View)
);
