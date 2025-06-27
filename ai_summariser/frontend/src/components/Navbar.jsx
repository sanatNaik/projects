import React from 'react'

const Navbar = () => {
  return (
    <div className='flex pl-10 items-center justify-start gap-4 w-full h-[15%] bg-bcol border-b-4 border-ocol font-librecaslon'>
      <img src="logo.png" alt="sumitup_logo" className='h-[80%]'/>
      <div className='flex flex-col'>
        <h1 className='flex gap-2 font-bold text-4xl text-ycol'>SumItUp</h1>
        <h2 className='text-ycol text-2xl'>AI Summariser</h2>
      </div>
    </div>
  )
}
export default Navbar
