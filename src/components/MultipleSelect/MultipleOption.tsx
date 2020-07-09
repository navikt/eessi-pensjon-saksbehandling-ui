import PT from 'prop-types'
import React from 'react'
import { OptionProps } from 'react-select'
import { Checkbox } from 'nav-frontend-skjema'

export type MultipleOptionProps = OptionProps<any>

const MultipleOption: React.FC<MultipleOptionProps> = (props: MultipleOptionProps): JSX.Element => {
  const {data, selectProps, innerProps, isSelected, getStyles} = props
  const id: string = selectProps.id + '-' + data.value
  return (
    <div
      {...innerProps}
      style={getStyles('option', props)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        innerProps.onClick(e)
      }}
    >
      <Checkbox
        data-testid={'c-multipleOption__checkbox-' + id}
        label={data.label}
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        checked={isSelected}
      />
    </div>
  )
}

MultipleOption.propTypes = {
  data: PT.object,
  selectProps: PT.object.isRequired,
  innerProps: PT.any.isRequired,
  isSelected: PT.bool.isRequired,
  isFocused: PT.bool.isRequired
}
MultipleOption.displayName = 'MultipleOption'
export default MultipleOption
