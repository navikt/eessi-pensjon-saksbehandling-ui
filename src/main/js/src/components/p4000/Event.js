import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';

import * as p4000Actions from '../../actions/p4000';
import Icons from '../ui/Icons';
import './custom-event.css';

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Event extends Component {

    editEvent(eventIndex) {

        const { actions } = this.props;
        actions.editEvent(eventIndex);
    }

    render() {

        const { event, eventIndex, selected } = this.props;

        return <div className={classNames('d-inline-block','mr-3','event', { selected: selected })}
            onClick={selected ? null : this.editEvent.bind(this, eventIndex)}>
            <Icons kind={event.type}/>
            <div className='eventDate'>{event.startDate.year}/{event.startDate.month} - {event.endDate.year}/{event.endDate.month}</div>
        </div>
    }
}

Event.propTypes = {
    event      : PT.object.isRequired,
    eventIndex : PT.number.isRequired,
    selected   : PT.bool.isRequired,
    actions    : PT.object.isRequired
};

export default connect(
    null,
    mapDispatchToProps
)(Event);
