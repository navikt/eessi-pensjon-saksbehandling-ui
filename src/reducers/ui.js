import * as types from '../constants/actionTypes'
import _ from 'lodash'

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
        locale: action.payload === 'nb' ? 'nb' : 'en-gb'
      })

    case types.UI_BREADCRUMBS_ADD: {
      let _breadcrumbs = _.cloneDeep(state.breadcrumbs)
      let newBreadcrumbs = action.payload

      if (!_.isArray(newBreadcrumbs)) {
        newBreadcrumbs = [newBreadcrumbs]
      }

      let index = _.findIndex(_breadcrumbs, { url: newBreadcrumbs[0].url })
      if (index >= 0) {
        _breadcrumbs.splice(index)
      }

      _.each(newBreadcrumbs, (breadcrumb) => {
        _breadcrumbs.push(breadcrumb)
      })

      return Object.assign({}, state, {
        breadcrumbs: _breadcrumbs
      })
    }

    case types.UI_BREADCRUMBS_REPLACE: {
      let _breadcrumbs = _.cloneDeep(state.breadcrumbs)

      let newBreadcrumbs = action.payload
      if (!_.isArray(newBreadcrumbs)) {
        newBreadcrumbs = [newBreadcrumbs]
      }

      _breadcrumbs.splice(_breadcrumbs.length - 1, 1)

      _.each(newBreadcrumbs, (breadcrumb) => {
        _breadcrumbs.push(breadcrumb)
      })

      return Object.assign({}, state, {
        breadcrumbs: _breadcrumbs
      })
    }

    case types.UI_BREADCRUMBS_TRIM : {
      let _breadcrumbs = _.cloneDeep(state.breadcrumbs)

      let index = _.findIndex(_breadcrumbs, { url: action.payload.url })

      if (index >= 0) {
        _breadcrumbs.splice(index + 1)
      }

      return Object.assign({}, state, {
        breadcrumbs: _breadcrumbs
      })
    }

    case types.UI_BREADCRUMBS_DELETE : {
      let _breadcrumbs = _.cloneDeep(state.breadcrumbs)

      _breadcrumbs.splice(_breadcrumbs.length - 1, 1)

      return Object.assign({}, state, {
        breadcrumbs: _breadcrumbs
      })
    }

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

    default:

      return state
  }
}
