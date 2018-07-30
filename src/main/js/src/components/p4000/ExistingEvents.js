import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import Event from './Event';

class ExistingEvents extends Component {

    handleClick(index) {

        const { handleEditRequest } = this.props;
        handleEditRequest(index);
    }

    render() {

        const { events, eventIndex, handleEditRequest, className } = this.props;

        if (_.isEmpty(events)) {
            return null;
        }

        return <div className={classNames('div-existingEvents', className)}>
            {(() => {
                return events.map((event, index) => {
                    let selected = (eventIndex !== undefined && eventIndex === index);
                    return <Event key={index}
                        onClick={() => {selected ? null : handleEditRequest(index)}}
                        event={event}
                        eventIndex={index}
                        selected={selected}/>
                });
            })()}
        </div>
    }
}

ExistingEvents.propTypes = {
    events     : PT.array.isRequired,
    eventIndex : PT.number,
    className  : PT.object,
    handleEditRequest : PT.func.isRequired
};

export default ExistingEvents;
