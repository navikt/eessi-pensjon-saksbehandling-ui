import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import VeilederPanel from '../../components/ui/Panel/VeilederPanel'

const mapStateToProps = (state) => {
  return {
    status: state.status
  }
}

class Intro extends Component {

  render () {
    const { t } = this.props

    return <div>
      <h2 className='ml-0 appDescription'>{t('pinfo:intro-title')}</h2>
      <div className='mt-5 mb-5'>
        <VeilederPanel>
          <p className='typo-normal'>{t('pinfo:intro-p-1')}</p>
          <p className='typo-normal'>{t('pinfo:intro-p-1')}</p>
          <h3>{t('pinfo:intro-h-1')}</h3>
          <p className='typo-normal'>{t('pinfo:intro-p-1')}</p>
          <p className='typo-normal'>{t('pinfo:intro-p-1')}</p>
        </VeilederPanel>
      </div>
    </div>
  }
}

Intro.propTypes = {
  t : PT.func.isRequired
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(Intro)
)
