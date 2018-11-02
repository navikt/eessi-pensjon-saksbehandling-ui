import React, { Component } from 'react'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import _ from 'lodash'

import './RenderData.css'

class RenderPrintData extends Component {
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
    let { t, data } = this.props

    return <div id='divToPrint' style={{ display: 'none' }} className='p-3 c-case-printData'>
      <dl className='row'>
        <dt className='col-sm-4'><label>{t('case:form-sakId')}</label></dt>
        <dd className='col-sm-8'>{data.sakId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-aktoerId')}</label></dt>
        <dd className='col-sm-8'>{data.aktoerId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-rinaId')}</label></dt>
        <dd className='col-sm-8'>{data.rinaId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-subjectArea')}</label></dt>
        <dd className='col-sm-8'>{data.subjectArea}</dd>
        <dt className='col-sm-4'><label>{t('case:form-buc')}</label></dt>
        <dd className='col-sm-8'>{data.buc}</dd>
        <dt className='col-sm-4'><label>{t('case:form-sed')}</label></dt>
        <dd className='col-sm-8'>{data.sed}</dd>
        <dt className='col-sm-4'><label>{t('case:form-institution')}</label></dt>
        {data.institutions ? <dd className='col-sm-8'>{data.institutions.map((inst, i) => {
          return <div key={i} className='d-inline-block'>
            <img src={'../../../../flags/' + inst.country + '.png'}
              style={{ width: 30, height: 20 }}
              alt={inst.country} />&nbsp; {inst.institution}
          </div>
        })}</dd> : null}
      </dl>
      {this.renderJson(data).map(html => { return html })}
    </div>
  }
}

RenderPrintData.propTypes = {
  data: PT.object.isRequired,
  t: PT.func.isRequired
}

export default translate()(RenderPrintData)
