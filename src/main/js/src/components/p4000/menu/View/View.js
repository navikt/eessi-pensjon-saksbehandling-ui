import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';
import VisTimeline from 'react-visjs-timeline';
import ReactJson from 'react-json-view';

import P4000Util from  '../../../p4000/Util';
import * as Nav from '../../../ui/Nav';
import Icons from '../../../ui/Icons';
import * as p4000Actions from '../../../../actions/p4000';

import './View.css';

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

class View extends Component {

    state = {}

    handleClientJSON() {

        this.setState({
            clientJSON: this.props.events
        });
    }

    handleServerJSON() {

        this.setState({
            serverJSON: P4000Util.convertEventsToP4000(this.props.events)
        });
    }

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


    renderTooltip(event) {

        const { t } = this.props;

        let dateType = {
            'both' : t('p4000:rangePeriod'),
            'onlyStartDate01' : t('p4000:onlyStartDate01'),
            'onlyStartDate98' : t('p4000:onlyStartDate98')
        };
        let data = [{key: t('p4000:dateType'), value: dateType[event.dateType]},
                    {key: t('ui:startDate'), value: event.startDate.toDateString()}];

        if (event.endDate) {
            data.push({key: t('ui:endDate'), value: event.endDate.toDateString() });
        }

        return data.map(el => {return '<b>' + el.key + '</b>: ' + el.value}).join('<br/>');
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
                title: this.renderTooltip(event)
            }
        })

        return <Nav.Panel className='p-0 panel-timeline'>
            <Nav.Ekspanderbartpanel className='row-timeline-view fieldset mb-5' apen={true} tittel={t('p4000:timeline')} tittelProps='undertittel'>
                <VisTimeline options={options} items={items}/>
            </Nav.Ekspanderbartpanel>

            <Nav.Ekspanderbartpanel className='row-advanced-view fieldset' apen={false} tittel={t('p4000:advancedView')} tittelProps='undertittel'>

                <Nav.Row className='fileButtons p-4'>
                    <Nav.Column className='col-6'>
                        <div className='mb-4 text-center'>
                            <Nav.Hovedknapp onClick={this.handleClientJSON.bind(this)}>
                                <div>{t('p4000:seeFormData')}</div>
                            </Nav.Hovedknapp>
                        </div>
                        <div className='jsonview'>
                            {this.state.clientJSON ? <ReactJson src={this.state.clientJSON} theme='monokai'/> : null}
                        </div>
                    </Nav.Column>
                    <Nav.Column className='col-6'>
                        <div className='mb-4 text-center'>
                            <Nav.Hovedknapp onClick={this.handleServerJSON.bind(this)}>
                                <div>{t('p4000:seeP4000Data')}</div>
                            </Nav.Hovedknapp>
                        </div>
                        <div className='jsonview'>
                            {this.state.serverJSON ? <ReactJson src={this.state.serverJSON} theme='monokai'/> : null}
                        </div>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Ekspanderbartpanel>
        </Nav.Panel>
    }
}

View.propTypes = {
    t      : PT.func,
    events : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(View)
);
