import getError from './getError'

// FOR ANY INPUTS WITH SENSIBLE onInvalid
export function onInvalid (errorMessages, event) {
  if (event && event.target && event.target.id) {
    let id = event.target.id
    let name = this.state.idToName[id]
    let validity = event.target.validity
    let error = getError(validity)
    this.setState(
      (prevState) => {
        return {
          inputStates: {
            ...prevState.inputStates,
            [name]: {
              ...prevState.inputStates[name],
              errorType: error,
              error: {
                feilmelding: errorMessages[name][error]
              },
              showError: true
            }
          }
        }
      }
    )
  }
}

// FOR NAV-INPUT/TEXTFIELD
export function onChange (errorMessages, event) {
  if (event && event.target && event.target.id) {
    let id = event.target.id
    let name = this.state.idToName[id]
    let validity = event.target.validity
    let inputStates = this.state.inputStates
    let input = inputStates[name]
    if (validity.valid) {
      this.setState({
        inputStates: { ...inputStates, [name]: { ...input, showError: false, error: null, errorType: null } }
      })
    } else if (input.showError && validity[input.errorType] === false) {
      let error = getError(validity)
      this.setState({
        inputStates: { ...inputStates,
          [name]: {
            ...input,
            error: {
              feilmelding: errorMessages[name][error]
            },
            errorType: error } }
      })
    }
    input.action(event)
  }
}

// FOR REACT-SELECT
// react-select does not behave nice when it comes to Events.
export function onSelect (name, val) {
  let inputStates = this.state.inputStates
  let input = inputStates[name]
  // for some reason select returns empty field as a 0 length array.
  let value = Array.isArray(val) ? null : val
  if (value !== null) {
    this.setState({
      inputStates: { ...inputStates, [name]: { ...input, showError: false, error: null, errorType: null } },
      customInputProps: { ...this.state.customInputProps, required: false }
    })
  } else {
    this.setState({
      inputStates: { ...inputStates, [name]: { ...input, error: { feilmelding: 'valueMissing' }, errorType: 'valueMissing' } },
      customInputProps: { ...this.state.customInputProps, required: true }
    })
  }
  input.action(value || null)
}

export function onDateChange (name, val) {
  let inputStates = this.state.inputStates
  let input = inputStates[name]
  if (val !== null) {
    this.setState(
      {
        inputStates: { ...inputStates, [name]: { ...input, showError: false, error: null, errorType: null } },
        customInputProps: { ...this.state.customInputProps, required: false }
      }
    )
  } else {
    this.setState({
      inputStates: { ...inputStates, [name]: { ...input, error: { feilmelding: 'valueMissing' }, errorType: 'valueMissing' } },
      customInputProps: { ...this.state.customInputProps, required: true }
    })
  }
  input.action(val || null)
}
