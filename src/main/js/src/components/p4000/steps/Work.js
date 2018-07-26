import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import CountrySelect from 'react-country-select';

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
                    <h2 className='mb-3'>{t('p4000:work-fieldset-1-dates-title')}</h2>
                    <DatePicker/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDates mb-4 p-4' style={styles.fieldset}>
                <Nav.Column>
                    <h2 className='mb-3'>{t('p4000:work-fieldset-2-info-title')}</h2>

                    <Nav.Input label={t('p4000:work-fieldset-2_1-activity')} value={event.activity}
                        onChange={(e) => {actions.setEventProperty('activity', e.target.value, type)}} />

                    <Nav.Input label={t('p4000:work-fieldset-2_2-id')} value={event.id}
                        onChange={(e) => {actions.setEventProperty('id', e.target.value, type)}} />

                    <Nav.Input label={t('p4000:work-fieldset-2_3-name')} value={event.name}
                        onChange={(e) => {actions.setEventProperty('name', e.target.value, type)}} />

                    <label>{t('p4000:work-fieldset-2_4-address')}</label>

                    <Nav.Input label={t('ui:street')} value={event.street}
                        onChange={(e) => {actions.setEventProperty('street', e.target.value, type)}} />

                    <Nav.Input label={t('ui:buildingName')} value={event.buildingName}
                        onChange={(e) => {actions.setEventProperty('buildingName', e.target.value, type)}} />

                    <Nav.Input label={t('ui:city')} value={event.city}
                        onChange={(e) => {actions.setEventProperty('city', e.target.value, type)}} />

                    <Nav.Input label={t('ui:region')} value={event.buildingName}
                        onChange={(e) => {actions.setEventProperty('region', e.target.value, type)}} />

                    <CountrySelect value={event.country} multi={false}
                    flagImagePath="../../Flagicons/"
                    onSelect={(e) => {
                        actions.setEventProperty('country', e, type)}
                    }/>

                    <Nav.Input label={t('p4000:work-fieldset-2_5-other')} value={event.other}
                         onChange={(e) => {actions.setEventProperty('other', e.target.value, type)}} />

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
