import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { signUp } from '../services/operations/authAPI';
import {RxCountdownTimer} from 'react-icons/rx'
import {BiArrowBack } from 'react-icons/bi'

const VerifyEmail = () => {
//    const {loading} = useSelector((state)=> state.auth.loading);
//    const {signupData} = useSelector((state)=> state.auth.signupData);
    const {loading, signupData} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
 
   const navigate = useNavigate();

   useEffect(() => {
        if(!signupData){
            navigate('/signup')
        }
   },[signupData, navigate])

   const onSubmitHandler = (e) => {

        console.log("signupData", signupData);
         e.preventDefault();
         const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            
         } = signupData;

         dispatch(signUp(accountType, firstName, lastName, email, password,
            confirmPassword, navigate));
         
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center" >
        {
            loading ? (
                <div>Loading...</div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
                        Verify Email
                    </h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
                        A verification code has been sent to you. Enter the code below
                    </p>
                    <form action="" onSubmit={onSubmitHandler}>
                        
                        

                        <button
                        type="submit"
                        className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
                        >
                            Verify Email
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <Link to={"/login"}>
                                <p className="text-richblack-5 flex items-center gap-x-2">
                                <BiArrowBack />
                                    Back to Login
                                </p>
                            </Link>
                        </div>

                        <button 
                        className="flex items-center text-blue-100 gap-x-2"
                     >
                             <RxCountdownTimer />
                            Resend it
                        </button>
                    </div>
                
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail