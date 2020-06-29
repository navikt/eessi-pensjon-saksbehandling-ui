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
      strokeLinejoin='round' strokeLinecap='round'
    >
      <path d='M.5 23.5h23M1.5 13v6.5c0 1.102.9 2 2 2h17c1.1 0 2-.898 2-2v-6.5' />
      <path d='M1.5 13c0 1.381 1.5 2.5 2.5 2.5s2.5-1.119 2.5-2.5c0 1.521 1.5 2.75 2.75 2.75s2.75-1.229 2.75-2.75c0 1.521 1.5 2.75 2.75 2.75s2.75-1.229 2.75-2.75c0 1.381 1.5 2.5 2.5 2.5s2.5-1.119 2.5-2.5v-2.5h-21v2.5zM7 3c0 .829-.672 1.5-1.5 1.5-.829 0-1.5-.671-1.5-1.5 0-.827 1.5-2.5 1.5-2.5s1.5 1.673 1.5 2.5zM20 3c0 .829-.672 1.5-1.5 1.5-.829 0-1.5-.671-1.5-1.5 0-.827 1.5-2.5 1.5-2.5s1.5 1.673 1.5 2.5zM13 3c0 .829-.672 1.5-1.5 1.5-.829 0-1.5-.671-1.5-1.5 0-.827 1.5-2.5 1.5-2.5s1.5 1.673 1.5 2.5zM10.5 6.5h2v4h-2zM4.5 6.5h2v4h-2zM17.5 6.5h2v4h-2z' />
    </g>
  </svg>
)
