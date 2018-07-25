import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as p4000Actions from '../../../actions/p4000';

import DatePicker from '../../../components/p4000/DatePicker';
import * as Nav from '../../../components/ui/Nav';
import Icons from '../../../components/ui/Icons';

const mapStateToProps = (state) => {
    return {
        event    : state.p4000.event,
        editMode : state.p4000.editMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const type = 'work';

const styles = {
    fieldset: {
        backgroundColor: 'whitesmoke',
        borderRadius: '20px'
    }
};

class Work extends Component {

    render() {

        const { t, event, editMode, actions } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <Icons size='3x' kind='work' className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{ !editMode ? t('ui:new') : t('ui:edit')} {t('p4000:work')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDates mb-4 p-4' style={styles.fieldset}>
                <Nav.Column>
                    <h2 className='mb-3'>Datoer</h2>
                    <DatePicker/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <Nav.Input label={t('p4000:activity')} value={event.activity || ''}
                        onChange={(e) => {actions.setEventProperty('activity', e.target.value, type)}} />
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

Work.propTypes = {
    t       : PT.func.isRequired,
    event   : PT.object.isRequired,
    actions : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Work)
);
