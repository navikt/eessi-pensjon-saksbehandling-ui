import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';
import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.usercase.errorMessage,
        currentCase  : state.usercase.currentCase,
        loading      : state.loading,
        language     : state.ui.language
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class GetCase extends Component {

    constructor(props) {

        super(props);
        this.state = {};
    }

    onCaseIdChange (e) {

        this.setState({caseId: e.target.value});
    }

    onCaseHandlerChange (e) {

        this.setState({caseHandler: e.target.value});
    }

    onButtonClick() {

        const {actions} = this.props;
        actions.getCaseFromCaseNumber(this.state);
    }

    componentWillReceiveProps(nextProps) {

        const { history } = this.props;
        if (nextProps.currentCase && nextProps.currentCase.hasOwnProperty('casenumber')) {
            history.push('/case/get/' + nextProps.currentCase.casenumber);
        }
    }

    isButtonDisabled() {
        return !this.state.caseId && !this.state.caseHandler;
    }

    render() {

        const { t, errorMessage, loading } = this.props;

        let alert      = errorMessage ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let spinner    = loading && loading.getcase;
        let buttonText = spinner ? t('loading:getcase') : t('søk');

        return <TopContainer>
            <Nav.Panel className='panel'>
                <div>{t('content:getCaseDescription')}</div>
                <div className='mx-4 text-center'>
                    <div className='mt-4'>{alert}</div>
                    <div className='mt-4 text-left'>
                        <Nav.Input label={t('ui:caseId')} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
                    </div>
                    <div className='mt-4 text-left'>
                        <Nav.Input label={t('ui:caseHandler')} value={this.state.caseHandler} onChange={this.onCaseHandlerChange.bind(this)}/>
                    </div>
                    <div className='mt-4'>
                        <Nav.Hovedknapp spinner={spinner} disabled={this.isButtonDisabled()} onClick={this.onButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </div>
                </div>
            </Nav.Panel>
        </TopContainer>
    }
}

GetCase.propTypes = {
    currentCase  : PT.object,
    errorMessage : PT.string,
    loading      : PT.object,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GetCase)
);
