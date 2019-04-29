import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import Collapse from 'rc-collapse'
import _ from 'lodash'
import { DragDropContext } from 'react-beautiful-dnd'

import * as Nav from '../../../components/ui/Nav'
import StepIndicator from '../../../components/pdf/StepIndicator'
import TopContainer from '../../../components/ui/TopContainer/TopContainer'
import PsychoPanel from '../../../components/ui/Psycho/PsychoPanel'
import DnDSource from '../../../components/pdf/DnDSource/DnDSource'
import DnDSpecial from '../../../components/pdf/DnDSpecial/DnDSpecial'
import DnDImages from '../../../components/pdf/DnDImages/DnDImages'
import DnDTarget from '../../../components/pdf/DnDTarget/DnDTarget'
import DnD from '../../../components/pdf/DnD'
import PDFSizeSlider from '../../../components/pdf/PDFSizeSlider'
import PdfDrawer from '../../../components/drawer/Pdf'

import 'rc-collapse/assets/index.css'
import './EditPDF.css'

import * as routes from '../../../constants/routes'
import * as pdfActions from '../../../actions/pdf'
import * as uiActions from '../../../actions/ui'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language,
    files: state.pdf.files,
    recipe: state.pdf.recipe,
    dndTarget: state.pdf.dndTarget
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch) }
}

class EditPDF extends Component {
    state = {}

    componentDidMount () {
      const { history, files } = this.props

      if (_.isEmpty(files)) {
        history.push(routes.PDF_SELECT)
      }
    }

    onBackButtonClick () {
      const { history } = this.props

      history.goBack()
    }

    hasOnlyEmptyArrays (obj) {
      var emptyArrayMembers = _.filter(obj, (it) => {
        return !it || (_.isArray(it) && _.isEmpty(it))
      })
      return emptyArrayMembers.length === Object.keys(obj).length
    }

    onForwardButtonClick () {
      const { t, recipe, actions } = this.props

      if (this.hasOnlyEmptyArrays(recipe)) {
        actions.openModal({
          modalTitle: t('pdf:recipe-empty-title'),
          modalText: t('pdf:recipe-empty-text'),
          modalButtons: [{
            main: true,
            text: t('ui:ok-got-it'),
            onClick: this.closeModal.bind(this)
          }]
        })
      } else {
        actions.openModal({
          modalTitle: t('pdf:recipe-valid-title'),
          modalText: t('pdf:recipe-valid-text'),
          modalButtons: [{
            main: true,
            text: t('ui:yes') + ', ' + t('ui:generate'),
            onClick: this.goToGenerate.bind(this)
          }, {
            text: t('ui:cancel'),
            onClick: this.closeModal.bind(this)
          }]
        })
      }
    }

    goToGenerate () {
      const { history, actions } = this.props

      actions.closeModal()
      history.push(routes.PDF_GENERATE)
    }

    handleAccordionChange (index) {
      const { actions } = this.props

      if (!index) {
        return
      }
      actions.setActiveDnDTarget(index)
    }

    closeModal () {
      const { actions } = this.props

      actions.closeModal()
    }

    getImageFiles (files) {
      return _.filter(files, (file) => { return file.mimetype.startsWith('image/') })
    }

    getPdfFiles (files) {
      return _.filter(files, (file) => { return file.mimetype === 'application/pdf' })
    }

    imageCollapse (imageFiles) {
      const { t } = this.props

      if (_.isEmpty(imageFiles)) {
        return null
      }
      return <Nav.Ekspanderbartpanel apen key={'images'} tittel={t('images')} tittelProps='undertittel'>
        <DnDImages files={imageFiles} />
      </Nav.Ekspanderbartpanel>
    }

    pdfCollapse (pdfFiles) {
      return pdfFiles.map((file, i) => {
        return <Nav.Ekspanderbartpanel apen key={'pdf-' + i} tittel={file.name} tittelProps='undertittel'>
          <DnDSource pdf={file} />
        </Nav.Ekspanderbartpanel>
      })
    }

    onDragEnd (e) {
      const { droppables, file } = this.props

      if (e.source && e.source.droppableId === 'c-pdf-dndExternalFiles-droppable' && e.destination) {
        let droppableRef = droppables[e.destination.droppableId]
        droppableRef.getWrappedInstance().addFile(file)
      }
    }

    render () {
      const { t, history, files, dndTarget, recipe, location } = this.props

      let imageFiles = this.getImageFiles(files)
      let pdfFiles = this.getPdfFiles(files)
      let imageCollapse = this.imageCollapse(imageFiles)
      let pdfCollapse = this.pdfCollapse(pdfFiles)

      let openedPanels = Array(files.length).fill().map((v, i) => { return 'pdf-' + i })
      if (imageCollapse) {
        openedPanels.push('images')
      }

      return <TopContainer className='p-pdf-editPdf'
        history={history} location={location}
        sideContent={<PdfDrawer />}>

        <h1 className='typo-sidetittel appTitle'>{t('pdf:app-editPdfTitle')}</h1>
        <StepIndicator stepIndicator={1} history={history} />
        <div className='fieldset animate mb-4 '>
          <PsychoPanel closeButton>{t('pdf:app-editPdfDescription')}</PsychoPanel>
        </div>
        <div className='documentbox fieldset m-0 mt-4'>
          <div className='documentbox-header m-2'>
            <h4>{t('pdf:documentBox')}</h4>
            <PDFSizeSlider style={{ width: '25%' }} />
          </div>
          <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            <DnD>
              <Nav.Row>
                <Nav.Column className='col-sm-2 mb-4'>
                  <Collapse className='dndtargets' destroyInactivePanel activeKey={dndTarget} accordion onChange={this.handleAccordionChange.bind(this)}>
                    <Collapse.Panel key='work' header={t('pdf:form-work') + ' (' + (recipe.work ? recipe.work.length : '0') + ')'} showArrow>
                      <DnDTarget targetId='work' />
                    </Collapse.Panel>
                    <Collapse.Panel key='home' header={t('pdf:form-home') + ' (' + (recipe.home ? recipe.home.length : '0') + ')'} showArrow>
                      <DnDTarget targetId='home' />
                    </Collapse.Panel>
                    <Collapse.Panel key='sick' header={t('pdf:form-sick') + ' (' + (recipe.sick ? recipe.sick.length : '0') + ')'} showArrow>
                      <DnDTarget targetId='sick' />
                    </Collapse.Panel>
                    <Collapse.Panel key='other' header={t('pdf:form-other') + ' (' + (recipe.other ? recipe.other.length : '0') + ')'} showArrow>
                      <DnDTarget targetId='other' />
                    </Collapse.Panel>
                  </Collapse>
                </Nav.Column>
                <Nav.Column className='col-sm-10 mb-4'>
                  <div className='h-100'>
                    {!files ? null : <Collapse className='mb-4' defaultActiveKey={openedPanels}
                      destroyInactivePanel={false} accordion={false}>
                      <Nav.Ekspanderbartpanel apen={false} key={'special'} tittel={t('pdf:specials-title')} tittelProps='undertittel'>
                        <DnDSpecial />
                      </Nav.Ekspanderbartpanel>
                      {imageCollapse}
                      {pdfCollapse}
                    </Collapse>
                    }
                    <Nav.Row className='mb-4'>
                      <Nav.Column>
                        <Nav.Hovedknapp className='forwardButton'
                          disabled={this.hasOnlyEmptyArrays(recipe)}
                          onClick={this.onForwardButtonClick.bind(this)}>
                          {t('ui:forward')}
                        </Nav.Hovedknapp>
                        <Nav.Knapp className='backButton ml-3' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                      </Nav.Column>
                    </Nav.Row>
                  </div>
                </Nav.Column>
              </Nav.Row>
            </DnD>
          </DragDropContext>
        </div>
      </TopContainer>
    }
}

EditPDF.propTypes = {
  actions: PT.object,
  history: PT.object,
  t: PT.func,
  files: PT.array.isRequired,
  recipe: PT.object.isRequired,
  dndTarget: PT.string,
  location: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(EditPDF)
)
