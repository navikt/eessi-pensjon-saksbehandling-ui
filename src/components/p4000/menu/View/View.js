import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import Timeline from 'react-visjs-timeline'
import ReactJson from 'react-json-view'
import classNames from 'classnames'

import Icons from '../../../ui/Icons'
import P4000Util from '../../../p4000/Util'
import * as Nav from '../../../ui/Nav'
import TimelineEvent from '../../../ui/TimelineEvent/TimelineEvent'

import * as p4000Actions from '../../../../actions/p4000'

import './View.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    sed: state.status.sed
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class View extends Component {
    state = {
      formData: undefined,
      p4000Data: undefined,
      sedData: undefined,
      formDataButtonLabel: 'p4000:form-seeFormData',
      p4000DataButtonLabel: 'p4000:form-seeP4000Data',
      sedDataButtonLabel: 'p4000:form-seeSedData',
      tab: 'panel-1'
    }

    handleFormDataClick () {
      if (!this.state.formData) {
        this.setState({
          formData: this.props.events,
          formDataButtonLabel: 'p4000:form-hideFormData'
        })
      } else {
        this.setState({
          formData: undefined,
          formDataButtonLabel: 'p4000:form-seeFormData'
        })
      }
    }

    handleP4000DataClick () {
      if (!this.state.p4000Data) {
        this.setState({
          p4000Data: P4000Util.convertEventsToP4000(this.props.events),
          p4000DataButtonLabel: 'p4000:form-hideP4000Data'
        })
      } else {
        this.setState({
          p4000Data: undefined,
          p4000DataButtonLabel: 'p4000:form-seeP4000Data'
        })
      }
    }

    handleSedDataClick () {
      if (!this.state.sedData) {
        this.setState({
          sedData: this.props.sed,
          sedDataButtonLabel: 'p4000:form-hideSedData'
        })
      } else {
        this.setState({
          sedData: undefined,
          sedDataButtonLabel: 'p4000:form-seeSedData'
        })
      }
    }

    renderDate (date) {
      return date ? date.toDateString() : 'unknown'
    }

    renderTooltip (event) {
      const { t } = this.props

      let dateType = {
        'both': t('p4000:form-rangePeriod'),
        'onlyStartDate01': t('p4000:form-onlyStartDate01'),
        'onlyStartDate98': t('p4000:form-onlyStartDate98')
      }
      let data = [
        { key: t('ui:type'), value: t('p4000:type-' + event.type) },
        { key: t('p4000:form-dateType'), value: dateType[event.dateType] },
        { key: t('ui:startDate'), value: event.startDate.toDateString() }
      ]

      if (event.endDate) {
        data.push({ key: t('ui:endDate'), value: event.endDate.toDateString() })
      }

      return data.map(el => { return '<b>' + el.key + '</b>: ' + el.value }).join('<br/>')
    }

    onTabChange (e) {
      this.setState({
        tab: e.currentTarget.id
      })
    }

    onBackButtonClick () {
      const { actions } = this.props

      actions.setPage('new')
    }

    render () {
      const { t, events, actions } = this.props

      let items = events.map((event, index) => {
        return {
          id: index,
          type: 'range',
          start: event.startDate,
          end: event.endDate || new Date(),
          content: event,
          title: this.renderTooltip(event)
        }
      })

      return <Nav.Panel className='c-p4000-menu-view p-0 mb-4'>
        <div>
          <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
            <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
          </Nav.Knapp>
        </div>
        <h1>{t('p4000:form-timeline')}</h1>
        <Timeline items={items} options={{
          width: '100%',
          orientation: 'top',
          showTooltips: true,
          template: (item, element) => {
            if (!item) { return }
            ReactDOM.render(<TimelineEvent event={item}
              onClick={() => actions.editEvent(item.id)}
            />, element)
            return item.content
          }
        }} />
        <Nav.Ekspanderbartpanel style={{ animationDelay: '0.3s' }} className='row-advanced-view fieldset animate' apen={false} tittel={t('p4000:form-advancedView')} tittelProps='undertittel'>

          <Nav.Row className='fileButtons m-4'>
            <Nav.Column>
              <Nav.Tabs onChange={this.onTabChange.bind(this)}>
                <Nav.Tabs.Tab id='panel-1'>{t('p4000:form-formData')}</Nav.Tabs.Tab>
                <Nav.Tabs.Tab id='panel-2'>{t('p4000:form-p4000Data')}</Nav.Tabs.Tab>
                <Nav.Tabs.Tab id='panel-3'>{t('p4000:form-sedData')}</Nav.Tabs.Tab>
              </Nav.Tabs>
              <div className={classNames('panel', { 'hidden': this.state.tab !== 'panel-1' })} role='tabpanel' id='panel-1'>
                <Nav.Hovedknapp className='seeFormDataButton' onClick={this.handleFormDataClick.bind(this)}>
                  <div>{t(this.state.formDataButtonLabel)}</div>
                </Nav.Hovedknapp>
                <ReactJson src={this.state.formData} theme='monokai' />
              </div>
              <div className={classNames('panel', { 'hidden': this.state.tab !== 'panel-2' })} role='tabpanel' id='panel-2'>
                <Nav.Hovedknapp className='seeP4000DataButton' onClick={this.handleP4000DataClick.bind(this)}>
                  <div>{t(this.state.p4000DataButtonLabel)}</div>
                </Nav.Hovedknapp>
                <ReactJson src={this.state.p4000Data} theme='monokai' />
              </div>
              <div className={classNames('panel', { 'hidden': this.state.tab !== 'panel-3' })} role='tabpanel' id='panel-3'>
                <Nav.Hovedknapp className='seeSedDataButton' onClick={this.handleSedDataClick.bind(this)}>
                  <div>{t(this.state.sedDataButtonLabel)}</div>
                </Nav.Hovedknapp>
                <ReactJson src={this.state.sedData} theme='monokai' />
              </div>
            </Nav.Column>
          </Nav.Row>
        </Nav.Ekspanderbartpanel>
      </Nav.Panel>
    }
}

View.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  actions: PT.object.isRequired,
  sed: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(View)
)
