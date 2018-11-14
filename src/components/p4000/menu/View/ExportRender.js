import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import EventsRender from './EventsRender'
import ExportHeader from './ExportHeader'

import './Summary.css'
import '../Menu.css'

class ExportRender extends Component {
  render () {
    const { t, comment, blackAndWhite } = this.props

    return <div className='c-p4000-menu-view-export-render'>
      <ExportHeader {...this.props} />
      <h5 className={classNames('pt-4', (blackAndWhite ? 'black' : 'red'))}>Hendelser</h5>
      <EventsRender {...this.props} />
      <div>
        <h5 className={classNames('pt-4', (blackAndWhite ? 'black' : 'red'))}>{t('comment')}</h5>
        {comment}
      </div>
    </div>
  }
}

ExportRender.propTypes = {
  t: PT.func,
  comment: PT.string,
  blackAndWhite: PT.bool.isRequired
}

export default withNamespaces()(ExportRender)
