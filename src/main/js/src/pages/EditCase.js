import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
    return {
        currentCase  : state.usercase.currentCase,
        institution  : state.usercase.institution,
        buc          : state.usercase.buc,
        sed          : state.usercase.sed,
        toConfirm    : state.usercase.toConfirm,
        errorMessage : state.usercase.errorMessage,
        language     : state.ui.language,
        loading      : state.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class EditCase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sedDisabled: true
        };
    }

    componentWillMount() {

        const { actions, match, currentCase, institution, buc } = this.props;

        if (_.isEmpty(currentCase)) {
            let id = match.params.id;
            actions.getCaseFromCaseNumber({
                caseId: id
            });
        }

        if (_.isEmpty(institution)) {
            actions.getInstitutionOptions();
        }

        if (_.isEmpty(buc)) {
            actions.getBucOptions();
        }
    }

    componentWillReceiveProps(nextProps) {

        const { history } = this.props;

        if (nextProps.toConfirm) {
            history.push('/case/confirm');
        }
        if (nextProps.sed && !_.isEmpty(nextProps.sed)) {
            this.setState({sedDisabled: false})
        }
    }

    onBackButtonClick() {

        const { history } = this.props;
        history.goBack();
    }

    onButtonClick() {

        const { actions, currentCase } = this.props;

        actions.toConfirmChoices({
            'institution' : this.state.institution,
            'buc'         : this.state.buc,
            'sed'         : this.state.sed,
            'caseId'      : currentCase.casenumber
        });
    }

    onInstitutionChange(e) {

        this.setState({institution: e.target.value})
    }

    onBucChange(e) {

        const { actions } = this.props;
        let buc = e.target.value;
        this.setState({buc: buc})
        actions.getSedOptions(buc);
    }

    onSedChange(e) {

        this.setState({sed: e.target.value})
    }

    renderOptions(map) {
        let options;
        if (map[0] !== '--') {
            map.unshift('--');
        }
        options = map.map(el => {
            return <option key={el}>{el}</option>
        });
        return options;
    }

    renderInstitution() {

        const { t, institution } = this.props;
        let options;

        if (institution) {
            options = this.renderOptions(institution);
        }

        return <Nav.Select bredde='l' label={t('ui:institution')} value={this.state.institution} onChange={this.onInstitutionChange.bind(this)}>
            {options}
        </Nav.Select>
    }

    renderBuc() {

        const { t, buc } = this.props;
        let options;
        if (buc) {
            options = this.renderOptions(buc);
        }

        return <Nav.Select bredde='l' label={t('ui:buc')} value={this.state.buc} onChange={this.onBucChange.bind(this)}>
            {options}
        </Nav.Select>
    }

    renderSed() {

        const { t, sed } = this.props;
        let options;
        if (sed) {
            options = this.renderOptions(sed);
        }

        return <Nav.Select bredde='l' disabled={this.state.sedDisabled} label={t('ui:sed')} value={this.state.sed} onChange={this.onSedChange.bind(this)}>
            {options}
        </Nav.Select>
    }

    isButtonDisabled() {
        return !this.state.institution || this.state.institution === '--' ||
    !this.state.buc || this.state.buc === '--' ||
    !this.state.sed || this.state.sed === '--'
    }

    getSpinner(text) {

        const { t } = this.props;

        return <div className='ml-2'>
            <Nav.NavFrontendSpinner type='S' />
            <div className='float-right ml-2'>{t(text)}</div>
        </div>
    }

    render() {

        const { t, currentCase, errorMessage, loading } = this.props;

        let alert = currentCase ? <Nav.AlertStripe type='suksess'>{t('ui:caseFound') + ': ' + currentCase.casenumber}</Nav.AlertStripe>
            : <Nav.AlertStripe type='stopp'>{t('ui:caseNotFound')}</Nav.AlertStripe>;

        if (errorMessage) {
            alert = <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe>;
        }

        return <TopContainer>
            <Nav.Panel>
                <div>{t('content:editCaseDescription')}</div>
                <div className='mx-4 text-center'>
                    <div className='mt-4'>{alert}</div>
                    <div className='mt-4 align-middle text-left'>
                        <div className='d-inline-block'>{this.renderInstitution()}</div>
                        <div className='d-inline-block'>
                            {loading && loading.institution ? this.getSpinner('loading:institution'): null}
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
                    <div className='mt-4'>
                        <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('tilbake')}</Nav.Knapp>
                        <Nav.Hovedknapp disabled={this.isButtonDisabled()} onClick={this.onButtonClick.bind(this)}>{t('go')}</Nav.Hovedknapp>
                    </div>
                </div>
            </Nav.Panel>
        </TopContainer>;
    }
}
EditCase.propTypes = {
    currentCase  : PropTypes.object,
    actions      : PropTypes.object,
    history      : PropTypes.object,
    loading      : PropTypes.object,
    t            : PropTypes.func,
    match        : PropTypes.object,
    institution  : PropTypes.object,
    sed          : PropTypes.object,
    buc          : PropTypes.object,
    toConfirm    : PropTypes.object,
    errorMessage : PropTypes.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(EditCase)
);
