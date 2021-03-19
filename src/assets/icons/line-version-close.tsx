const Close: React.FC<any> = (props: any) => (
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
      <path d='M.5.5l23 23M23.5.5l-23 23' />
    </g>
  </svg>
)

export default Close
