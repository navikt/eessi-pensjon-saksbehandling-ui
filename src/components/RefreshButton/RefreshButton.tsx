import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Icons from '../Icons/Icons'
import './RefreshButton.css'

export interface RefreshButtonProps {
  className?: string;
  labelRefresh?: string;
  onRefreshClicked?: () => void;
  rotating?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  className, labelRefresh = 'Forfriske', onRefreshClicked = () => {}, rotating = false
}: RefreshButtonProps): JSX.Element => (
  <div className={classNames('c-refreshbutton', className)}>
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
      <Icons kind='refresh' />
    </a>
  </div>
)

RefreshButton.propTypes = {
  className: PT.string,
  labelRefresh: PT.string,
  onRefreshClicked: PT.func.isRequired,
  rotating: PT.bool.isRequired
}
RefreshButton.displayName = 'RefreshButton'
export default RefreshButton
