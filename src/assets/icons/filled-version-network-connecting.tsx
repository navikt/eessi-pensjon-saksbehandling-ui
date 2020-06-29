import React from 'react'
export default (props: any) => (
  <svg
    contentScriptType='text/ecmascript' zoomAndPan='magnify'
    contentStyleType='text/css'
    id='Filled_Version' enableBackground='new 0 0 24 24' version='1.1'
    width='24px' preserveAspectRatio='xMidYMid meet'
    viewBox='0 0 24 24' height='24px' xmlns='http://www.w3.org/2000/svg'
    x='0px' y='0px' {...props}
  >
    <g fill={props.color || '#3e3832'}>
      <path
        fill={props.color || '#3e3832'}
        d='M23.53,11.47l-5-5c-0.293-0.293-0.768-0.293-1.061,0c-0.294,0.293-0.294,0.768,0,1.061l4.47,4.47l-4.47,4.47   c-0.294,0.293-0.294,0.768,0,1.061c0.146,0.146,0.338,0.22,0.53,0.22c0.191,0,0.384-0.073,0.53-0.22l5-5   C23.823,12.238,23.823,11.763,23.53,11.47z'
      />
      <path
        fill={props.color || '#3e3832'}
        d='M2.061,12l4.47-4.47c0.293-0.292,0.293-0.768,0-1.061s-0.768-0.293-1.061,0l-5,5c-0.294,0.293-0.294,0.768,0,1.061l5,5   c0.146,0.146,0.338,0.22,0.53,0.22c0.191,0,0.384-0.073,0.53-0.22c0.293-0.292,0.293-0.768,0-1.061L2.061,12z'
      />
      <circle fill={props.color || '#3e3832'} r='1.5' cx='12' cy='12' />
      <circle fill={props.color || '#3e3832'} r='1.5' cx='17' cy='12' />
      <circle fill={props.color || '#3e3832'} r='1.5' cx='7' cy='12' />
    </g>
  </svg>
)
