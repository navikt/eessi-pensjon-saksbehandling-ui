import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../../components/ui/Nav'
import AdvarselTrekant from '../../resources/images/AdvarselTrekant'
import * as routes from '../../constants/routes'

const mapStateToProps = (state) => {
  return {
    files: state.pdf.files,
    recipe: state.pdf.recipe
  }
}

class StepIndicator extends Component {
    state = {
      message: undefined
    }

    hasOnlyEmptyArrays (obj) {
      var emptyArrayMembers = _.filter(obj, (it) => {
        return !it || (_.isArray(it) && _.isEmpty(it))
      })
      return emptyArrayMembers.length === Object.keys(obj).length
    }

    onBeforeChange (nextStep) {
      const { t, files, recipe, stepIndicator } = this.props

      if (nextStep === stepIndicator) {
        return false
      }

      if (nextStep === 1 && _.isEmpty(files)) {
        this.setState({
          message: t('pdf:alert-invalidStep1')
        })
        return false
      }

      if (nextStep === 2 && this.hasOnlyEmptyArrays(recipe)) {
        this.setState({
          message: t('pdf:alert-invalidStep2')
        })
        return false
      }

      this.setState({
        message: undefined
      })
      return true
    }

    onChange (nextStep) {
      const { history } = this.props

      switch (nextStep) {
        case 0 :
          history.push(routes.PDF_SELECT)
          break
        case 1 :
          history.push(routes.PDF_EDIT)
          break
        case 2 :
          history.push(routes.PDF_GENERATE)
          break
        default:
          break
      }
    }

    render () {
      const { t, stepIndicator } = this.props

      return <div>
        <Nav.Stegindikator
          visLabel
          onBeforeChange={this.onBeforeChange.bind(this)}
          onChange={this.onChange.bind(this)}
          autoResponsiv
          className='mb-4'
          steg={[
            { label: t('pdf:form-step0'), aktiv: (stepIndicator === 0) },
            { label: t('pdf:form-step1'), aktiv: (stepIndicator === 1) },
            { label: t('pdf:form-step2'), aktiv: (stepIndicator === 2) }
          ]} />
        {this.state.message ? <div className='w-100 text-center mb-2'>
          <AdvarselTrekant size={16} />
          <span className='ml-2'>{this.state.message}</span>
        </div> : null}
      </div>
    }
}

StepIndicator.propTypes = {

  t: PT.func.isRequired,
  files: PT.array,
  history: PT.object,
  recipe: PT.object,
  stepIndicator: PT.number.isRequired
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(StepIndicator)
)
