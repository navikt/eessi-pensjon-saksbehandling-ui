import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import PageInDnD from '../PageInDnD/PageInDnD'

import * as pdfActions from 'actions/pdf'

import './DnDImages.css'

const mapStateToProps = (state) => {
  return {
    recipe: state.pdf.recipe,
    pageScale: state.pdf.pageScale,
    dndTarget: state.pdf.dndTarget
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions), dispatch) }
}

class DnDSpecial extends Component {
    state = {
      isHovering: false
    }

    onHandleMouseEnter () {
      this.setState({ isHovering: true })
    }

    onHandleMouseLeave () {
      this.setState({ isHovering: false })
    }

    addAllImagesToTargetPdf (e) {
      const { recipe, dndTarget, files, actions } = this.props

      e.preventDefault()
      e.stopPropagation()

      let potentialImages = []; let newRecipe = _.clone(recipe)
      let modified = false

      _.filter(files, (file) => { return file.mimetype.startsWith('image/') }).map(file => {
        return potentialImages.push({ name: file.name, type: 'pickImage' })
      })

      if (!newRecipe[dndTarget]) {
        newRecipe[dndTarget] = []
      }
      potentialImages.map(image => {
        if (!_.find(recipe[dndTarget], { name: image.name })) {
          modified = true
          return newRecipe[dndTarget].push(image)
        }
        return image
      })

      if (modified) {
        actions.setRecipe(newRecipe)
      }
    }

    render () {
      const { t, files, recipe, dndTarget } = this.props

      let addAllLink = this.state.isHovering ? <a href='#addAll' onClick={this.addAllImagesToTargetPdf.bind(this)}>{t('ui:addAll')}</a> : null

      return <div className='c-pdf-dndImages position-relative'
        onMouseEnter={this.onHandleMouseEnter.bind(this)}
        onMouseLeave={this.onHandleMouseLeave.bind(this)}>

        <Droppable isDropDisabled droppableId={'c-pdf-dndImages-droppable-images'} direction='horizontal'>

          {(provided, snapshot) => (

            <div ref={provided.innerRef}
              className={classNames('c-pdf-dndImages-droppable', { 'c-pdf-dndImages-droppable-active': snapshot.isDraggingOver })}>

              {files.map((file, index) => {
                if (_.find(recipe[dndTarget], { name: file.name })) {
                  return null
                }

                return <Draggable key={file.name} draggableId={file.name} index={index}>

                  {(provided, snapshot) => (
                    <div className={classNames('c-pdf-dndImages-draggable', { dragging: snapshot.isDragging })}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>

                      <PageInDnD className={classNames({ 'c-pdf-dndImages-draggable-active': snapshot.isDragging })}
                        file={file} action='add' />

                    </div>
                  )}
                </Draggable>
              })}
            </div>
          )}
        </Droppable>
        <div className='addAllLink'>{addAllLink}</div>
      </div>
    }
}

DnDSpecial.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object,
  recipe: PT.array,
  pageScale: PT.number,
  dndTarget: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(DnDSpecial)
)
