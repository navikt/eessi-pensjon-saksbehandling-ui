import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import Event from './Event';

class ExistingEvents extends Component {

    render() {

        const { events, eventIndex } = this.props;

        if (_.isEmpty(events)) {
            return null;
        }

        return <div className='existingEvents'>
            {(() => {
                return events.map((event, index) => {
                    let selected = (eventIndex !== undefined && eventIndex === index);
                    return <Event key={index} event={event} index={index} selected={selected}/>
                });
            })()}
        </div>
    }
}

ExistingEvents.propTypes = {
    events     : PT.array.isRequired,
    eventIndex : PT.number
};

export default ExistingEvents;
