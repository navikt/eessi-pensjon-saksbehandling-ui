import classNames from 'classnames'
import PT from 'prop-types'
import React from 'react'
import { OptionProps } from 'react-select'
import { Checkbox } from 'nav-frontend-skjema'

export type MultipleOptionProps = OptionProps<any>

const MultipleOption: React.FC<MultipleOptionProps> = ({
  data, selectProps, innerProps, isSelected, isFocused
}: MultipleOptionProps): JSX.Element => {
  const id: string = selectProps.id + '-' + data.value
  return (
    <div id={id}>
      <div
        className={classNames('c-multipleOption', {
          selected: isSelected,
          focused: isFocused
        })} {...innerProps}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          innerProps.onClick(e)
        }}
      >
        <Checkbox
          id={'c-multipleOption__checkbox-' + id}
          className='c-multipleOption__checkbox'
          label={data.label}
          onChange={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          checked={isSelected}
        />
      </div>
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
