import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';

import * as Nav from '../../../ui/Nav';
import Icons from '../../../ui/Icons';
import SubmitButton from '../../Buttons/SubmitButton';
import SaveToServerButton from '../../Buttons/SaveToServerButton';
import SaveToFileButton from '../../Buttons/SaveToFileButton';
import ViewButton from '../../Buttons/ViewButton';

import * as routes from '../../../../constants/routes';
import * as p4000Actions from '../../../../actions/p4000';
import * as uiActions from '../../../../actions/ui';

import './New.css';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch)};
};

const eventList = [
    {label: 'p4000:type-work',      description: 'p4000:type-work-description',      value: 'work',      icon: 'work'},
    {label: 'p4000:type-home',      description: 'p4000:type-home-description',      value: 'home',      icon: 'home'},
    {label: 'p4000:type-child',     description: 'p4000:type-child-description',     value: 'child',     icon: 'child'},
    {label: 'p4000:type-voluntary', description: 'p4000:type-voluntary-description', value: 'voluntary', icon: 'voluntary'},
    {label: 'p4000:type-military',  description: 'p4000:type-military-description',  value: 'military',  icon: 'military'},
    {label: 'p4000:type-birth',     description: 'p4000:type-birth-description',     value: 'birth',     icon: 'birth'},
    {label: 'p4000:type-learn',     description: 'p4000:type-learn-description',     value: 'learn',     icon: 'learn'},
    {label: 'p4000:type-daily',     description: 'p4000:type-daily-description',     value: 'daily',     icon: 'daily'},
    {label: 'p4000:type-sick',      description: 'p4000:type-sick-description',      value: 'sick',      icon: 'sick'},
    {label: 'p4000:type-other',     description: 'p4000:type-other-description',     value: 'other',     icon: 'other'}
];

class New extends Component {

    state = {
        submitted: false
    }

    handleEventSelect(newPage) {

        const { actions } = this.props;
        actions.setPage(newPage);
    }

    componentDidMount() {
        this.props.provideController({
            hasNoValidationErrors : this.hasNoValidationErrors.bind(this),
            passesValidation      : this.passesValidation.bind(this),
            resetValidation       : this.resetValidation.bind(this)
        });
        window.scrollTo(0,0);
    }

    componentDidUpdate() {

        const { history, dataSaved } = this.props;

        if (this.state.submitted && dataSaved ) {

            history.push(routes.ROOT + '?rinaId=' + dataSaved.euxcaseid);
        }
    }

    hasNoValidationErrors() {
        return true;
    }

    resetValidation() {
        return new Promise((resolve) => {
            resolve();
        });
    }

    passesValidation() {

        return new Promise((resolve) => {
            resolve();
        });
    }

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    render() {

        const { t } = this.props;

        return <Nav.Panel className='c-p4000-menu-new mt-4 mb-4 p-0'>
            <div>
                <a className='hiddenFileInputOutput' ref={fileOutput => this.fileOutput = fileOutput}
                    href={this.state.fileOutput} download='p4000.json'>&nbsp;</a>
            </div>
            <div className='fieldset animate'>
                <Nav.HjelpetekstBase>{t('p4000:help-new-event')}</Nav.HjelpetekstBase>
                <h1 className='m-0 mb-4'>{t('ui:new')}{' '}{t('p4000:type-event')}</h1>
                <div className='bigButtons'>
                    {eventList.map((e, index) => {
                        return <Nav.Knapp style={{animationDelay: index * 0.04 + 's'}}
                            title={t(e.description)} className={classNames('bigButton', e.value + 'Button')}
                            key={e.value} onClick={this.handleEventSelect.bind(this, e.value)}>
                            <div>
                                <Icons size='4x' kind={e.icon}/>
                            </div>
                            <div className='mt-3'>{t(e.label)}</div>
                        </Nav.Knapp>
                    })}
                </div>
            </div>
            <div style={{animationDelay: '0.3s'}} className='fieldset animate'>
                <Nav.HjelpetekstBase>{t('p4000:help-new-options')}</Nav.HjelpetekstBase>
                <h1 className='m-0 mb-4'>{t('ui:options')}</h1>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <ViewButton style={{animationDelay: '0.34s'}} />
                    <SaveToFileButton style={{animationDelay: '0.38s'}} />
                    <SaveToServerButton style={{animationDelay: '0.42s'}} />
                    <SubmitButton style={{animationDelay: '0.46s'}} />
                </div>
            </div>
        </Nav.Panel>
    }
}

New.propTypes = {
    t                 : PT.func.isRequired,
    actions           : PT.object.isRequired,
    history           : PT.object.isRequired,
    provideController : PT.func.isRequired,
    events            : PT.array,
    dataSaved         : PT.object,
    dataToConfirm     : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(New)
);
