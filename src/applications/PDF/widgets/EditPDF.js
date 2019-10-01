import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Nav } from 'eessi-pensjon-ui'
import PDFEditor from 'applications/PDF/components/PDFEditor/PDFEditor'

const EditPDF = ({ t, actions, recipe, setStep }) => {
  const hasOnlyEmptyArrays = (obj) => {
    var emptyArrayMembers = _.filter(obj, (it) => {
      return !it || (_.isArray(it) && _.isEmpty(it))
    })
    return emptyArrayMembers.length === Object.keys(obj).length
  }

  const onForwardButtonClick = () => {
    if (hasOnlyEmptyArrays(recipe)) {
      actions.openModal({
        modalTitle: t('pdf:recipe-empty-title'),
        modalText: t('pdf:recipe-empty-text'),
        modalButtons: [{
          main: true,
          text: t('ui:ok-got-it'),
          onClick: actions.closeModal()
        }]
      })
    } else {
      actions.openModal({
        modalTitle: t('pdf:recipe-valid-title'),
        modalText: t('pdf:recipe-valid-text'),
        modalButtons: [{
          main: true,
          text: t('ui:yes') + ', ' + t('ui:generate'),
          onClick: goToGenerate
        }, {
          text: t('ui:cancel'),
          onClick: actions.closeModal()
        }]
      })
    }
  }

  const goToGenerate = () => {
    actions.closeModal()
    setStep('generate')
  }

  const onBackButtonClick = () => {
    setStep('select')
  }

  return (
    <div className='documentbox fieldset m-0 mt-4'>
      <PDFEditor />
      <Nav.Row className='mb-4'>
        <Nav.Column>
          <Nav.Hovedknapp
            className='forwardButton'
            disabled={hasOnlyEmptyArrays(recipe)}
            onClick={onForwardButtonClick}
          >
            {t('ui:forward')}
          </Nav.Hovedknapp>
          <Nav.Knapp className='backButton ml-3' onClick={onBackButtonClick}>{t('ui:back')}</Nav.Knapp>
        </Nav.Column>
      </Nav.Row>
    </div>
  )
}

EditPDF.propTypes = {
  actions: PT.object,
  t: PT.func,
  files: PT.array.isRequired,
  recipe: PT.object.isRequired
}

export default EditPDF
