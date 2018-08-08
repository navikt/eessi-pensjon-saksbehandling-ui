import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as p4000Actions from '../../../actions/p4000';

import * as Nav from '../../ui/Nav';
import Icons from '../../ui/Icons';

const mapStateToProps = () => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const events = [
    {label: 'p4000:type-work',      value: 'work',      icon: 'work'},
    {label: 'p4000:type-home',      value: 'home',      icon: 'home'},
    {label: 'p4000:type-child',     value: 'child',     icon: 'child'},
    {label: 'p4000:type-voluntary', value: 'voluntary', icon: 'voluntary'},
    {label: 'p4000:type-military',  value: 'military',  icon: 'military'},
    {label: 'p4000:type-birth',     value: 'birth',     icon: 'birth'},
    {label: 'p4000:type-learn',     value: 'learn',     icon: 'learn'},
    {label: 'p4000:type-daily',     value: 'daily',     icon: 'daily'},
    {label: 'p4000:type-sick',      value: 'sick',      icon: 'sick'},
    {label: 'p4000:type-other',     value: 'other',     icon: 'other'}
];

class New extends Component {

    state = {}

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
    }

    hasNoValidationErrors() {
        return true;
    }

    resetValidation() {

    }

    passesValidation() {

        return new Promise((resolve) => {
            resolve();
        });
    }

    render() {

        const { t } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{t('ui:new')}{' '}{t('p4000:type-event')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    {events.map(e => {
                        return <Nav.Knapp key={e.value} style={{width: '200px', height: '120px', marginRight: '10px' }} onClick={this.handleEventSelect.bind(this, e.value)} >
                            <div>
                                <Icons size='4x' kind={e.icon}/>
                            </div>
                            <div className='mt-3'>{t(e.label)}</div>
                        </Nav.Knapp>
                    })}
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{t('ui:options')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <Nav.Knapp style={{width: '200px', height: '120px', marginRight: '10px' }} onClick={this.handleEventSelect.bind(this, 'view')}>
                        <div>
                            <Icons size='4x' className='mr-3' kind={'file'}/>
                            <Icons size='3x' kind={'view'}/>
                        </div>
                        <div className='mt-3'>{t('ui:view')}</div>
                    </Nav.Knapp>
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
