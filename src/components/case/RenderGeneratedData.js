import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import './RenderData.css'

class RenderGeneratedData extends Component {
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
    let { t, dataToGenerate } = this.props

    return <div className='p-3 c-case-renderData c-case-renderGeneratedData'>
      <dl className='row'>
        <dt className='col-sm-4'><label>{t('case:form-sakId')}</label></dt>
        <dd className='col-sm-8'>{dataToGenerate.sakId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-aktoerId')}</label></dt>
        <dd className='col-sm-8'>{dataToGenerate.aktoerId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-rinaId')}</label></dt>
        <dd className='col-sm-8'>{dataToGenerate.rinaId}</dd>
        <dt className='col-sm-4'><label>{t('case:form-subjectArea')}</label></dt>
        <dd className='col-sm-8'>{dataToGenerate.subjectArea}</dd>
        <dt className='col-sm-4'><label>{t('case:form-buc')}</label></dt>
        <dd className='col-sm-8'>{dataToGenerate.buc}</dd>
        <dt className='col-sm-4'><label>{t('case:form-sed')}</label></dt>
        <dd className='col-sm-8'>{dataToGenerate.sed}</dd>
        {dataToGenerate.vedtakId ? <React.Fragment>
          <dt className='col-sm-4'><label>{t('case:form-vedtakId')}</label></dt>
          <dd className='col-sm-8'>{dataToGenerate.vedtakId}</dd>
        </React.Fragment> : null}
        <dt className='col-sm-4'><label>{t('case:form-institution')}</label></dt>
        {dataToGenerate.institutions ? <dd className='col-sm-8'>{dataToGenerate.institutions.map((inst, i) => {
          return <div key={i}>
            <img src={'../../../../flags/' + inst.country + '.png'}
              style={{ width: 30, height: 20 }}
              alt={inst.country} />&nbsp; {inst.institution}
          </div>
        })}</dd> : null}
      </dl>
      {this.renderJson(dataToGenerate).map(html => { return html })}
    </div>
  }
}

RenderGeneratedData.propTypes = {
  dataToGenerate: PT.object.isRequired,
  t: PT.func.isRequired
}

export default withTranslation()(RenderGeneratedData)
