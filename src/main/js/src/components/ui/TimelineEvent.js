import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import Icons from './Icons';

class TimelineEvent extends Component {

    render () {

        const { t, event, onClick } = this.props;

        return <div className='timeline-event'>
            <div>
                <Icons size='3x' kind={event.content.type}/>
                <h4>{t('p4000:' + event.content.type)}</h4>
            </div>
            <div className='timeline-event-edit'>
                <a href='#edit' onClick={onClick}>{t('p4000:editEvent')}</a>
            </div>
        </div>
    }
}

TimelineEvent.propTypes = {
    t       : PT.func.isRequired,
    event   : PT.object.isRequired,
    onClick : PT.func.isRequired
};

export default translate()(TimelineEvent);
