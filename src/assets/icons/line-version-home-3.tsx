const HomeIcon: React.FC<any> = (props: any) => (
  <svg
    contentScriptType='text/ecmascript'
    zoomAndPan='magnify'
    contentStyleType='text/css' viewBox='0 0 24 24' width={24} height={24}
    preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <g
      fill='none' strokeMiterlimit='10' stroke={props.color || '#3e3832'}
      strokeLinejoin='round'
    >
      <path strokeLinecap='round' d='M.5 23.5h23' />
      <path strokeLinecap='round' d='M3.5 13.5h17v10h-17zM12 5l-11.5 8.5h23z' />
      <path d='M20.5 11.292v-4.292h-3v2.078' />
      <path d='M6.5 16.5h3v5h-3zM12.5 16.5h5v3h-5zM5.5 21.5h5v2h-5z' />
    </g>
  </svg>
)

export default HomeIcon
