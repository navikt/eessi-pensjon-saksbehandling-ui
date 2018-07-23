import * as types from '../constants/actionTypes';


export default function (state = { form: []}, action = {}) {

    switch (action.type) {

        case types.P4000_SELECTED_STEP:

         return Object.assign({}, state, {
            editFormEvent : undefined
         });

        case types.P4000_PUSH_EVENT_TO_FORM:

           let newForm = state.form.slice();
           newForm[newForm.length] = action.payload

            return Object.assign({}, state, {
                form : newForm
            });

        case types.P4000_EDIT_FORM_EVENT:

            let editFormEvent = state.form[action.payload.index];
            editFormEvent.index = action.payload.index;

            return Object.assign({}, state, {
                editFormEvent : editFormEvent
            });

        default:
            return state;

    }
}
