import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { Link } from 'react-router-dom';
import {BiArrowBack} from 'react-icons/bi'
import {AiOutlineEye} from 'react-icons/ai'
import {AiOutlineEyeInvisible} from 'react-icons/ai'

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const dispatch = useDispatch();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const {loading} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) =>{
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            [e.target.name] : e.target.value,
        }))
    }

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        const token = location.pathname.split("/")[2];
        dispatch(resetPassword(password, confirmPassword, token, navigate));
    }


  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading? (
                <div>Loading...</div>
            ):(
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        Choose new password
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        Almost done. Enter your new password and youre all set.
                    </p>
                    <form action="" onSubmit={handleOnSubmit}>
                        <label htmlFor=""className="relative mt-3 block">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            New Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input type={showPassword ? "text" : "password"}
                        required
                        name='password'
                        value={password}
                        onChange={handleOnChange}
                        placeholder='Password'
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                          }}
                          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                         />
                         <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            >
                            {showPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                        </label>
                        
                        <label className="relative mt-3 block">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm New Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input type={showConfirmPassword ? "text" : "password"}
                        required
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleOnChange}
                        placeholder='Confirm Password'
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                          }}
                          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                         />
                         <span 
                            onClick={()=> setShowConfirmPassword((prev)=>!prev)}
                         className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                         
                         >
                            {showConfirmPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                         </span>
                        </label>


                        <button
                            type="submit"
                            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                            >
                            Reset Password
                        </button>

                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/login">
                                <p className="flex items-center gap-x-2 text-richblack-5">
                                <BiArrowBack />
                                    Back to Login
                                </p>
                            </Link>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword