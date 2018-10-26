import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'

import * as pdfActions from '../../../actions/pdf'

import { Ikon } from '../../ui/Nav'

import './PDFSpecialPage.css'

const mapStateToProps = (state) => {
  return {
    pageScale: state.pdf.pageScale,
    recipe: state.pdf.recipe,
    dndTarget: state.pdf.dndTarget
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions), dispatch) }
}

class PDFSpecialPage extends Component {
    state = {
      isHovering: false
    }

    onHandleMouseEnter () {
      this.setState({ isHovering: true })
    }

    onHandleMouseOver () {
      this.setState({ isHovering: true })
    }

    onHandleMouseLeave () {
      this.setState({ isHovering: false })
    }

    onDeleteDocument (separatorText, e) {
      e.stopPropagation()
      e.preventDefault()

      const { recipe, dndTarget, actions } = this.props
      let newRecipe = _.clone(recipe)

      let index = _.findIndex(recipe[dndTarget], { separatorText: separatorText })
      if (index >= 0) {
        newRecipe[dndTarget].splice(index, 1)
        actions.setRecipe(newRecipe)
      }
    }

    render () {
      const { pageScale, className, style, separator, deleteLink } = this.props

      return <div style={style} className={classNames('c-pdf-PDFSpecialPage', className)}
        onMouseEnter={this.onHandleMouseEnter.bind(this)}
        onMouseOver={this.onHandleMouseOver.bind(this)}
        onMouseLeave={this.onHandleMouseLeave.bind(this)}>
        {this.state.isHovering && deleteLink ? <div onClick={this.onDeleteDocument.bind(this, separator.separatorText)} className='link deleteLink'>
          <Ikon size={15} kind='trashcan' />
        </div> : null}
        <div className='page' style={{ maxWidth: '100%', maxHeight: '100%', width: 100 * pageScale, height: 140 * pageScale }}>
          <div className='content' style={{
            color: `rgba(${separator.separatorTextColor.r}, ${separator.separatorTextColor.g}, ${separator.separatorTextColor.b}, ${separator.separatorTextColor.a})`
          }}>{separator.separatorText}</div>
        </div>
      </div>
    }
}

PDFSpecialPage.propTypes = {
  recipe: PT.object.isRequired,
  pageScale: PT.number.isRequired,
  className: PT.string,
  style: PT.object,
  dndTarget: PT.string,
  deleteLink: PT.bool,
  actions: PT.object,
  separator: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDFSpecialPage)
