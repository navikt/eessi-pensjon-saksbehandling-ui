import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import './RenderData.css'

export class RenderData extends Component {
  renderJson (json, level, counter) {
    let res = []
    let _level = level || 0
    let _counter = counter || 0
    for (var key in json) {
      let value = json[key]
      if (typeof value === 'string') {
        if (value !== 'null' && value !== '') {
          _counter++
          res.push(<div key={_level + '' + _counter} style={{ paddingLeft: _level * 12 }}><b>{key}</b>{': '}{value}</div>)
        }
      } else {
        res.push(this.renderJson(value, _level++, _counter))
      }
    }

    return _.flatten(res)
  }

  render () {
    let { t, previewData } = this.props

    return <div id='divToPrint' className='p-3 c-case-renderPreviewData'>
      <dl className='row'>
        <dt className='col-sm-4'><label>{t('case:form-sakId')}</label></dt>
        <dd className='col-sm-8'>{previewData.sakId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-aktoerId')}</label></dt>
        <dd className='col-sm-8'>{previewData.aktoerId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-rinaId')}</label></dt>
        <dd className='col-sm-8'>{previewData.rinaId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-subjectArea')}</label></dt>
        <dd className='col-sm-8'>{previewData.subjectArea}</dd>
        <dt className='col-sm-4'><label>{t('case:form-buc')}</label></dt>
        <dd className='col-sm-8'>{previewData.buc}</dd>
        <dt className='col-sm-4'><label>{t('case:form-sed')}</label></dt>
        <dd className='col-sm-8'>{previewData.sed}</dd>
        {previewData.vedtakId ? <React.Fragment>
          <dt className='col-sm-4'><label>{t('case:form-vedtakId')}</label></dt>
          <dd className='col-sm-8'>{previewData.vedtakId}</dd>
        </React.Fragment> : null}
        <dt className='col-sm-4'><label>{t('case:form-institution')}</label></dt>
        <dd className='col-sm-8'>{previewData.institutions.map((inst, i) => {
          return <div key={i}>
            <img src={'../../../../flags/' + inst.country + '.png'}
              style={{ width: 30, height: 20 }}
              alt={inst.country} />&nbsp; {inst.institution}
          </div>
        })}</dd>
      </dl>
      {this.renderJson(previewData).map(html => { return html })}
    </div>
  }
}

RenderData.propTypes = {
  previewData: PT.object.isRequired,
  t: PT.func.isRequired
}

export default withTranslation()(RenderData)
