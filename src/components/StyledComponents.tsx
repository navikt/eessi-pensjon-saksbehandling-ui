import styled from 'styled-components'
import {Box, HGrid, HStack, RadioGroup} from '@navikt/ds-react'
import {FilesFillIcon, FilesIcon} from "@navikt/aksel-icons";
import styles from './StyledComponents.module.css'

interface BasicStyledComponentsProps {
  className?: string
}

interface CommonStyledComponentsProps extends BasicStyledComponentsProps {
  children?: React.ReactNode
}

interface HStackStyledComponentsProps extends React.ComponentProps<typeof HStack>, BasicStyledComponentsProps {
}

export const OneLineSpan = styled.span`
  white-space: nowrap;
`

export const SeparatorSpan = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`

export const SpinnerDiv = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
`

export const HorizontalSeparatorSpan = styled.span<{size?: string}>`
  display: inline-block;
  margin-left: ${(props: any) => props.size || 1}rem;
`

export const HorizontalLineSeparator = styled.div`
  height: 1px;
  background: linear-gradient(90deg,
    var(--a-bg-subtle) 0%,
    var(--a-border-strong) 5%,
    var(--a-border-strong) 95%,
    var(--a-bg-subtle) 100%
  );
  width: -webkit-fill-available;
  margin-left: 2rem;
  margin-right: 2rem;
`

export const WithErrorBox = styled(Box)`
  background-color: transparent;
  border: none;
  &.error {
    margin: -4px;
    border: 4px solid var(--a-border-danger) !important;
  }
`

export const RepeatableBox = styled(Box)`
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  };
  &.error {
    background-color: rgba(255, 0, 0, 0.2);
  };
  &:hover:not(.new):not(.error) {
    background-color: var(--a-gray-100);
  }
  &:not(:hover) .control-buttons {
    display:none
  }
`


export const RepeatableBoxWithBorder = styled(RepeatableBox)`
  border: 1px solid var(--a-border-default);
`

// Erstatte med vanlig HGrid og heller legge inn i align?
export const TopAlignedGrid = styled(HGrid)`
  align-items: start
`

// Erstatte med vanlig HStack og heller legge inn i align?
export const CenterHStack = styled(HStack)`
  align-items: center;
`

export const CenterHStackNew: React.FC<HStackStyledComponentsProps> = ({
                                                                         children,
                                                                         className,
                                                                         ...rest
                                                                          }) => {
  return (
    <HStack
      className={`${styles.CenterHStackNew} ${className || ''}`}
      {...rest}
    >
      {children}
    </HStack>
  )
}

export const HorizontalRadioGroup = styled(RadioGroup)`
  > .navds-radio-buttons {
    display: flex;
    gap: var(--a-spacing-4);
    margin-bottom: var(--a-spacing-2)
  }
`

export const WaitingPanelDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`

export const WaitingPanelDivNew: React.FC<CommonStyledComponentsProps> = ({
                                                                      children,
                                                                      className
                                                                    }) => {
  return (
    <div className={`${styles.WaitingPanelDiv} ${className || ''}`}>
      {children}
    </div>
  )
}

export const HiddenDiv = styled.div`
  display: none;
`

export const HiddenDivNew: React.FC<CommonStyledComponentsProps> = ({
                                                                           children,
                                                                           className
                                                                         }) => {
  return (
    <div className={`${styles.HiddenDivNew} ${className || ''}`}>
      {children}
    </div>
  )
}

export const CopyWithMargin = styled(FilesIcon)`
  position: relative;
  top: 2px;
  left: 5px;
  cursor: pointer;
`

export const CopyWithMarginNew: React.FC<CommonStyledComponentsProps> = ({
                                                                           children,
                                                                           className
}) => {
  return (
  <FilesIcon fontSize="1.5rem" className={`${styles.CopyWithMarginNew} ${className || ''}`}>
    {children}
  </FilesIcon>
  )
}

/*export const CopyFilledWithMargin = styled(FilesFillIcon)`
  position: relative;
  top: 2px;
  left: 5px;
  cursor: pointer;
`*/

export const CopyFilledWithMarginNew: React.FC<CommonStyledComponentsProps> = ({
                                                                                 children,
                                                                                 className
}) => {
  return (
  <FilesFillIcon fontSize="1.5rem" className={`${styles.CopyFilledWithMarginNew} ${className || ''}`}>
    {children}
  </FilesFillIcon>
  )
}

export const BoxWithBorderAndPadding = styled(Box)`
  border: 1px solid var(--a-border-default) ;
  border-radius: 4px;
  background-color: var(--a-bg-default);
  padding: 12px 12px 12px 12px;
`

export const BoxWithBorderAndPaddingNew: React.FC<CommonStyledComponentsProps> = ({
                                                                                    children,
                                                                                    className
}) => {
  return (
  <Box className={`${styles.BoxWithBorderAndPaddingNew} ${className || ''}`}>
    {children}
  </Box>
  )
}


