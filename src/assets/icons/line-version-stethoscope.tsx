import React from 'react'
export default (props: any) => (
  <svg
    contentScriptType='text/ecmascript' zoomAndPan='magnify'
    contentStyleType='text/css'
    id='Layer_1' style='enableBackground:new 0 0 24 24;' version='1.1'
    preserveAspectRatio='xMidYMid meet'
    viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px'
    {...props}
  >
    <g fill={props.color || '#3e3832'}>
      <circle fill='none' r='2' cx='19.5' cy='10.5' stroke={props.color || '#3e3832'} />
      <path
        fill='none'
        d='M3.5,2c-1.1,0-2,0.9-2,2v5c0,2.8,2.2,5,5,5s5-2.2,5-5V4c0-1.1-0.9-2-2-2 M6.5,14v7.5c0,1.1,0.9,2,2,2   c1.1,0,2-0.9,2-2v-5c0-1.4,1.1-2.5,2.5-2.5c1.4,0,2.5,1.1,2.5,2.5v3c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2v-7'
        stroke={props.color || '#3e3832'}
      />
      <path
        fill='none'
        d='M5,2c0,1.5-1.5,1.5-1.5,1.5v-3C3.5,0.5,5,0.5,5,2z M8,2c0-1.5,1.5-1.5,1.5-1.5v3C9.5,3.5,8,3.5,8,2z'
        stroke={props.color || '#3e3832'}
      />
    </g>
  </svg>
)
