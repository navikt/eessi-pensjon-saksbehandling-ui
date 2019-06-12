import React from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import Collapse from 'rc-collapse'
import _ from 'lodash'

import * as Nav from 'components/ui/Nav'
import DnDSource from 'applications/PDF/components/DnDSource/DnDSource'
import DnDSpecial from 'applications/PDF/components/DnDSpecial/DnDSpecial'
import DnDImages from 'applications/PDF/components/DnDImages/DnDImages'
import DnDTarget from 'applications/PDF/components/DnDTarget/DnDTarget'
import DnD from 'applications/PDF/components/DnD'
import PDFSizeSlider from 'applications/PDF/components/PDFSizeSlider'

import 'rc-collapse/assets/index.css'

import * as pdfActions from 'actions/pdf'
import * as uiActions from 'actions/ui'

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

const PDFEditor = (props) =>  {

  const { t, actions, files, dndTarget, recipe, pageScale } = this.props

  const handleAccordionChange = (index) => {
    if (!index) {return}
    actions.setActiveDnDTarget(index)
  }

  const getImageFiles = (files) => {
    return _.filter(files, (file) => { return file.mimetype.startsWith('image/') })
  }

  const getPdfFiles = (files) => {
    return _.filter(files, (file) => { return file.mimetype === 'application/pdf' })
  }

  const imageCollapse = (imageFiles) => {
    if (_.isEmpty(imageFiles)) {return null}
    return <Nav.Ekspanderbartpanel apen key={'images'} tittel={t('images')} tittelProps='undertittel'>
      <DnDImages files={imageFiles} />
    </Nav.Ekspanderbartpanel>
  }

  const pdfCollapse = (pdfFiles) => {
    return pdfFiles.map((file, i) => {
      return <Nav.Ekspanderbartpanel apen key={'pdf-' + i} tittel={file.name} tittelProps='undertittel'>
        <DnDSource pdf={file} />
      </Nav.Ekspanderbartpanel>
    })
  }

  const imageFiles = getImageFiles(files)
  const pdfFiles = getPdfFiles(files)
  const imageCollapsed = imageCollapse(imageFiles)
  const pdfCollapsed = pdfCollapse(pdfFiles)

  const openedPanels = Array(files.length).fill().map((v, i) => { return 'pdf-' + i })
  if (imageCollapsed) {
    openedPanels.push('images')
  }

  return <div className='documentbox fieldset m-0 mt-4'>
    <div className='documentbox-header m-2'>
      <h4>{t('pdf:documentBox')}</h4>
      <PDFSizeSlider pageScale={pageScale} actions={actions} style={{ width: '25%' }} />
    </div>
    <DnD>
      <Nav.Row>
        <Nav.Column className='col-sm-2 mb-4'>
          <Collapse className='dndtargets' destroyInactivePanel activeKey={dndTarget} accordion onChange={handleAccordionChange}>
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
              {imageCollapsed}
              {pdfCollapsed}
            </Collapse>
            }
          </div>
        </Nav.Column>
      </Nav.Row>
    </DnD>
  </div>
}

PDFEditor.propTypes = {
  actions: PT.object,
  history: PT.object,
  t: PT.func,
  files: PT.array.isRequired,
  recipe: PT.object.isRequired,
  dndTarget: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(PDFEditor)
)
