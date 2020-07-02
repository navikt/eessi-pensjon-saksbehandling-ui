import classNames from 'classnames'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { OptionProps } from 'react-select'
import { Checkbox } from 'nav-frontend-skjema'
import styled, { ThemeProvider } from 'styled-components'

export type MultipleOptionProps = OptionProps<any>

const MultipleOptionDiv = styled.div`
  padding: 10px;
  &.selected {
     background: ${({ theme }: any) => theme.navLysBla};
     label {
       color: ${({ theme }: any) => theme['main-font-color']} !important;
     }
  }

  &.focused {
    background: aliceblue;
    label {
      color: ${({ theme }: any) => theme['main-font-color']} !important;
    }
  }
  .skjemaelement {
     margin-bottom: 0rem !important;
  }
  img {
     border: 1px solid ${({ theme }: any) => theme.navGra60};
  }
`

const MultipleOption: React.FC<MultipleOptionProps> = ({
  data, selectProps, innerProps, isSelected, isFocused
}: MultipleOptionProps): JSX.Element => {
  const id: string = selectProps.id + '-' + data.value
  return (
    <ThemeProvider theme={selectProps.selectProps.highContrast ? themeHighContrast : theme}>
      <MultipleOptionDiv id={id}>
        <div
          className={classNames({
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
      </MultipleOptionDiv>
    </ThemeProvider>
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
