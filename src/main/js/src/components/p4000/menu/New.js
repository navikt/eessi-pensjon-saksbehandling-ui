import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as p4000Actions from '../../../actions/p4000';

import * as Nav from '../../ui/Nav';
import Icons from '../../ui/Icons';

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const events = [
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

    render() {

        const { t } = this.props;

        return <Nav.Panel>
            <Nav.Row className='eventTitle mb-4 fieldset'>
                <Nav.Column>
                    <h1 className='mt-3 mb-3'>{t('ui:new')}{' '}{t('p4000:type-event')}</h1>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                        {events.map(e => {
                            return <Nav.Knapp title={t(e.description)} className='bigButton'
                                key={e.value} onClick={this.handleEventSelect.bind(this, e.value)}>
                                <div>
                                    <Icons size='4x' kind={e.icon}/>
                                </div>
                                <div className='mt-3'>{t(e.label)}</div>
                            </Nav.Knapp>
                        })}
                    </div>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventTitle mb-4 fieldset'>
                <Nav.Column>
                    <h1 className='mt-3 mb-3'>{t('ui:options')}</h1>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <Nav.Knapp className='bigButton' style={{marginRight: '10px' }} onClick={this.handleEventSelect.bind(this, 'view')}>
                            <div>
                                <Icons size='4x' className='mr-3' kind={'file'}/>
                                <Icons size='3x' kind={'view'}/>
                            </div>
                            <div className='mt-3'>{t('ui:view')}</div>
                        </Nav.Knapp>
                    </div>
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

New.propTypes = {
    t                 : PT.func.isRequired,
    actions           : PT.object.isRequired,
    provideController : PT.func.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(New)
);
