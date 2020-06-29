import classNames from 'classnames'
import _ from 'lodash'
import Lenke from 'nav-frontend-lenker'
import PT from 'prop-types'
import React from 'react'
import './Banner.css'

export interface BannerProps {
  className ?: string;
  labelHighContrast?: string;
  header: JSX.Element | string;
  onHighContrastClicked?: () => void;
  style?: React.CSSProperties
}

const Banner: React.FC<BannerProps> = ({
  className, labelHighContrast = 'Høy kontrast', header, onHighContrastClicked, style
}: BannerProps): JSX.Element => (
  <div
    className={classNames('c-banner', className)}
    role='banner'
    style={style}
  >
    {_.isFunction(onHighContrastClicked) ? (
      <Lenke
        id='c-banner__highcontrast-link-id'
        className='c-banner__highcontrast-link mt-1'
        href='#highContrast'
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onHighContrastClicked()
        }}
      >
        {labelHighContrast}
      </Lenke>) : null}
    <div className='c-banner__title'>
      {header}
    </div>
  </div>
)

Banner.propTypes = {
  className: PT.string,
  header: PT.element.isRequired,
  labelHighContrast: PT.string,
  onHighContrastClicked: PT.func,
  style: PT.object
}

Banner.displayName = 'Banner'
export default Banner
