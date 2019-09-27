import React, { Component } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { Icons } from 'eessi-pensjon-ui'

import * as pdfActions from 'actions/pdf'
import * as uiActions from 'actions/ui'

import './PageInDnD.css'

pdfjs.GlobalWorkerOptions.workerSrc = process.env.PUBLIC_URL + '/pdf.worker.js'

const mapStateToProps = (state) => {
  return {
    recipe: state.pdf.recipe,
    pageScale: state.pdf.pageScale,
    dndTarget: state.pdf.dndTarget
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch) }
}

class PageInDnD extends Component {
     state = {
       isHovering: false
     }

     closePreview () {
       const { actions } = this.props

       actions.closeModal()
     }

     openPreview (file, pageNumber) {
       const { actions } = this.props

       actions.openModal({
         modalContent: (
           <div style={{ cursor: 'pointer' }} onClick={this.closePreview.bind(this)}>
             {file.mimetype === 'application/pdf'
               ? (
                 <Document className='documentPreview' file={'data:application/pdf;base64,' + file.content.base64}>
                   <Page className='bigpage' width={600} renderMode='svg' pageNumber={pageNumber} />
                 </Document>
               ) : null}
             {file.mimetype.startsWith('image/') ? (
               <div className='documentPreview'>
                 <img
                   className='page' alt={file.name} style={{ width: '600px' }}
                   src={'data:' + file.mimetype + ';base64,' + file.content.base64}
                 />
               </div>
             ) : null}
           </div>
         )
       })
     }

     addPageToTargetPdf (name, mimetype, pageNumber) {
       const { recipe, dndTarget, actions } = this.props

       const newRecipe = _.clone(recipe)
       if (!newRecipe[dndTarget]) {
         newRecipe[dndTarget] = []
       }

       if (mimetype === 'application/pdf') {
         newRecipe[dndTarget].push({ name: name, pageNumber: pageNumber, type: 'pickPage' })
       } else {
         newRecipe[dndTarget].push({ name: name, type: 'pickImage' })
       }
       actions.setRecipe(newRecipe)
     }

     removePageFromTargetPdf (name, mimetype, pageNumber) {
       const { recipe, dndTarget, actions } = this.props
       const newRecipe = _.clone(recipe)

       let index = -1

       if (mimetype === 'application/pdf') {
         index = _.findIndex(recipe[dndTarget], { name: name, pageNumber: pageNumber })
       } else {
         index = _.findIndex(recipe[dndTarget], { name: name })
       }

       if (index >= 0) {
         newRecipe[dndTarget].splice(index, 1)
         actions.setRecipe(newRecipe)
       }
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

     render () {
       const { file, pageNumber, action, pageScale, className, style, isFocused } = this.props
       const { isHovering } = this.state

       let iconFunction, iconKind, iconLink, iconSize
       if (action === 'add') {
         iconFunction = this.addPageToTargetPdf
         iconKind = 'vedlegg'
         iconSize = '20'
       } else {
         iconFunction = this.removePageFromTargetPdf
         iconKind = 'trashcan'
         iconSize = '15'
       }

       if (isHovering || isFocused) {
         iconLink = <Icons style={{ cursor: 'pointer' }} size={iconSize} kind={iconKind} />
       }

       return (
         <div
           style={style} className={classNames('c-pdf-PageInDnD', className)}
           onMouseEnter={this.onHandleMouseEnter.bind(this)}
           onMouseOver={this.onHandleMouseOver.bind(this)}
           onMouseLeave={this.onHandleMouseLeave.bind(this)}
         >

           {file.mimetype.startsWith('image/') ? (
             <div className='document'>
               <div onClick={iconFunction.bind(this, file.name, file.mimetype, pageNumber)} className='icon actionIcon'>{iconLink}</div>
               {isHovering || isFocused ? (
                 <div className='icon previewIcon' onClick={this.openPreview.bind(this, file, pageNumber)}>
                   <Icons
                     style={{ cursor: 'pointer' }}
                     size='20' kind='view'
                   />
                 </div>
               ) : null}
               <img
                 className='page'
                 alt={file.name} style={{ maxWidth: '100%', width: (100 * pageScale) + 'px' }}
                 src={'data:' + file.mimetype + ';base64,' + file.content.base64}
               />
             </div>
           ) : null}
           {file.mimetype === 'application/pdf' ? (
             <Document
               className='document'
               file={'data:application/pdf;base64,' + file.content.base64}
             >
               <div onClick={iconFunction.bind(this, file.name, file.mimetype, pageNumber)} className='icon actionIcon'>{iconLink}</div>
               {isHovering || isFocused ? (
                 <div className='icon previewIcon' onClick={this.openPreview.bind(this, file, pageNumber)}>
                   <Icons style={{ cursor: 'pointer' }} size='1x' kind='view' />
                 </div>
               ) : null}
               <Page
                 className='page'
                 width={100 * pageScale} height={140 * pageScale}
                 renderMode='svg' pageNumber={pageNumber}
               />
               <div className='pageNumber'>{pageNumber}</div>
             </Document>
           ) : null}
         </div>
       )
     }
}

PageInDnD.propTypes = {
  recipe: PT.object.isRequired,
  actions: PT.object,
  file: PT.object.isRequired,
  pageNumber: PT.number.isRequired,
  pageScale: PT.number.isRequired,
  dndTarget: PT.string,
  action: PT.string.isRequired,
  className: PT.string,
  style: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageInDnD)
