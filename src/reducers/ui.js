import * as types from '../constants/actionTypes'

export default function (state = {}, action = {}) {
  switch (action.type) {
    case types.UI_MODAL_OPEN:

      return Object.assign({}, state, {
        modalOpen: true,
        modal: action.payload
      })

    case types.UI_MODAL_CLOSE:

      return Object.assign({}, state, {
        modalOpen: false,
        modal: undefined
      })

    case types.UI_LANGUAGE_CHANGED:

      return Object.assign({}, state, {
        language: action.payload,
        locale: action.payload === 'nb' ? 'nb' : 'en'
      })

    case types.UI_DRAWER_TOGGLE_OPEN : {
      return Object.assign({}, state, {
        drawerOpen: !state.drawerOpen,
        drawerOldWidth: state.drawerWidth,
        drawerWidth: state.drawerOldWidth
      })
    }

    case types.UI_DRAWER_TOGGLE_ENABLE : {
      return Object.assign({}, state, {
        drawerEnabled: !state.drawerEnabled
      })
    }

    case types.UI_DRAWER_WIDTH_SET :

      return Object.assign({}, state, {
        drawerWidth: action.payload
      })

    case types.UI_FOOTER_TOGGLE_OPEN :
      return Object.assign({}, state, {
        footerOpen: !state.footerOpen
      })

    case types.UI_HIGHCONTRAST_TOGGLE :
      return Object.assign({}, state, {
        highContrast: !state.highContrast
      })

    default:

      return state
  }
}
