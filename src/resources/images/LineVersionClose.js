import React from 'react'
export default (props) => (
  <div {...props}>
    <svg width={(props.width || props.size || 24)} height={(props.height || props.size || 24)}
      contentScriptType="text/ecmascript"
      xmlnsXlink="http://www.w3.org/1999/xlink" zoomAndPan="magnify"
      contentStyleType="text/css" viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
      version="1.0">
      <g fill="none" strokeMiterlimit="10" stroke={props.color || "#3e3832"}
        strokeLinejoin="round" strokeLinecap="round">
        <path d="M.5.5l23 23M23.5.5l-23 23"/>
      </g>
    </svg>
  </div>
)

