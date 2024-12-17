import React from 'react'
import { MoonLoader } from 'react-spinners'

function Loading() {
  return (
      <div className='flex justify-center mt-12'>
        <MoonLoader size={'45 rem'} />
      </div>
  )
}

export default Loading