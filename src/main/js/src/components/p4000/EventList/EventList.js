import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import Event from '../Event/Event';
import './EventList.css';

class EventList extends Component {

    handleClick(index) {

        const { handleEditRequest } = this.props;
        handleEditRequest(index);
    }

    render() {

        const { t, events, eventIndex, handleEditRequest, cancelEditRequest, className } = this.props;

        if (_.isEmpty(events)) {
            return null;
        }

        return <div className='mb-4'>
            <div className='mb-1'>{t('p4000:eventsSoFar')}</div>
            <div className={classNames('div-eventList', className)}>
                {(() => {
                    return events.map((event, index) => {
                        let selected = (eventIndex !== undefined && eventIndex === index);
                        return <Event key={index}
                            onClick={() => selected ? cancelEditRequest() : handleEditRequest(index)}
                            event={event}
                            eventIndex={index}
                            selected={selected}/>
                    });
                })()}
            </div>
        </div>
    }
}

EventList.propTypes = {
    t                 : PT.func.isRequired,
    events            : PT.array.isRequired,
    eventIndex        : PT.number,
    className         : PT.object,
    handleEditRequest : PT.func.isRequired,
    cancelEditRequest : PT.func.isRequired
};

export default translate()(EventList);
