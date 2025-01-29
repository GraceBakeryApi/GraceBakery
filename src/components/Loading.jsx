import React from 'react'
import { MoonLoader } from 'react-spinners'

function Loading() {
  return (
    <div className='flex justify-center mt-12'>
      <MoonLoader size={'45px'} />
    </div>
  )
}

export default Loading