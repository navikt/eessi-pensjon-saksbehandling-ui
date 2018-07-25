import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import Icons from '../ui/Icons';
import './custom-timeline.css';
import * as p4000Actions from '../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events: state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Timeline extends Component {

    renderDate(date) {
        return date ? date.toDateString() : 'unknown';
    }

    render() {

        const { events } = this.props;
        return <VerticalTimeline>
            {(() => {
                return events.map((event, index) => {
                    let dateString = this.renderDate(event.startDate) + ' - ' +  this.renderDate(event.endDate);
                    return <VerticalTimelineElement
                        date={dateString}
                        key={index}
                        iconStyle={{ background: 'rgb(33,150,24)', color: '#fff'}}
                        icon={<Icons size='3x' kind={event.type}/>}>
                        <h3 className='vertical-timeline-element-title'>Title</h3>
                        <h4 className='vertical-timeline-element-subtitle'>SubTitle</h4>
                    </VerticalTimelineElement>;
                });
            })()}
        </VerticalTimeline>
    }

}

Timeline.propTypes = {
    events : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Timeline)
);
