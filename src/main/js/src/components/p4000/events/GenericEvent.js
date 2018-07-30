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
import Validation from '../../../components/p4000/Validation';

const mapStateToProps = (state) => {
    return {
        event    : state.p4000.event,
        editMode : state.p4000.editMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Home extends Component {

    state = {}

    componentDidMount() {
        this.props.provideController({
            hasNoValidationErrors : this.hasNoValidationErrors.bind(this),
            passesValidation      : this.passesValidation.bind(this),
            resetValidation       : this.resetValidation.bind(this)
        });
    }

    componentWillUnmount() {
        this.props.provideController(null)
    }

    hasNoOtherErrors() {
       return this.state.otherValidationError === undefined
    }

    hasNoValidationErrors() {
        return this.hasNoOtherErrors() && this.datepicker ? this.datepicker.hasNoValidationErrors() : undefined;
    }

    async resetValidation() {

        return new Promise(async (resolve, reject) => {

           try {
                if (this.datepicker) {
                    await this.datepicker.resetValidation();
                }
                this.setState({
                    otherValidationError: undefined
                }, () => {
                     resolve();
                });
           } catch (error) {
                 reject(error);
           }
       });
    }

    async passesValidation() {

        const { event } = this.props;

        return new Promise(async (resolve, reject) => {

            try {
                if (this.datepicker) {
                    await this.datepicker.passesValidation();
                }

                this.setState({
                   otherValidationError : Validation.validateOther(event)
                }, () => {
                    resolve(this.hasNoValidationErrors());
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    render() {

        const { t, event, editMode, actions, type } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <Icons size='3x' kind={this.props.type} className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{ !editMode ? t('ui:new') : t('ui:edit')} {t('p4000:' + this.props.type + '-title')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDescription mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.Ikon className='float-left mr-4' kind='info-sirkel' />
                    <Nav.Tekstomrade>{t('p4000:' + this.props.type + '-description')}</Nav.Tekstomrade>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventDates','mb-4','p-4','fieldset', {
               validationFail : this.datepicker ? !this.datepicker.hasNoValidationErrors() : false
           })}>
                <Nav.Column>
                    <Nav.HjelpetekstBase className='float-right'>{t('p4000:help-' + this.props.type + '-dates')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:' + this.props.type + '-fieldset-1-dates-title')}</h2>
                    <DatePicker provideController={(datepicker) => this.datepicker = datepicker}/>
                </Nav.Column>
            </Nav.Row>
           <Nav.Row className={classNames('eventOther','mb-4','p-4','fieldset', {
               validationFail : this ? ! this.hasNoOtherErrors() : false
           })}>
                <Nav.Column>
                    <h2 className='mb-3'>{t('p4000:' + this.props.type + '-fieldset-2-other-title')}</h2>
                    {!this.hasNoOtherErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.otherValidationError)}</Nav.AlertStripe> : null}
                    <div className='mb-3'>
                            <div>
                                <label>{t('ui:country') + ' *'}</label>
                            </div>
                            <CountrySelect value={event.country ? event.country.value : undefined} multi={false}
                            flagImagePath="../../../flags/"
                            onSelect={(e) => {
                                actions.setEventProperty('country', e)}
                            }/>
                    </div>
                    <Nav.Textarea style={{minHeight:'200px'}} label={t('p4000:' + this.props.type + '-fieldset-2_1-other')} value={event.other || ''}
                        onChange={(e) => {actions.setEventProperty('other', e.target.value)}} />
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

Home.propTypes = {
    t        : PT.func.isRequired,
    event    : PT.object.isRequired,
    editMode : PT.bool.isRequired,
    actions  : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Home)
);
