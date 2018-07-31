import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import VisTimeline from 'react-visjs-timeline';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './custom-timeline.css';

import * as Nav from '../..//ui/Nav';
import Icons from '../../ui/Icons';
import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const options = {
    width: '100%',
    orientation: 'top',
    showTooltips: true
}

class Timeline extends Component {

    renderDate(date) {
        return date ? date.toDateString() : 'unknown';
    }

    renderContent(event) {

        const { t } = this.props;

        return renderToString(<div className='timeline-event'>
            <div><Icons size='3x' kind={event.type}/></div>
            <h4>{t('p4000:' + event.type)}</h4>
        </div>);
    }

    render() {

        const { t, events } = this.props;

        let items = events.map((event, index) => {
            return {
                id: index,
                type: 'range',
                start: event.startDate,
                end: event.endDate,
                content: this.renderContent(event),
                title: 'this is a tooltip'
            }
        })
        return <Nav.Panel className='p-0 panel-timeline'>
            <Nav.Row className='timelineTitle mb-4'>
                <Nav.Column>
                    <Icons size='3x' kind='timeline' className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{t('p4000:timeline')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-timeline-view mb-4 p-4 fieldset'>
                <Nav.Column>
                    <VisTimeline options={options} items = {items}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-timeline-view mb-4 p-4 fieldset'>
                <Nav.Column>
                    <VerticalTimeline>
                        {(() => {
                            return events.map((event, index) => {
                                let dateString = this.renderDate(event.startDate) + ' - ' +  this.renderDate(event.endDate);
                                return <VerticalTimelineElement
                                    date={dateString}
                                    key={index}
                                    iconStyle={{ background: 'rgb(33,150,24)', color: '#fff'}}
                                    icon={<Icons size='3x' kind={event.type}/>}>
                                    <h3 className='vertical-timeline-element-title'>{t('p4000:' + event.type)}</h3>
                                    <h4 className='vertical-timeline-element-subtitle'>{event.name || ''}</h4>
                                </VerticalTimelineElement>;
                            });
                        })()}
                    </VerticalTimeline>
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

Timeline.propTypes = {
    t      : PT.func,
    events : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Timeline)
);
