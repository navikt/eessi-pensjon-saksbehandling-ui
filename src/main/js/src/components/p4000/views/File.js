import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import Icons from '../../../components/ui/Icons';
import * as Nav from '../../../components/ui/Nav';
import TimelineComponent from '../../../components/p4000/Timeline';

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
    button: {
        width: '200px',
        height: '200px'
    }
}

class File extends Component {

    handleSubmit() {}

    handleSaveTemp() {}

    render() {

        const { t } = this.props;

        return <Nav.Row style={{backgroundColor: 'whitesmoke'}}>
            <Nav.Column>
                <Nav.Knapp style={styles.button} onClick={this.handleSubmit.bind(this)}>
                    <div><Icons size='6x' kind='p4000'/></div>
                    <div>{t('content:p4000-submit')}</div>
                </Nav.Knapp>
            </Nav.Column>
            <Nav.Column>
                <Nav.Knapp style={styles.button} disabled={true} onClick={this.handleSaveTemp.bind(this)}>
                    <div><Icons size='6x' kind='p4000'/></div>
                    <div>{t('content:p4000-save-temp')}</div>
                </Nav.Knapp>
            </Nav.Column>
        </Nav.Row>
    }
}

File.propTypes = {
    t : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(File)
);
