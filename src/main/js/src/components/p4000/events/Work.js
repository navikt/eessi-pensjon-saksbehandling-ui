import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import CountrySelect from 'react-country-select';
import classNames from 'classnames';

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

class Work extends Component {

    state = {
    }

    componentDidMount() {
        this.props.provideController({
            hasNoValidationErrors: this.hasNoValidationErrors.bind(this),
            passesValidation : this.passesValidation.bind(this)
        });
    }

    componentWillUnmount() {
        this.props.provideController(null)
    }

    hasNoInfoErrors() {
        return this.state.infoValidationError === undefined
    }

    hasNoOtherErrors() {
       return this.state.otherValidationError === undefined
    }

    hasNoValidationErrors() {
        return this.hasNoInfoErrors() && this.hasNoOtherErrors() &&
            this.datepicker ? this.datepicker.hasNoValidationErrors() : undefined;
    }

    performInfoValidation() {

         const { t, event } = this.props;
         let validation = undefined;

         if (event.street === undefined) {

              validation = t('validation-nostreret');
         }
         return validation;
    }

    performOtherValidation() {

         const { t, event } = this.props;
         let validation = undefined;

         if (event.country === undefined) {

              validation = t('validation-nocountry');
         }
         return validation;
    }

    async passesValidation() {

        return new Promise(async (resolve, reject) => {

            try {

                // trigger the validation in child's datepicker
                await this.datepicker.passesValidation();

                this.setState({
                   infoValidationError : this.performInfoValidation(),
                   otherValidationError : this.performOtherValidation(),
                }, () => {
                    // after setting up state, use it to see the validation state
                    resolve(this.hasNoValidationErrors());
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    render() {

        const { t, event, editMode, actions } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <Icons size='3x' kind={type} className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{ !editMode ? t('ui:new') : t('ui:edit')} {t('p4000:work-title')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDescription mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.Ikon className='float-left mr-4' kind='info-sirkel' />
                    <Nav.Tekstomrade>{t('p4000:work-description')}</Nav.Tekstomrade>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventDates','mb-4','p-4','fieldset', {
                validationFail : this.datepicker ? !this.datepicker.hasNoValidationErrors() : false
            })}>
                <Nav.Column>
                    <Nav.HjelpetekstBase className='float-right'>{t('p4000:help-work-dates')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:work-fieldset-1-dates-title')}</h2>
                    <DatePicker provideController={(datepicker) => this.datepicker = datepicker}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventInfo','mb-4','p-4','fieldset', {
                   validationFail : this ? ! this.hasNoInfoErrors() : false
               })}>
               <Nav.Column>
                    {!this.hasNoInfoErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{this.state.infoValidationError}</Nav.AlertStripe> : null}
                    <Nav.HjelpetekstBase className='float-right'>{t('p4000:help-work-info')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:work-fieldset-2-info-title')}</h2>

                    <Nav.Input label={t('p4000:work-fieldset-2_1-activity')} value={event.activity}
                        onChange={(e) => {actions.setEventProperty('activity', e.target.value)}} />

                    <Nav.Input label={t('p4000:work-fieldset-2_2-id')} value={event.id}
                        onChange={(e) => {actions.setEventProperty('id', e.target.value)}} />

                    <Nav.Input label={t('p4000:work-fieldset-2_3-name')} value={event.name}
                        onChange={(e) => {actions.setEventProperty('name', e.target.value)}} />

                    <h4>{t('p4000:work-fieldset-2_4-address')}</h4>

                    <Nav.Input label={t('ui:street')} value={event.street}
                        onChange={(e) => {actions.setEventProperty('street', e.target.value)}} />

                    <Nav.Input label={t('ui:buildingName')} value={event.buildingName}
                        onChange={(e) => {actions.setEventProperty('buildingName', e.target.value)}} />

                    <Nav.Input label={t('ui:city')} value={event.city}
                        onChange={(e) => {actions.setEventProperty('city', e.target.value)}} />

                    <Nav.Input label={t('ui:region')} value={event.region}
                        onChange={(e) => {actions.setEventProperty('region', e.target.value)}} />
                </Nav.Column>
            </Nav.Row>
            <Nav.Row  className={classNames('eventOther','mb-4','p-4','fieldset', {
                    validationFail : this ? ! this.hasNoOtherErrors() : false
                })}>
                <Nav.Column>
                    <h2 className='mb-3'>{t('p4000:work-fieldset-3-other-title')}</h2>
                    {!this.hasNoOtherErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{this.state.otherValidationError}</Nav.AlertStripe> : null}
                    <div className='mb-3'>
                        <CountrySelect value={event.country} multi={false}
                            flagImagePath="../../../flags/"
                            onSelect={(e) => {
                                actions.setEventProperty('country', e)}
                            }/>
                    </div>
                    <Nav.Textarea style={{minHeight:'200px'}} label={t('p4000:work-fieldset-2_5-other')} value={event.other || ''}
                        onChange={(e) => {actions.setEventProperty('other', e.target.value)}} />

                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

Work.propTypes = {
    t        : PT.func.isRequired,
    event    : PT.object.isRequired,
    editMode : PT.bool.isRequired,
    actions  : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true}
)(
    translate()(Work)
);
