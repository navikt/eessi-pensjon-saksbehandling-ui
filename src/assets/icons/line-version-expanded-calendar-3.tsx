import React from 'react'
export default (props: any) => (
  <svg
    contentScriptType='text/ecmascript' zoomAndPan='magnify'
    contentStyleType='text/css'
    id='Layer_1' version='1.1'
    preserveAspectRatio='xMidYMid meet'
    viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px'
    width={props.width || 24} height={props.height || 24}
  >
    <path fill='none' d='M4.5,2.5h-4v21h23v-21h-4' stroke={props.color || '#3e3832'} />
    <rect x='4.5' y='0.5' fill='none' width='3' height='4' stroke={props.color || '#3e3832'} />
    <rect x='16.5' y='0.5' fill='none' width='3' height='4' stroke={props.color || '#3e3832'} />
    <line fill='none' x1='7.5' x2='16.5' y1='2.5' y2='2.5' stroke={props.color || '#3e3832'} />
    <line fill='none' x1='0.5' x2='23.5' y1='7.5' y2='7.5' stroke={props.color || '#3e3832'} />
  </svg>
)
