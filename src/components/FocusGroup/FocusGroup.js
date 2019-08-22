import React, { useState } from 'react'
import PT from 'prop-types'

// Container that allows you to trigger a callback on
// the group of children as a whole when it gains or loses focus
const FocusGroup = (props) => {
  const { children, onBlur, onFocus } = props
  const [_timeoutID, setTimeoutID] = useState(null)
  const [focus, setFocus] = useState(false)

  const handleOnBlur = (event) => {
    event.persist()
    setTimeoutID(
      setTimeout(() => {
        setFocus(false)
        if (typeof onBlur === 'function') {
          onBlur(event)
        }
      }, 0)
    )
  }

  const handleOnFocus = (event) => {
    clearTimeout(_timeoutID)
    if (!focus) {
      setFocus(true)
      if (typeof onFocus === 'function') {
        onFocus(event)
      }
    }
  }

  return (
    <div
      className='c-focusGroup'
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
    >
      {children}
    </div>
  )
}

FocusGroup.propTypes = {
  onBlur: PT.func,
  onFocus: PT.func,
  children: PT.node
}

export default FocusGroup
