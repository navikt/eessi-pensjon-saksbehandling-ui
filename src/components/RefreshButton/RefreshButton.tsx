import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import styled, { keyframes } from 'styled-components'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface RefreshButtonProps {
  className?: string;
  labelRefresh?: string;
  onRefreshClicked?: () => void;
  rotating?: boolean;
}
const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const RefreshButtonDiv = styled.div`
  .rotating {
    display: inline-block;
    animation: ${rotating} 2s linear infinite;
  }
`

const RefreshButton: React.FC<RefreshButtonProps> = ({
  className, labelRefresh = 'Forfriske', onRefreshClicked = () => {}, rotating = false
}: RefreshButtonProps): JSX.Element => (
  <RefreshButtonDiv className={className}>
    <a
      title={labelRefresh}
      href='#refresh'
      className={classNames('lenke', { rotating: rotating })}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onRefreshClicked()
      }}
    >
      <FontAwesomeIcon icon={icons.faSyncAlt} />
    </a>
  </RefreshButtonDiv>
)

RefreshButton.propTypes = {
  className: PT.string,
  labelRefresh: PT.string,
  onRefreshClicked: PT.func.isRequired,
  rotating: PT.bool.isRequired
}
RefreshButton.displayName = 'RefreshButton'
export default RefreshButton
