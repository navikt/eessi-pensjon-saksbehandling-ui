import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import './PInfo.css';

import Icons from '../../components/ui/Icons';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import EventForm from '../../components/p4000/EventForm/EventForm';
import * as Menu from '../../components/p4000/menu/';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as pinfoActions from '../../actions/pinfo';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        form : state.pinfo.form
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions), dispatch)};
};

class PInfo extends Component {

    state = {
        isLoaded: false,
        step: 0,
        maxstep: 6
    };

    componentDidMount() {

        this.setState({
            isLoaded : true
        })
    }

    onBackButtonClick() {
        this.setState({
            step: this.state.step - 1
        });
    }

    onForwardButtonClick() {
        this.setState({
            step: this.state.step + 1
        });
    }

    onSaveButtonClick() {
        this.setState({
            step: this.state.step + 1
        });
    }

    noValidationErrors() {
        return true;
    }

    render() {

        const { t, form, history } = this.props;

        if (!this.state.isLoaded) {
            return null;
        }

        let steg = [
           {label: t('pinfo:form-step1'), aktiv: this.state.step === 0},
           {label: t('pinfo:form-step2'), aktiv: this.state.step === 1},
           {label: t('pinfo:form-step3'), aktiv: this.state.step === 2},
           {label: t('pinfo:form-step4'), aktiv: this.state.step === 3},
           {label: t('pinfo:form-step5'), aktiv: this.state.step === 4},
           {label: t('pinfo:form-step6'), aktiv: this.state.step === 5},
           {label: t('pinfo:form-step7'), aktiv: this.state.step === 6}
       ]
        console.log(steg);

        return <TopContainer className='pInfo topContainer'>
            <Nav.Row>
                <div className='col-md-5 col-lg-4'>
                    <h1 className='mt-4 ml-3 mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('pinfo:app-title')}
                    </h1>
                </div>
                <div className='col-md-7 col-lg-8'>
                    <ClientAlert className='mt-3'/>
                </div>
            </Nav.Row>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <Nav.Stegindikator
                        aktivtSteg={this.state.step}
                        visLabel={true}
                        onBeforeChange={() => {return false}}
                        autoResponsiv={true}
                        steg={steg}/>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                {this.state.step === 0 ? <div>
                <div>Utenlandsk bank- og kontoinformasjon</div>
                <div>Bank name</div>
                <div>Bank address</div>
                <div>Bank country</div>
                <div>Bic/swift</div>
                <div>IBAN/kontonummer</div>
                </div> : null}

                {this.state.step === 1 ? <div>
                <div>Kontaktinformasjon</div>
                <div>Epost</div>
                <div>Mobil</div>
                </div> : null}

                {this.state.step === 2 ? <div>
                <div>Nåværende arbeids- og inntektssituasjon</div>
                <div>Arbeid</div>
                <div>yrke</div>
                <div><label>Ansettelsesforhold</label><select/></div>
                <div><label>Startdato</label><input/></div>
                </div> : null}

                {this.state.step === 3 ? <div>
                <div>Vedlegg</div>
                </div> : null}

                {this.state.step === 4 ? <div>
                <div>Hvilke land ønsker du å søke pensjon fra</div>
                <div><label>Land</label><select/></div>
                </div> : null}
            </div>

            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    {this.state.step !== 0 ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp> : null}
                </Nav.Column>
                <Nav.Column>
                    {this.state.step !== 6 ?
                    <Nav.Hovedknapp className='forwardButton w-100' disabled={!this.noValidationErrors()} onClick={this.onForwardButtonClick.bind(this)}>{t('ui:forward')}</Nav.Hovedknapp>
                    : <Nav.Hovedknapp className='sendButton w-100' disabled={!this.noValidationErrors()} onClick={this.onSaveButtonClick.bind(this)}>{t('ui:save')}</Nav.Hovedknapp> }
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

PInfo.propTypes = {
    history      : PT.object,
    t            : PT.func,
    form         : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(PInfo)
);
