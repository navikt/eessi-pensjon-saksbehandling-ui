import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import DatePicker from '../../../components/p4000/DatePicker';
import * as Nav from '../../../components/ui/Nav';
import Icons from '../../../components/ui/Icons';

class Work extends Component {

    state = {
        type : 'work',
        event : {}
    }

    componentDidMount() {
        this.onUpdate();
    }

    componentDidUpdate() {
       this.onUpdate();
    }

    onUpdate() {
        const { event } = this.props;

        if (event && _.isEmpty(this.state.event)) {
            this.setState({
                event : event,
                startDate: event.startDate,
                endDate: event.endDate
            });
        }
        if (!event == !_.isEmpty(this.state.event)) {
            this.setStatate
        }
    }

    addValueToEvent(key, value) {
        let event = this.state.event;
        event[key] = value;
        this.setState({
            event: event
        });
    }

    onStartDatePicked(year, month) {

        this.setState({startDate: {year: year, month: month}});
    }

    onEndDatePicked(year, month) {

        this.setState({endDate: {year: year, month: month}});
    }

    render() {

        const { t } = this.props;

        return <div>
            <Nav.Row>
                <Nav.Column className='mt-4'>
                    <Icons size='3x' kind='work' className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{t('content:p4000-work')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <DatePicker initialStartDate={this.state.startDate}
                        initialEndDate={this.state.endDate}
                        onStartDatePicked={this.onStartDatePicked.bind(this)}
                        onEndDatePicked={this.onEndDatePicked.bind(this)}
                    />
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <Nav.Input label={t('content:p4000-activity')} value={this.state.activity}
                        onChange={(e) => {this.addValueToEvent.bind(this, 'activity', e.target.value)}} />
                </Nav.Column>
            </Nav.Row>
        </div>
    }
}

Work.propTypes = {
    t         : PT.func.isRequired,
    event     : PT.object
};

export default Work;
