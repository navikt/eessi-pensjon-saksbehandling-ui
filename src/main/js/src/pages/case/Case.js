import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import * as Nav from '../../components/ui/Nav';
import Icons from '../../components/ui/Icons';
import TopContainer from '../../components/ui/TopContainer';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as usercaseActions from '../../actions/usercase';
import * as alertActions from '../../actions/alert';

import './Case.css';

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, alertActions), dispatch)};
};

class Case extends Component {


    backToMenu () {

        const { history, actions }  = this.props;

        actions.clearData();
        actions.clientClear();

        history.push('/');
    }

    render() {

        const { t, children, title, description, stepIndicator, className} = this.props;

        return <TopContainer className={classNames('case','topContainer', className)}>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mb-3 appTitle'>
                        <Icons size={'lg'} title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={this.backToMenu.bind(this)}/>
                        {t(title)}
                    </h1>
                    { description ? <h4 className='mb-3 appDescription'>{t(description)}</h4> : null }
                    <ClientAlert permanent={true}/>
                    { stepIndicator !== undefined ? <Nav.Stegindikator
                        visLabel={true}
                        onBeforeChange={() => {return false}}
                        autoResponsiv={true}
                        steg={[
                            {label: t('case:form-step1'), aktiv: (stepIndicator === 0)},
                            {label: t('case:form-step2'), aktiv: (stepIndicator === 1)},
                            {label: t('case:form-step3'), aktiv: (stepIndicator === 2)},
                            {label: t('case:form-step4'), aktiv: (stepIndicator === 3)},
                            {label: t('case:form-step5'), aktiv: (stepIndicator === 4)}
                        ]}/> : null }
                </Nav.Column>
            </Nav.Row>
            {children}
        </TopContainer>
    }
}

Case.propTypes = {
    title         : PT.string.isRequired,
    description   : PT.string,
    stepIndicator : PT.number,
    actions       : PT.object,
    history       : PT.object.isRequired,
    t             : PT.func,
    className     : PT.string,
    children      : PT.oneOfType([PT.array, PT.object]).isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Case)
);
