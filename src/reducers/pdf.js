import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialPdfState = {
  recipe: {},
  files: [],
  pageScale: 1.0,
  dndTarget: 'work',
  watermark: {
    watermarkText: '',
    watermarkTextColor: {
      r: 255, g: 0, b: 0, a: 0.25
    }
  },
  separator: {
    separatorText: '',
    separatorTextColor: {
      r: 0, g: 0, b: 0, a: 1.0
    }
  },
  step: 0
}

const pdfReducer = (state = initialPdfState, action = {}) => {
  switch (action.type) {
    case types.PDF_SELECTED: {
      let newRecipe = _.clone(state.recipe)
      let existingPDF = action.payload.map(pdf => { return pdf.name })

      for (var i in newRecipe) {
        newRecipe[i] = _.filter(newRecipe[i], (step) => {
          return existingPDF.indexOf(step.name) >= 0
        })
      }

      return Object.assign({}, state, {
        files: action.payload,
        recipe: newRecipe
      })
    }

    case types.PDF_CLEAR: {
      return Object.assign({}, state, {
        files: undefined
      })
    }

    case types.PDF_GENERATE_SUCCESS: {
      return Object.assign({}, state, {
        generatedPDFs: action.payload
      })
    }

    case types.PDF_SET_RECIPE:

      return Object.assign({}, state, {
        recipe: action.payload
      })

    case types.PDF_SET_DND_TARGET:

      return Object.assign({}, state, {
        dndTarget: action.payload
      })

    case types.PDF_SET_PAGE_SIZE:

      return Object.assign({}, state, {
        pageScale: action.payload
      })

    case types.APP_CLEAR_DATA:

      return initialPdfState

    case types.PDF_WATERMARK_SET : {
      return Object.assign({}, state, {
        watermark: action.payload
      })
    }

    case types.PDF_SEPARATOR_SET : {
      return Object.assign({}, state, {
        separator: action.payload
      })
    }

    default:

      return state
  }
}

export default pdfReducer
