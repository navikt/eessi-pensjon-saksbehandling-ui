import React from 'react'
export default (props: any) => (
  <svg
    contentScriptType='text/ecmascript' width='24'
    zoomAndPan='magnify'
    contentStyleType='text/css' viewBox='0 0 24 24' height='24'
    preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'
    version='1.0' {...props}
  >
    <g
      fill='none' strokeMiterlimit='10' stroke={props.color || '#3e3832'}
      strokeLinejoin='round'
    >
      <circle r='11' cx='11.5' cy='12.5' strokeLinecap='round' />
      <path
        strokeLinecap='round'
        d='M8.5 10c0-1.656 1.343-3 3-3 1.656 0 3 1.344 3 3 0 1.658-1.344 3-3 3v3'
      />
      <path d='M12 18.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5z' />
    </g>
  </svg>
)
