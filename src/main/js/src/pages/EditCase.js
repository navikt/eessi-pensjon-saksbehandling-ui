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
        errorMessage    : state.usercase.errorMessage,
        errorStatus     : state.usercase.errorStatus,
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
            validation: {}
        };
    }

    componentWillMount() {

        const { actions, match, currentCase, institutionList, bucList, subjectAreaList, countryList } = this.props;

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
            history.push('/case/get');
        }

        if (nextProps.dataToConfirm) {
            history.push('/case/confirm');
        }
    }

    onBackButtonClick() {

        const { history } = this.props;
        history.goBack();
    }

    onForwardButtonClick() {

        const { actions, currentCase } = this.props;

        actions.dataToConfirm({
            'institutions' : this.state.institutions,
            'buc'          : this.state.buc,
            'sed'          : this.state.sed,
            'subjectArea'  : this.state.subjectArea,
            'caseId'       : currentCase.casenumber
        });
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
        this.setValidationState(key, undefined);
    }

    setValidationState(key, value) {

        this.setState({
            validation: Object.assign(this.state.validation, {[key]: value})
        });
    }

    onSubjectAreaChange(e) {

        const { t } = this.props;

        let subjectArea = e.target.value;
        this.setState({subjectArea: subjectArea});

        if (subjectArea === '--') {
            this.setValidationState('subjectAreaFail', t('validation:chooseSubjectArea'));
        } else {
            this.resetValidationState('subjectAreaFail');
        }
    }

    onBucChange(e) {

        const { t, actions } = this.props;

        let buc = e.target.value;
        this.setState({buc: buc});

        if (buc === '--') {
             this.setValidationState('bucFail', t('validation:chooseBuc'));
        } else {
             this.resetValidationState('bucFail');
              actions.getSedOptions(buc);
        }
    }

    onSedChange(e) {

        const { t } = this.props;

        let sed = e.target.value;
        this.setState({sed: sed})

        if (sed === '--') {
            this.setValidationState('sedFail', t('validation:chooseSed'));
        } else {
             this.resetValidationState('sedFail');
        }
    }

    onInstitutionChange(e) {
        const { t } = this.props;

        let institution = e.target.value;
        this.setState({institution: institution})

        if (institution === '--') {
            this.setValidationState('institutionFail', t('validation:chooseInstitution'));
        } else {
            this.resetValidationState('institutionFail');
        }
    }

    onCountryChange(e) {
        const { t } = this.props;

        let country = e.target.value;
        this.setState({country: country})

        if (country === '--') {
            this.setValidationState('countryFail', t('validation:chooseCountry'));
        } else {
            this.resetValidationState('countryFail');
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

        return <Nav.Select bredde='l' feil={this.state.validation.subjectAreaFail ? {feilmelding: this.state.validation.subjectAreaFail} : null}
            label={t('ui:subjectArea')} value={this.state.subjectArea} onChange={this.onSubjectAreaChange.bind(this)}>
            {this.renderOptions(subjectAreaList)}
        </Nav.Select>
    }

    renderCountry(currentValue) {

        const { t, countryList } = this.props;

        return <Nav.Select bredde='l' feil={this.state.validation.countryFail ? {feilmelding: this.state.validation.countryFail} : null}
            label={t('ui:country')} value={currentValue} onChange={this.onCountryChange.bind(this)}>
            {this.renderOptions(countryList)}
        </Nav.Select>
    }

    renderInstitution(currentValue) {

        const { t, institutionList } = this.props;

        return <Nav.Select bredde='l' feil={this.state.validation.institutionFail ? {feilmelding: this.state.validation.institutionFail} : null}
            label={t('ui:institution')} value={currentValue} onChange={this.onInstitutionChange.bind(this)}>
            {this.renderOptions(institutionList)}
        </Nav.Select>
    }

    renderBuc() {

        const { t, bucList } = this.props;

        return <Nav.Select bredde='l' feil={this.state.validation.bucFail ? {feilmelding: this.state.validation.bucFail} : null}
            label={t('ui:buc')} value={this.state.buc} onChange={this.onBucChange.bind(this)}>
            {this.renderOptions(bucList)}
        </Nav.Select>
    }

    renderSed() {

        const { t, sedList, bucList } = this.props;

        return <Nav.Select bredde='l' feil={this.state.validation.sedFail? {feilmelding: this.state.validation.sedFail} : null}
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
                <Nav.Knapp type='standard' onClick={this.onRemoveInstitutionButtonClick.bind(this, institution)}>{t('remove')}</Nav.Knapp>
            </Nav.Column>
            <Nav.Column/>
        </Nav.Row>;
    }

    renderInstitutions() {

        const { t } = this.props;

        let renderedInstitutions = [];

        for (var i in this.state.institutions) {
            let institution = this.state.institutions[i];
            renderedInstitutions.push(this.renderChosenInstitution(institution));
        }

        renderedInstitutions.push(<Nav.Row className='mt-4'>
            <Nav.Column>
                {this.renderCountry()}
            </Nav.Column>
            <Nav.Column>
                {this.renderInstitution()}
            </Nav.Column>
            <Nav.Column style={{lineHeight: '6rem'}}>
                <Nav.Knapp type='standard' onClick={this.onCreateInstitutionButtonClick.bind(this)}>{t('create')}</Nav.Knapp>
            </Nav.Column>
        </Nav.Row>);

        return renderedInstitutions.map(i => { return i});
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

        let disabledForwardButton = Object.keys(this.state.validation).length !== 0;

        return <TopContainer>
            <Nav.Panel>
                <div>{t('content:editCaseDescription')}</div>
                <div className='mx-4 text-center'>
                    <div className='mt-4'>{alert}</div>
                    <div className='mt-4 align-middle text-left'>
                        <div className='d-inline-block'>{this.renderSubjectArea()}</div>
                        <div className='d-inline-block'>
                            {loading && loading.subjectArea ? this.getSpinner('loading:subjectArea'): null}
                        </div>
                    </div>

                    <div className='mt-4 align-middle text-left'>
                        <div className='d-inline-block'>{this.renderBuc()}</div>
                        <div className='d-inline-block'>
                            {loading && loading.buc ? this.getSpinner('loading:buc') : null}
                        </div>
                    </div>
                    <div className='mt-4 align-middle text-left'>
                        <div className='d-inline-block'>{this.renderSed()}</div>
                        <div className='d-inline-block'>
                            {loading && loading.sed ? this.getSpinner('loading:sed') : null}
                        </div>
                    </div>
                    <div className='mt-4 align-middle text-left'>
                        {this.renderInstitutions()}
                    </div>
                    <div className='mt-4'>
                        <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('tilbake')}</Nav.Knapp>
                        <Nav.Hovedknapp disabled={disabledForwardButton} onClick={this.onForwardButtonClick.bind(this)}>{t('go')}</Nav.Hovedknapp>
                    </div>
                </div>
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
