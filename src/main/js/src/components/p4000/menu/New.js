import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';

import * as p4000Actions from '../../../actions/p4000';

import FileUpload from '../../ui/FileUpload/FileUpload';
import CountrySelect from '../CountrySelect/CountrySelect';
import DatePicker from '../DatePicker/DatePicker';
import Validation from '../Validation';
import * as Nav from '../../ui/Nav';
import Icons from '../../ui/Icons';

const mapStateToProps = (state) => {
    return {
        event    : state.p4000.event,
        editMode : state.p4000.editMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const events = [
    {label: 'p4000:menu-work',      value: 'work',      icon: 'work'},
    {label: 'p4000:menu-home',      value: 'home',      icon: 'home'},
    {label: 'p4000:menu-child',     value: 'child',     icon: 'child'},
    {label: 'p4000:menu-voluntary', value: 'voluntary', icon: 'voluntary'},
    {label: 'p4000:menu-military',  value: 'military',  icon: 'military'},
    {label: 'p4000:menu-birth',     value: 'birth',     icon: 'birth'},
    {label: 'p4000:menu-learn',     value: 'learn',     icon: 'learn'},
    {label: 'p4000:menu-daily',     value: 'daily',     icon: 'daily'},
    {label: 'p4000:menu-sick',      value: 'sick',      icon: 'sick'},
    {label: 'p4000:menu-other',     value: 'other',     icon: 'other'}
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

        const { t, event, editMode, actions, type } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{t('ui:new')}{' '}{t('p4000:menu-event')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    {events.map(e => {
                        return <Nav.Knapp style={{width: '200px', height: '120px', marginRight: '10px' }} onClick={this.handleEventSelect.bind(this, e.value)} >
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
                        <div className='mt-3'>{t('p4000:menu-view')}</div>
                        </Nav.Knapp>
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

New.propTypes = {
    t                 : PT.func.isRequired,
    event             : PT.object.isRequired,
    type              : PT.string.isRequired,
    editMode          : PT.bool.isRequired,
    actions           : PT.object.isRequired,
    provideController : PT.func.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(New)
);
