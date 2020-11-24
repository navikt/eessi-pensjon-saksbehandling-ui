import React from 'react'

const HeartCircle: React.FC<any> = (props: any) => (
  <svg
    contentScriptType='text/ecmascript' width='24'
    zoomAndPan='magnify'
    contentStyleType='text/css' viewBox='0 0 24 24' height='24'
    preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'
    version='1.0'
    {...props}
  >
    <g
      fill='none' strokeMiterlimit='10' stroke={props.color || '#3e3832'}
      strokeLinejoin='round'
    >
      <circle r='11.5' cx='12' cy='12' />
      <path d='M12 18s5.5-4 5.5-6.962c0-3.418-4.5-4.5-5.5-.341-1-4.159-5.5-3.078-5.5.341 0 2.962 5.5 6.962 5.5 6.962z' />
    </g>
  </svg>
)

export default HeartCircle
