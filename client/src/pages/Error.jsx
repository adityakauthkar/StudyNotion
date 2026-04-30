import React from 'react'
import { RiArrowGoBackLine } from 'react-icons/ri'
import IconBtn from '../components/common/IconBtn'
import { useNavigate } from 'react-router-dom'
import Home from './Home'

const Error = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/")
  }

  const gobackk = () => {
    //navigate this to the previous page
    navigate(-1)
  }
  return (
    <div>
      <div className='relative mx-auto flex flex-col w-screen h-screen items-center justify-center
    text-white gap-y-10 ' >
      <div className='flex justify-center items-center text-3xl text-white'>
      Error 404 - Page Not found

      
    </div>
      
    <div className = "flex flex-row gap-x-4 ">
    <IconBtn text={"Back To Home"}
    onClick={goBack}>
     <RiArrowGoBackLine  />
     </IconBtn>

    <IconBtn
    text={"Go Back"}
    onClick={gobackk}
             >
            <RiArrowGoBackLine  />
     </IconBtn>

    </div>
    </div>
    
    </div>
  )
}

export default Error