import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';
import Timeline from 'react-visjs-timeline';
import ReactJson from 'react-json-view';

import P4000Util from  '../../../p4000/Util';
import * as Nav from '../../../ui/Nav';
import TimelineEvent from '../../../ui/TimelineEvent/TimelineEvent';

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

class View extends Component {

    state = {
        formData: undefined,
        p4000Data : undefined,
        formDataButtonLabel: 'p4000:form-seeFormData',
        p4000DataButtonLabel: 'p4000:form-seeP4000Data'

    }

    handleFormDataClick() {

        if (!this.state.formData) {
            this.setState({
                formData: this.props.events,
                formDataButtonLabel: 'p4000:form-hideFormData'
            });
        } else {
            this.setState({
                formData: undefined,
                formDataButtonLabel: 'p4000:form-seeFormData'
            });
        }
    }

    handleP4000DataClick() {

        if (!this.state.p4000Data) {
            this.setState({
                p4000Data: P4000Util.convertEventsToP4000(this.props.events),
                p4000DataButtonLabel: 'p4000:form-hideP4000Data'
            });
        } else {
            this.setState({
                p4000Data: undefined,
                p4000DataButtonLabel: 'p4000:form-seeP4000Data'
            });
        }
    }

    renderDate(date) {

        return date ? date.toDateString() : 'unknown';
    }

    renderTooltip(event) {

        const { t } = this.props;

        let dateType = {
            'both' : t('p4000:form-rangePeriod'),
            'onlyStartDate01' : t('p4000:form-onlyStartDate01'),
            'onlyStartDate98' : t('p4000:form-onlyStartDate98')
        };
        let data = [
            {key: t('ui:type'), value: t('p4000:type-' + event.type)},
            {key: t('p4000:form-dateType'), value: dateType[event.dateType]},
            {key: t('ui:startDate'), value: event.startDate.toDateString()}
        ];

        if (event.endDate) {
            data.push({key: t('ui:endDate'), value: event.endDate.toDateString() });
        }

        return data.map(el => {return '<b>' + el.key + '</b>: ' + el.value}).join('<br/>');
    }

    render() {

        const { t, events, actions } = this.props;

        let items = events.map((event, index) => {
            return {
                id: index,
                type: 'range',
                start: event.startDate,
                end: event.endDate || new Date(),
                content: event,
                title: this.renderTooltip(event)
            }
        });

        return <Nav.Panel className='panel-timeline'>
            <Nav.Ekspanderbartpanel className='row-timeline-view fieldset mb-5' apen={true} tittel={t('p4000:form-timeline')} tittelProps='undertittel'>
                <Timeline items={items}
                    options={{
                        width        : '100%',
                        orientation  : 'top',
                        showTooltips : true,
                        template     : (item, element) => {
                            if (!item) {return}
                            ReactDOM.render(<TimelineEvent event={item}
                                onClick={() => actions.editEvent(item.id)}
                            />, element);
                            return item.content;
                        }
                    }}/>
            </Nav.Ekspanderbartpanel>

            <Nav.Ekspanderbartpanel className='row-advanced-view fieldset' apen={false} tittel={t('p4000:form-advancedView')} tittelProps='undertittel'>

                <Nav.Row className='fileButtons m-4 text-center'>
                    <Nav.Column>
                        <Nav.Hovedknapp onClick={this.handleFormDataClick.bind(this)}>
                            <div>{t(this.state.formDataButtonLabel)}</div>
                        </Nav.Hovedknapp>
                    </Nav.Column>
                    <Nav.Column>
                        <Nav.Hovedknapp onClick={this.handleP4000DataClick.bind(this)}>
                            <div>{t(this.state.p4000DataButtonLabel)}</div>
                        </Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row>
                    <Nav.Column className='jsonview'>
                        <ReactJson src={this.state.formData} theme='monokai'/>
                    </Nav.Column>
                    <Nav.Column className='jsonview'>
                        <ReactJson src={this.state.p4000Data} theme='monokai'/>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Ekspanderbartpanel>
        </Nav.Panel>
    }
}

View.propTypes = {
    t       : PT.func,
    events  : PT.array.isRequired,
    actions : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(View)
);
