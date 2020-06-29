import React from 'react'
export default (props: any) => (
  <svg
    contentScriptType='text/ecmascript'
    zoomAndPan='magnify'
    contentStyleType='text/css' viewBox='0 0 24 24'
    preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <g
      fill='none' strokeMiterlimit='10' stroke={props.color || '#3e3832'}
      strokeLinejoin='round' strokeLinecap='round'
    >
      <path d='M1.513 17.5v6h21v-6h1v-8c0-1.104-.896-2-2-2h-19c-1.105 0-2 .896-2 2v8h1zM9.513 15.5h5v3h-5zM16.513 7.5h-9v-1c0-1.656 1.344-3 3-3h3c1.656 0 3 1.344 3 3v1zM1.513 17.5h8M14.513 17.5h8' />
    </g>
  </svg>
)
