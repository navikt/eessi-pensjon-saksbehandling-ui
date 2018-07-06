import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import _ from 'lodash';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
    return {
        subjectAreaList : state.usercase.subjectAreaList,
        institutionList : state.usercase.institutionList,
        bucList         : state.usercase.bucList,
        sedList         : state.usercase.sedList,
        countryList     : state.usercase.countryList,
        currentCase     : state.usercase.currentCase,
        dataToConfirm   : state.usercase.dataToConfirm,
        action          : state.usercase.action,
        errorMessage    : state.error.clientErrorMessage,
        errorStatus     : state.error.clientErrorStatus,
        language        : state.ui.language,
        loading         : state.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class EditCase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            institutions: [],
            validation: {},
            defaultSelects: {
                subjectArea: '--',
                buc: '--',
                sed: '--',
                institution: '--',
                country: 'allCountries'
            }
        };
    }

    componentWillMount() {

        const { actions, match, currentCase, institutionList, bucList, subjectAreaList, countryList, dataToConfirm } = this.props;

        if (_.isEmpty(currentCase)) {
            let id = match.params.id;
            actions.getCaseFromCaseNumber({
                caseId: id
            });
        }

        if (_.isEmpty(subjectAreaList)) {
            actions.getSubjectAreaList();
        }

        if (_.isEmpty(bucList)) {
            actions.getBucList();
        }

        if (_.isEmpty(institutionList)) {
            actions.getInstitutionList();
        }

        if (_.isEmpty(countryList)) {
            actions.getCountryList();
        }
    }

    componentWillReceiveProps(nextProps) {

        const { history } = this.props;

        if ( !nextProps.loading.getcase && !nextProps.currentCase) {
            history.push('/react/get');
        }

        if (nextProps.dataToConfirm) {

            if (nextProps.action === 'forward') {
                history.push('/react/confirm');
            }

            if (nextProps.action === 'back') {

                this.setState({
                    'institutions' : nextProps.dataToConfirm.institutions,
                    'buc'          : nextProps.dataToConfirm.buc,
                    'sed'          : nextProps.dataToConfirm.sed,
                    'subjectArea'  : nextProps.dataToConfirm.subjectArea
                });
            }
        }
    }

    onBackButtonClick() {

        const { history } = this.props;
        history.goBack();
    }

    onForwardButtonClick() {

        const { actions, currentCase } = this.props;

        this.performAllValidations();

        if (this.noValidationErrors()) {
            actions.dataToConfirm({
                'institutions' : this.state.institutions,
                'buc'          : this.state.buc,
                'sed'          : this.state.sed,
                'subjectArea'  : this.state.subjectArea,
                'caseId'       : currentCase.casenumber
            });
        }
    }

    performAllValidations() {

        this.validateSubjectArea(this.state.subjectArea);
        this.validateBuc(this.state.buc);
        this.validateSed(this.state.sed);
        this.validateInstitutions(this.state.institutions);
    }

    validateSubjectArea(subjectArea) {

        const { t } = this.props;
        if (!subjectArea || subjectArea === '--') {
            this.setValidationState('subjectAreaFail', t('validation:chooseSubjectArea'));
        } else {
            this.resetValidationState('subjectAreaFail');
        }
    }

    validateBuc(buc) {

        const { t } = this.props;
        if (!buc || buc === '--') {
            this.setValidationState('bucFail', t('validation:chooseBuc'));
        } else {
            this.resetValidationState('bucFail');
        }
    }

    validateSed(sed) {

        const { t } = this.props;
        if (!sed || sed === '--') {
            this.setValidationState('sedFail', t('validation:chooseSed'));
        } else {
            this.resetValidationState('sedFail');
        }
    }

    validateInstitutions(institutions) {

        const { t } = this.props;
        if (!institutions || Object.keys(institutions).length === 0) {
            this.setValidationState('institutionaFail', t('validation:chooseInstitutions'));
        } else {
             this.resetValidationState('institutionsFail');
        }
    }

    validateInstitution(institution) {

        const { t } = this.props;
        if (!institution || institution === '--') {
            this.setValidationState('institutionFail', t('validation:chooseInstitution'));
        } else {
            this.resetValidationState('institutionFail');
        }
    }

    validateCountry(country) {
        // nothing to do here, country is optional, any value is OK
    }

    onCreateInstitutionButtonClick() {

        this.validateInstitution(this.state.institution);
        this.validateCountry(this.state.country);

        if (!this.state.validation.countryFail && !this.state.validation.institutionFail) {
            let institutions = this.state.institutions;
            institutions.push({
                institution: this.state.institution,
                country: this.state.country
            });
            this.setState({
                institutions : institutions,
                institution  : undefined,
                country      : undefined
            });
        }
    }

    onRemoveInstitutionButtonClick(institution) {

        let institutions = this.state.institutions;
        let newInstitutions = [];

        for (var i in institutions) {
            if (institution.institution !== institutions[i].institution ||
                institution.country !== institutions[i].country) {
                newInstitutions.push(institutions[i]);
            }
        }

        this.setState({
            institutions : newInstitutions
        });
    }

    resetValidationState(key) {

        let validation = this.state.validation;
        if (validation.hasOwnProperty(key)) {
            delete validation[key];
            this.setState({ validation: validation });
        }
    }

    setValidationState(key, value) {

        this.setState({
            validation: Object.assign(this.state.validation, {[key]: value})
        });
    }

    onSubjectAreaChange(e) {

        let subjectArea = e.target.value;
        this.setState({subjectArea: subjectArea});
        this.validateSubjectArea(subjectArea);
    }

    onBucChange(e) {

        const { actions } = this.props;

        let buc = e.target.value;
        this.setState({buc: buc});
        this.validateBuc(buc);
        if (!this.state.validation.bucFail) {
            actions.getSedList(buc);
        }
    }

    onSedChange(e) {

        let sed = e.target.value;
        this.setState({sed: sed})
        this.validateSed(sed);
    }

    onInstitutionChange(e) {

        let institution = e.target.value;
        this.setState({institution: institution})
        this.validateInstitution(institution);
    }

    onCountryChange(e) {

        const { actions } = this.props;

        let country = e.target.value;
        this.setState({country: country})
        this.validateCountry(country);
        //TODO
        if (!this.state.validation.countryFail) {
             actions.getInstitutionListForCountry(country);
        }
    }

    renderOptions(map) {

        if (!map) {
            return null;
        }

        if (map[0] !== '--') {
            map.unshift('--');
        }
        return map.map(el => {
            return <option key={el}>{el}</option>
        });
    }

    renderSubjectArea() {

        const { t, subjectAreaList } = this.props;

        return <Nav.Select bredde='xxl' feil={this.state.validation.subjectAreaFail ? {feilmelding: this.state.validation.subjectAreaFail} : null}
            label={t('ui:subjectArea')} value={this.state.subjectArea} onChange={this.onSubjectAreaChange.bind(this)}>
            {this.renderOptions(subjectAreaList)}
        </Nav.Select>
    }

    renderCountry(currentValue) {

        const { t, countryList } = this.props;

        return <Nav.Select bredde='xxl' feil={this.state.validation.countryFail ? {feilmelding: this.state.validation.countryFail} : null}
            label={t('ui:country')} value={currentValue} onChange={this.onCountryChange.bind(this)}>
            {this.renderOptions(countryList)}
        </Nav.Select>
    }

    renderInstitution(currentValue) {

        const { t, institutionList } = this.props;

        return <Nav.Select bredde='xxl' feil={this.state.validation.institutionFail ? {feilmelding: this.state.validation.institutionFail} : null}
            label={t('ui:institution')} value={currentValue} onChange={this.onInstitutionChange.bind(this)}>
            {this.renderOptions(institutionList)}
        </Nav.Select>
    }

    renderBuc() {

        const { t, bucList } = this.props;

        return <Nav.Select bredde='xxl' feil={this.state.validation.bucFail ? {feilmelding: this.state.validation.bucFail} : null}
            label={t('ui:buc')} value={this.state.buc} onChange={this.onBucChange.bind(this)}>
            {this.renderOptions(bucList)}
        </Nav.Select>
    }

    renderSed() {

        const { t, sedList, bucList } = this.props;

        return <Nav.Select bredde='xxl' feil={this.state.validation.sedFail? {feilmelding: this.state.validation.sedFail} : null}
            disabled={!bucList} label={t('ui:sed')} value={this.state.sed} onChange={this.onSedChange.bind(this)}>
            {this.renderOptions(sedList)}
        </Nav.Select>
    }

    getSpinner(text) {

        const { t } = this.props;

        return <div className='ml-2'>
            <Nav.NavFrontendSpinner type='S'/>
            <div className='float-right ml-2'>{t(text)}</div>
        </div>
    }

    renderChosenInstitution(institution) {

        const { t } = this.props;

        return <Nav.Row className='mt-2'>
            <Nav.Column style={{lineHeight: '2rem'}}>
                <b>{institution.country + '/' + institution.institution}</b>
            </Nav.Column>
            <Nav.Column>
                <Nav.Knapp type='standard' onClick={this.onRemoveInstitutionButtonClick.bind(this, institution)}>{t('ui:remove')}</Nav.Knapp>
            </Nav.Column>
            <Nav.Column/>
        </Nav.Row>;
    }

    renderInstitutions() {

        const { t, loading } = this.props;

        let renderedInstitutions = [];

        for (var i in this.state.institutions) {
            let institution = this.state.institutions[i];
            renderedInstitutions.push(this.renderChosenInstitution(institution));
        }

        renderedInstitutions.push(<Nav.Row className='mt-4'>
            <Nav.Column>
                <div>{this.renderCountry()}</div>
                <div className='mt-4'>
                    <Nav.HjelpetekstBase className='d-inline-block' id='country' type='under'>{t('help:country')}</Nav.HjelpetekstBase>
                    <div className='d-inline-block'>{loading && loading.countryList ? this.getSpinner('loading:country'): null}</div>
                </div>
            </Nav.Column>
            <Nav.Column>
                <div>{this.renderInstitution()}</div>
                <div className='mt-4'>
                    <Nav.HjelpetekstBase className='d-inline-block' id='institution' type='under'>{t('help:institution')}</Nav.HjelpetekstBase>
                    <div className='d-inline-block'>{loading && loading.institutionList ? this.getSpinner('loading:institution'): null}</div>
                </div>
            </Nav.Column>
            <Nav.Column style={{lineHeight: '6rem'}}>
                <Nav.Knapp type='standard' onClick={this.onCreateInstitutionButtonClick.bind(this)}>{t('ui:create')}</Nav.Knapp>
            </Nav.Column>
        </Nav.Row>);

        return renderedInstitutions.map(i => { return i});
    }

    noValidationErrors() {
        return Object.keys(this.state.validation).length === 0 &&
               Object.keys(this.state.institutions).length !== 0 &&
               this.state.subjectArea &&
               this.state.buc &&
               this.state.sed;
    }

    render() {

        const { t, currentCase, errorMessage, errorStatus, loading } = this.props;

        if (!currentCase) {
            return null;
        }

        let alert = <Nav.AlertStripe type='suksess'>{t('ui:caseFound') + ': ' + currentCase.casenumber}</Nav.AlertStripe>

        if (errorStatus) {
            alert = <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe>;
        }

        return <TopContainer>
            <Nav.Panel>
                <Nav.Row className='mt-4'>
                    <Nav.Column>{t('content:editCaseDescription')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 align-middle text-left'>
                    <Nav.Column>{this.renderSubjectArea()}</Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase className='d-inline-block' id='subjectArea' type='under'>{t('help:subjectArea')}</Nav.HjelpetekstBase>
                        <div className='d-inline-block'>{loading && loading.subjectAreaList ? this.getSpinner('loading:subjectArea'): null}</div>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 align-middle text-left'>
                    <Nav.Column>{this.renderBuc()}</Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase className='d-inline-block' id='buc' type='under'>{t('help:buc')}</Nav.HjelpetekstBase>
                        <div className='d-inline-block'>{loading && loading.bucList ? this.getSpinner('loading:buc') : null}</div>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 align-middle text-left'>
                    <Nav.Column>{this.renderSed()}</Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase className='d-inline-block' id='sed' type='under'>{t('help:sed')}</Nav.HjelpetekstBase>
                        <div className='d-inline-block'>{loading && loading.sedList ? this.getSpinner('loading:sed') : null}</div>
                    </Nav.Column>
                </Nav.Row>
                {this.renderInstitutions()}
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:tilbake')}</Nav.Knapp>
                        <Nav.Hovedknapp disabled={!this.noValidationErrors()} onClick={this.onForwardButtonClick.bind(this)}>{t('ui:go')}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>;
    }
}
EditCase.propTypes = {
    currentCase      : PT.object,
    actions          : PT.object,
    history          : PT.object,
    loading          : PT.object,
    t                : PT.func,
    match            : PT.object,
    subjectAreaList  : PT.Array,
    institutionList  : PT.Array,
    countryList      : PT.Array,
    sedList          : PT.Array,
    bucList          : PT.Array,
    dataToConfirm    : PT.object,
    errorMessage     : PT.string,
    errorStatus      : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(EditCase)
);
