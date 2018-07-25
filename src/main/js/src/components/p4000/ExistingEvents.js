import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import Event from './Event';

class ExistingEvents extends Component {

    render() {

        const { events, eventIndex, className } = this.props;

        if (_.isEmpty(events)) {
            return null;
        }

        return <div className={classNames('existingEvents', className)}>
            {(() => {
                return events.map((event, index) => {
                    let selected = (eventIndex !== undefined && eventIndex === index);
                    return <Event key={index} event={event} eventIndex={index} selected={selected}/>
                });
            })()}
        </div>
    }
}

ExistingEvents.propTypes = {
    events     : PT.array.isRequired,
    eventIndex : PT.number,
    className  : PT.object
};

export default ExistingEvents;
