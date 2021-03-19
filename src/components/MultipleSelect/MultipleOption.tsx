import PT from 'prop-types'
import { OptionProps, OptionTypeBase } from 'react-select'
import { Checkbox } from 'nav-frontend-skjema'
import styled from 'styled-components'
import NavHighContrast, { themeKeys } from 'nav-hoykontrast'

export type MultipleOptionProps = OptionProps<OptionTypeBase, true>

const OptionCheckbox = styled(Checkbox)`
   &:not(:disabled) {
     cursor: pointer
   }
   label {
      &:hover {
       color: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]} !important;
     }
   }
`

const MultipleOption: React.FC<MultipleOptionProps> = (props: MultipleOptionProps): JSX.Element => {
  const { data, selectProps, innerProps, isSelected, getStyles } = props
  const id: string = selectProps.id + '-' + data.value

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
    <div
      {...innerProps}
      data-test-id='c-multipleoption__div-id'
      style={getStyles('option', props)}
      role='button'
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        innerProps.onClick(e)
      }}
    >
      <NavHighContrast highContrast={selectProps.selectProps.highContrast}>
        <OptionCheckbox
          data-test-id={'c-multipleoption__checkbox-' + id}
          id={'c-multipleoption__checkbox-' + id}
          label={data.label}
          onChange={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          checked={isSelected}
        />
      </NavHighContrast>
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
