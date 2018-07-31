import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import * as p4000Actions from '../../actions/p4000';
import Icons from '../ui/Icons';
import './custom-event.css';

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Event extends Component {

    renderDate(date) {

        const { t } = this.props;
        if (!date) {
            return t('ui:unknown');
        }
        let mm = date.getMonth() + 1; // getMonth() is zero-based
        let dd = date.getDate();
        return [date.getFullYear(), (mm > 9 ? '' : '0') + mm,  (dd > 9 ? '' : '0') + dd].join('.');
    }

    render() {

        const { event, selected, onClick } = this.props;

        return <div className={classNames('d-inline-block','mr-3','eventBadge', { selected: selected })}
            onClick={onClick}>
            <Icons kind={event.type}/>
            <div className='eventBadgeDate'>
                <div>{this.renderDate(event.startDate)}</div>
                <div>{this.renderDate(event.endDate)}</div>
            </div>
        </div>
    }
}

Event.propTypes = {
    t          : PT.func.isRequired,
    event      : PT.object.isRequired,
    eventIndex : PT.number.isRequired,
    selected   : PT.bool.isRequired,
    actions    : PT.object.isRequired,
    onClick    : PT.func.isRequired
};

export default connect(
    null,
    mapDispatchToProps
)(
    translate()(Event)
);
