import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import _ from 'lodash';
import { translate } from 'react-i18next';

import StepIndicator from '../../components/case/StepIndicator';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        subjectAreaList : state.usercase.subjectAreaList,
        institutionList : state.usercase.institutionList,
        bucList         : state.usercase.bucList,
        sedList         : state.usercase.sedList,
        countryList     : state.usercase.countryList,
        currentCase     : state.usercase.currentCase,
        dataToConfirm   : state.usercase.dataToConfirm,
        errorMessage    : state.error.clientErrorMessage,
        errorStatus     : state.error.clientErrorStatus,
        language        : state.ui.language,
        action          : state.ui.action,
        loading         : state.loading
    };
};


const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, uiActions), dispatch)};
};

class EditCase extends Component {

    state = {
        institutions: [],
        validation: {},
        defaultSelects: {
            subjectArea: 'chooseSubjectArea',
            buc: 'chooseBuc',
            sed: 'chooseSed',
            institution: 'chooseInstitution',
            country: 'allCountries'
        }
    };

    componentDidMount() {

        const { actions, match, currentCase, institutionList, bucList, subjectAreaList, countryList, dataToConfirm, action } = this.props;

        if (_.isEmpty(currentCase)) {
            let caseId = match.params.caseid;
            let actorId = match.params.actorid;
            actions.getCaseFromCaseNumber({
                caseId  : caseId,
                actorId : actorId
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

        if (dataToConfirm && action === 'back') {

            this.setState({
                'institutions' : dataToConfirm.institutions,
                'buc'          : dataToConfirm.buc,
                'sed'          : dataToConfirm.sed,
                'subjectArea'  : dataToConfirm.subjectArea
            });
        }
    }

    componentDidUpdate() {

        const { history, loading, currentCase, dataToConfirm, action } = this.props;

        if ( !loading.gettingCase && !currentCase) {
            history.push('/react/case/get');
        }

        if (dataToConfirm && action === 'forward') {
            history.push('/react/case/confirm');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        actions.clearCurrentCase();
        history.push('/react/case/get');
    }

    onForwardButtonClick() {

        const { actions, currentCase } = this.props;

        this.performAllValidations();

        if (this.noValidationErrors()) {

            actions.navigateForward();
            actions.dataToConfirm({
                'institutions' : this.state.institutions,
                'buc'          : this.state.buc,
                'sed'          : this.state.sed,
                'subjectArea'  : this.state.subjectArea,
                'caseId'       : currentCase.casenumber,
                'actorId'      : currentCase.pinid
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
        if (!subjectArea || subjectArea === this.state.defaultSelects.subjectArea) {
            this.setValidationState('subjectAreaFail', t('case:validationChooseSubjectArea'));
        } else {
            this.resetValidationState('subjectAreaFail');
        }
    }

    validateBuc(buc) {

        const { t } = this.props;
        if (!buc || buc === this.state.defaultSelects.buc) {
            this.setValidationState('bucFail', t('case:validationChooseBuc'));
        } else {
            this.resetValidationState('bucFail');
        }
    }

    validateSed(sed) {

        const { t } = this.props;
        if (!sed || sed === this.state.defaultSelects.sed) {
            this.setValidationState('sedFail', t('case:validationChooseSed'));
        } else {
            this.resetValidationState('sedFail');
        }
    }

    validateInstitutions(institutions) {

        const { t } = this.props;
        if (!institutions || Object.keys(institutions).length === 0) {
            this.setValidationState('institutionaFail', t('case:validationChooseInstitutions'));
        } else {
            this.resetValidationState('institutionsFail');
        }
    }

    validateInstitution(institution) {

        const { t } = this.props;
        if (!institution || institution === this.state.defaultSelects.institution) {
            this.setValidationState('institutionFail', t('case:validationChooseInstitution'));
        } else {
            this.resetValidationState('institutionFail');
        }
    }

    validateCountry(country) {
        // nothing to do here, country is optional, any value is OK
    }

    onCreateInstitutionButtonClick() {

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
        this.setState({country: country, institution: undefined})
        this.validateCountry(country);
        if (!this.state.validation.countryFail) {
            if (country !== this.state.defaultSelects.country) {
                actions.getInstitutionListForCountry(country);
            } else {
                actions.getInstitutionList();
            }
        }
    }

    renderOptions(map, type) {

        const { t } = this.props;

        if (!map || Object.keys(map).length === 0) {
            map = [{
                key: this.state.defaultSelects[type],
                value: t('case:' + this.state.defaultSelects[type])
            }];
        }

        if (!map[0].key || (map[0].key && map[0].key !== this.state.defaultSelects[type])) {
            map.unshift({
                key: this.state.defaultSelects[type],
                value: t('case:' + this.state.defaultSelects[type])
            });
        }
        return map.map(el => {
            if (typeof el === 'string') {
                return <option value={el} key={el}>{el}</option>
            } else {
                return <option value={el.key} key={el}>{el.value}</option>
            }
        });
    }

    renderSubjectArea() {

        const { t, subjectAreaList } = this.props;

        return <Nav.Select className='subjectAreaList' bredde='xxl' feil={this.state.validation.subjectAreaFail ? {feilmelding: this.state.validation.subjectAreaFail} : null}
            label={t('case:subjectArea')} value={this.state.subjectArea} onChange={this.onSubjectAreaChange.bind(this)}>
            {this.renderOptions(subjectAreaList, 'subjectArea')}
        </Nav.Select>
    }

    renderCountry(currentValue) {

        const { t, countryList } = this.props;

        return <Nav.Select className='countryList' bredde='xxl' feil={this.state.validation.countryFail ? {feilmelding: this.state.validation.countryFail} : null}
            label={t('case:country')} value={currentValue} onChange={this.onCountryChange.bind(this)}>
            {this.renderOptions(countryList, 'country')}
        </Nav.Select>
    }

    renderInstitution(currentValue) {

        const { t, institutionList } = this.props;

        return <Nav.Select className='institutionList' bredde='xxl' feil={this.state.validation.institutionFail ? {feilmelding: this.state.validation.institutionFail} : null}
            label={t('case:institution')} value={currentValue} onChange={this.onInstitutionChange.bind(this)}>
            {this.renderOptions(institutionList, 'institution')}
        </Nav.Select>
    }

    renderBuc() {

        const { t, bucList } = this.props;

        return <Nav.Select className='bucList' bredde='xxl' feil={this.state.validation.bucFail ? {feilmelding: this.state.validation.bucFail} : null}
            label={t('case:buc')} value={this.state.buc} onChange={this.onBucChange.bind(this)}>
            {this.renderOptions(bucList, 'buc')}
        </Nav.Select>
    }

    renderSed() {

        const { t, sedList, bucList } = this.props;

        return <Nav.Select className='sedList' bredde='xxl' feil={this.state.validation.sedFail? {feilmelding: this.state.validation.sedFail} : null}
            disabled={!bucList} label={t('case:sed')} value={this.state.sed} onChange={this.onSedChange.bind(this)}>
            {this.renderOptions(sedList, 'sed')}
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

        let renderedInstitution = (institution.country && institution.country !== this.state.defaultSelects.country ? institution.country + '/' : '') + institution.institution;

        return <Nav.Row key={renderedInstitution} className='mt-2 renderedInstitutions'>
            <Nav.Column style={{lineHeight: '2rem'}}>
                <div className='renderedInstitution'><b>{renderedInstitution}</b></div>
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

        let validInstitution = (!this.state.validation.countryFail && !this.state.validation.institutionFail) && this.state.institution;

        renderedInstitutions.push(<Nav.Row key={'newInstitution'} className='mt-4'>
            <Nav.Column className='col-sm'>
                <div>{this.renderCountry()}</div>
                <div className='mt-4'>
                    <Nav.HjelpetekstBase className='d-inline-block' id='country' type='under'>{t('case:helpCountry')}</Nav.HjelpetekstBase>
                    <div className='d-inline-block'>{loading && loading.countryList ? this.getSpinner('case:loadingCountry'): null}</div>
                </div>
            </Nav.Column>
            <Nav.Column className='col-sm'>
                <div>{this.renderInstitution()}</div>
                <div className='mt-4'>
                    <Nav.HjelpetekstBase className='d-inline-block' id='institution' type='under'>{t('case:helpInstitution')}</Nav.HjelpetekstBase>
                    <div className='d-inline-block'>{loading && loading.institutionList ? this.getSpinner('case:loadingInstitution'): null}</div>
                </div>
            </Nav.Column>
            <Nav.Column className='col-sm' style={{lineHeight: '6rem'}}>
                <Nav.Hovedknapp className='createInstitutionButton' disabled={!validInstitution} onClick={this.onCreateInstitutionButtonClick.bind(this)}>{t('ui:create')}</Nav.Hovedknapp>
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

        const { t, currentCase, errorMessage, errorStatus, action, loading } = this.props;

        if (!currentCase) {
            return null;
        }

        let alert = (action === 'forward' ? <Nav.AlertStripe type='suksess'>{t('case:caseFound') + ': ' + currentCase.casenumber}</Nav.AlertStripe> : null);

        if (errorStatus) {
            alert = <Nav.AlertStripe type='stopp'>{t(errorMessage)}</Nav.AlertStripe>;
        }

        return <TopContainer>
            <Nav.Panel>
                <Nav.Row className='mt-4'>
                   <Nav.Column>
                       <h1 className='mt-3 appTitle'>{t('case:editCaseTitle')}</h1>
                       <h4>{t('case:editCaseDescription')}</h4>
                   </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>
                        <StepIndicator activeStep={0}/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 align-middle text-left'>
                    <Nav.Column>{this.renderSubjectArea()}</Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase className='d-inline-block' id='subjectArea' type='under'>{t('case:helpSubjectArea')}</Nav.HjelpetekstBase>
                        <div className='d-inline-block'>{loading && loading.subjectAreaList ? this.getSpinner('case:loadingSubjectArea'): null}</div>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-1 align-middle text-left'>
                    <Nav.Column>{this.renderBuc()}</Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase className='d-inline-block' id='buc' type='under'>{t('case:helpBuc')}</Nav.HjelpetekstBase>
                        <div className='d-inline-block'>{loading && loading.bucList ? this.getSpinner('case:loadingBuc') : null}</div>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-1 align-middle text-left'>
                    <Nav.Column>{this.renderSed()}</Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase className='d-inline-block' id='sed' type='under'>{t('case:helpSed')}</Nav.HjelpetekstBase>
                        <div className='d-inline-block'>{loading && loading.sedList ? this.getSpinner('case:loadingSed') : null}</div>
                    </Nav.Column>
                </Nav.Row>
                {this.renderInstitutions()}
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        {action === 'forward' ? <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp> : null}
                        <Nav.Hovedknapp className='forwardButton' disabled={!this.noValidationErrors()} onClick={this.onForwardButtonClick.bind(this)}>{t('ui:go')}</Nav.Hovedknapp>
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
    action           : PT.string,
    subjectAreaList  : PT.array,
    institutionList  : PT.array,
    countryList      : PT.array,
    sedList          : PT.array,
    bucList          : PT.array,
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
