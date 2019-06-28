import React from 'react'

const LineVersionBookmarkArticle = (props) => (
  <div {...props} >
    <svg width={(props.width || props.size || 24)} height={(props.height || props.size || 24)}
      contentScriptType='text/ecmascript'
      xmlnsXlink='http://www.w3.org/1999/xlink' zoomAndPan='magnify'
      contentStyleType='text/css' viewBox='0 0 24 24'
      preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'
      version='1.0'>
      <g fill='none' strokeMiterlimit='10' stroke='#3e3832'
        strokeLinejoin='round' strokeLinecap='round'>
        <path d='M11.5 1.5h12v22h-23v-22h3' />
        <path d='M11.5 13.5l-4-4-4 4v-13h8zM14.5 7.5h6M14.5 10.5h6M14.5 13.5h6M3.5 16.5h17M3.5 19.5h13' />
      </g>
    </svg>
  </div>
)

export default LineVersionBookmarkArticle
