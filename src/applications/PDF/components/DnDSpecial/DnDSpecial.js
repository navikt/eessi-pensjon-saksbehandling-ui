import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import PDFSpecialPage from '../PDFSpecialPage/PDFSpecialPage'
import * as Nav from 'components/Nav'
import ColorPicker from 'components/ColorPicker/ColorPicker'
import * as pdfActions from 'actions/pdf'

import './DnDSpecial.css'

const mapStateToProps = (state) => {
  return {
    watermark: state.pdf.watermark,
    separator: state.pdf.separator
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

    setSeparatorText (e) {
      if (e.target) {
        e.preventDefault()
        e.stopPropagation()
      }

      const { actions, separator } = this.props

      actions.setSeparator({
        separatorText: e.target ? e.target.value : e,
        separatorTextColor: separator.separatorTextColor
      })
    }

    setSeparatorTextColor (color) {
      const { actions, separator } = this.props

      actions.setSeparator({
        separatorText: separator.separatorText,
        separatorTextColor: color.rgb
      })
    }

    setWatermarkText (e) {
      if (e.target) {
        e.preventDefault()
        e.stopPropagation()
      }

      const { actions, watermark } = this.props

      actions.setWatermark({
        watermarkText: e.target.value,
        watermarkTextColor: watermark.watermarkTextColor
      })
    }

    setWatermarkTextColor (color) {
      const { actions, watermark } = this.props

      actions.setWatermark({
        watermarkText: watermark.watermarkText,
        watermarkTextColor: color.rgb
      })
    }

    render () {
      const { t, separator, watermark } = this.props

      const separatorEnabled = !!separator.separatorText

      return <div className='c-pdf-dndSpecial position-relative'
        onMouseEnter={this.onHandleMouseEnter.bind(this)}
        onMouseLeave={this.onHandleMouseLeave.bind(this)}>
        <Nav.HjelpetekstAuto>{t('pdf:help-specials-pdf')}</Nav.HjelpetekstAuto>
        <Droppable droppableId={'c-pdf-dndSpecial-droppable'} direction='horizontal'>

          {(provided, snapshot) => (

            <div ref={provided.innerRef}
              className={classNames('c-pdf-dndSpecial-droppable', { 'c-pdf-dndSpecial-droppable-active': snapshot.isDraggingOver })}>

              <Draggable key={'dndspecial'} draggableId={encodeURIComponent(JSON.stringify(separator))}
                index={0} isDragDisabled={!separatorEnabled}>

                {(provided, snapshot) => (
                  <React.Fragment>
                    <div className={classNames('c-pdf-dndSpecial-draggable', { dragging: snapshot.isDragging })}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <PDFSpecialPage separator={separator} deleteLink={false}
                        className={classNames({
                          enabled: separatorEnabled,
                          disabled: !separatorEnabled,
                          'c-pdf-dndSpecial-draggable-active': snapshot.isDragging
                        })} />
                    </div>
                    {snapshot.isDragging && (
                      <div className='cloneStyle'>
                        <PDFSpecialPage separator={separator} deleteLink={false} />
                      </div>
                    )}
                  </React.Fragment>
                )}
              </Draggable>

              <div className='ml-3 d-inline-block'>
                <Nav.Textarea label={t('content')} maxLength={100} placeholder={t('pdf:specials-textPlaceholder')} value={separator.separatorText} onChange={this.setSeparatorText.bind(this)} />
                <ColorPicker color={separator.separatorTextColor} onChangeComplete={this.setSeparatorTextColor.bind(this)} />
              </div>
              <div className='ml-3'>
                <Nav.Textarea label={t('watermark')} maxLength={100} placeholder={t('pdf:specials-watermarkPlaceholder')} value={watermark.watermarkText} onChange={this.setWatermarkText.bind(this)} />
                <ColorPicker color={watermark.watermarkTextColor} onChangeComplete={this.setWatermarkTextColor.bind(this)} />
              </div>
            </div>
          )}
        </Droppable>
      </div>
    }
}

DnDSpecial.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object,
  separator: PT.object.isRequired,
  watermark: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(DnDSpecial)
)
