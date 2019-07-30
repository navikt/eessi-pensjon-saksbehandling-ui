import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'store'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'

import PageInDnD from '../PageInDnD/PageInDnD'
import PDFSpecialPage from '../PDFSpecialPage/PDFSpecialPage'

import './DnDTarget.css'

const mapStateToProps = (state) => {
  return {
    recipe: state.pdf.recipe,
    files: state.pdf.files
  }
}

class DnDTarget extends Component {
  render () {
    const { files, recipe, targetId } = this.props

    return <div className='c-pdf-dndTarget'>

      <Droppable droppableId={'c-pdf-dndTarget-droppable-' + targetId}>

        {(provided, snapshot) => (

          <div ref={provided.innerRef}
            className={classNames('c-pdf-dndTarget-droppable', 'text-center', { 'c-pdf-dndTarget-droppable-active ': snapshot.isDraggingOver })}>

            {recipe[targetId] ? recipe[targetId].map((recipeStep, index) => {
              const file = _.find(files, { name: recipeStep.name })

              return <Draggable key={index} draggableId={index} index={index}>

                {(provided, snapshot) => (

                  <div className={classNames('c-pdf-dndTarget-draggable', { dragging: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    { recipeStep.type === 'pickPage' || recipeStep.type === 'pickImage'
                      ? <PageInDnD
                        className={classNames({ 'c-pdf-dndTarget-draggable-active': snapshot.isDragging })}
                        file={file}
                        pageNumber={recipeStep.pageNumber}
                        action='remove'
                      />
                      : recipeStep.type === 'specialPage'
                        ? <PDFSpecialPage separator={{
                          separatorTextColor: recipeStep.separatorTextColor,
                          separatorText: recipeStep.separatorText
                        }} deleteLink />
                        : null
                    }
                  </div>
                )}
              </Draggable>
            }) : null}
          </div>
        )}
      </Droppable>
    </div>
  }
}

DnDTarget.propTypes = {
  recipe: PT.object.isRequired,
  files: PT.array.isRequired,
  targetId: PT.string.isRequired
}

export default connect(
  mapStateToProps,
  () => {}
)(DnDTarget)
