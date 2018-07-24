import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import Icons from '../ui/Icons';
import './custom-event.css';

class Event extends Component {

    editEvent(index) {

        const { history } = this.props;
        history.push('/react/p4000/edit/' + index);
    }

    render() {

        const { event, index, selected } = this.props;

        return <div className={classNames('d-inline-block','mr-3','event', { selected: selected })}
            onClick={selected ? null : this.editEvent.bind(this, index)}>
            <Icons kind={event.type}/>
            <div className='eventDate'>{event.startDate.year}/{event.startDate.month} - {event.endDate.year}/{event.endDate.month}</div>
        </div>
    }
}

Event.propTypes = {
    event    : PT.object.isRequired,
    index    : PT.number.isRequired,
    selected : PT.bool.isRequired,
    history  : PT.object
};

export default withRouter(Event);
