import { theme, themeHighContrast } from 'nav-styled-component-theme'
import React from 'react'
import ReactSelect from 'react-select'

const Select = (props: any) => {
  const _theme = props.highContrast ? themeHighContrast : theme
  return (
    <ReactSelect
      {...props}
      styles={{
        control: (styles: any) => ({
          ...styles,
          borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
          borderColor: _theme.type === 'themeHighContrast' ? _theme.white : _theme.navGra60,
          borderStyle: 'solid',
          color: _theme['main-font-color'],
          backgroundColor: _theme['main-background-color']
        }),
        singleValue: (styles: any) => ({
          ...styles,
          color: _theme['main-font-color']
        }),
        menu: (styles: any) => ({
          ...styles,
          zIndex: 500
        }),
        menuList: (styles: any) => ({
          ...styles,
          borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
          borderColor: _theme.type === 'themeHighContrast' ? _theme.white : _theme.navGra60,
          borderStyle: 'solid',
          backgroundColor: _theme['main-background-color']
        }),
        option: (styles: any, { isFocused, isSelected }) => ({
          ...styles,
          color: isFocused
            ? _theme['main-background-color']
            : isSelected
              ? _theme['main-background-color']
              : _theme['main-font-color'],
          backgroundColor: isFocused
            ? _theme['main-focus-color']
            : isSelected
              ? _theme['main-interactive-color']
              : _theme['main-background-color']
        })
      }}
    />
  )
}

export default Select
