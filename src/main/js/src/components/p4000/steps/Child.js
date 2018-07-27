import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import CountrySelect from 'react-country-select';

import ReactDatePicker from 'react-date-picker';
import '../custom-datepicker.css';

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

const type = 'child';

class Child extends Component {

    render() {

        const { t, event, editMode, actions } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <Icons size='3x' kind={type} className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{ !editMode ? t('ui:new') : t('ui:edit')} {t('p4000:child-title')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDescription mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.Tekstomrade>{t('p4000:child-description')}</Nav.Tekstomrade>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDates mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase className='float-right'>{t('p4000:help-child-dates')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:child-fieldset-1-dates-title')}</h2>
                    <DatePicker/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventInfo mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase className='float-right'>{t('p4000:help-child-info')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:child-fieldset-2-info-title')}</h2>

                    <Nav.Input label={t('p4000:child-fieldset-2_1-lastname')} value={event.lastname}
                        onChange={(e) => {actions.setEventProperty('lastname', e.target.value)}} />

                    <Nav.Input label={t('p4000:child-fieldset-2_2-firstname')} value={event.firstname}
                        onChange={(e) => {actions.setEventProperty('firstname', e.target.value)}} />

                    <div>
                        <label>{t('p4000:child-fieldset-2_3-birthdate')}</label>
                    </div>
                    <div>
                        <ReactDatePicker value={event.birthDate}
                            locale='no-NB'
                            onChange={(date) => actions.setEventProperty('birthDate', date)}/>
                    </div>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventCountry mb-4 p-4 fieldset'>
                <Nav.Column>
                    <h2 className='mb-3'>{t('p4000:child-fieldset-3-country-title')}</h2>

                    <div className='mb-3'>
                        <CountrySelect value={event.country} multi={false}
                            flagImagePath="../../../flags/"
                            onSelect={(e) => {
                                actions.setEventProperty('country', e)}
                            }/>
                    </div>

                    <Nav.Textarea style={{minHeight:'200px'}} label={t('p4000:child-fieldset-3_1-other')} value={event.other || ''}
                        onChange={(e) => {actions.setEventProperty('other', e.target.value)}} />

                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

Child.propTypes = {
    t        : PT.func.isRequired,
    event    : PT.object.isRequired,
    editMode : PT.bool.isRequired,
    actions  : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Child)
);
