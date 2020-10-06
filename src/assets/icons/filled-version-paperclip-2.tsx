import React from 'react'
const FilledPaperClipIcon: React.FC = (props: any) => (
  <svg
    contentScriptType='text/ecmascript' zoomAndPan='magnify'
    contentStyleType='text/css'
    id='Filled_Version' enableBackground='new 0 0 24 24' version='1.1'
    width='30px' preserveAspectRatio='xMidYMid meet'
    viewBox='0 0 24 24' height='30px' xmlns='http://www.w3.org/2000/svg'
    x='0px' y='0px' {...props}
  >
    <g fill={props.color || '#3e3832'}>
      <g fill={props.color || '#3e3832'}>
        <path
          fill={props.color || '#3e3832'}
          d='M11,24c-2.896,0-5-2.313-5-5.5V7c0-3.99,2.795-7,6.5-7C16.206,0,19,3.01,19,7v8.498c0,0.552-0.447,1-1,1    c-0.552,0-1-0.448-1-1V7c0-2.897-1.893-5-4.5-5S8,4.103,8,7v11.5c0,1.743,0.928,3.5,3,3.5s3-1.757,3-3.5V9.498    c0-0.602-0.146-2-1.5-2c-1.354,0-1.5,1.398-1.5,2v7.5c0,0.552-0.447,1-1,1c-0.552,0-1-0.448-1-1v-7.5c0-2.393,1.407-4,3.5-4    c2.094,0,3.5,1.607,3.5,4V18.5C16,21.688,13.897,24,11,24z'
        />
      </g>
    </g>
  </svg>
)
export default FilledPaperClipIcon
