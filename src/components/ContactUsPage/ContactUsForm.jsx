import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {apiConnector} from "../../services/apiconnector"
import {contactusEndpoints} from "../../services/apis";
import countryCode from "../../data/countrycode.json";
import toast from 'react-hot-toast';

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors , isSubmitSuccessful},
    } = useForm({
        defaultValues: {
            dropdown: "+91",
        },
    });

    const submitContactForm = async(data) => {
        const toastId = toast.loading("Loading...")
        console.log("Logging data", data);
        try {
            // setLoading(true);
            
            const response = await apiConnector("POST", contactusEndpoints.CONTACTUS_API, data)
            console.log("logging res", response);
            setLoading(false);
            toast.success("Your message Received Successfully")

        } catch (error) {
            console.log("error", error.message);
            // setLoading(false);
            toast.error(error.message)
        }
        toast.dismiss(toastId);
    }


    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                dropdown: "",
                phoneNumber: "",
            });
        }
    }, [isSubmitSuccessful, reset]);

    // if(loading === true){
    //     return (
    //         <div className="">
    //             Loading...
    //         </div>
    //     )
    // }


  return (
    <form onSubmit={handleSubmit(submitContactForm)} action=""
    className="flex flex-col gap-7">
        <div >
            {/* names */}
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="firstname" className="lable-style">
                    First Name
                </label>
                <input type="text" 
                       name='firstName'
                       id='firstName'
                       placeholder='Enter first name'
                       {...register("firstName" ,{required:true})}
                       style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                      }}
                      className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                      />
                {
                    errors.firstName ?
                    (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your name.
                        </span>
                    ) : (<div></div>)
                }
            </div>

            {/* last Name */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor='lastName'
                className="lable-style"
                >Last Name</label>
                <input type="text" 
                       name='lastName'
                       id='lastName'
                       placeholder='Enter Last name'
                       {...register("lastName")}
                       style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                      }}
                      className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                       />
            </div>

        </div>

        {/* email */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email"
                className="lable-style"
                >Email Address</label>
                <input type="email"
                       name='email'
                       id='email'
                       placeholder='Enter email Address'
                       {...register("email", {required: true})}
                       style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                      }}
                      className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                      />
                {
                    errors.email ?
                    (<span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your Email address.
                  </span>) : (<div></div>)
                }
            </div>

            {/* phone number */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phonenumber" className="lable-style">
                Phone Number
                </label>


                <div className="flex gap-5">
                    {/* dropdown */}
                     <div className="flex w-[78px] flex-col gap-2">
                        <select name="dropdown" id="dropdown"
                        {...register("dropdown", {required: true})}
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                          }}
                          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                          >
                            {
                                countryCode.map((country, index)=> {
                                    return (
                                        <option key={index} value={country.code}
                                       > 
                                            {country.code} - {country.country}
                                        </option>
                                    )
                                }) 
                            }
                        </select>
                    </div>

                    
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                            <input type="text"
                                id='phoneNumber'
                                name='phoneNumber'
                                placeholder='12345 67890'
                                {...register("phoneNumber", {
                                    required: { value: true, message: "Phone number is required" },
                                    maxLength: { value: 10, message: "Phone number should be 10 digits" },
                                    minLength: { value: 10, message: "Phone number should be 10 digits" },
                                    pattern: { value: /^[0-9]+$/, message: "Phone number should contain only digits" }
                                })}
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                  }}
                                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                                />
                    </div>
                </div>

                {
                    errors.phoneNumber ?
                    (<span 
                        className="-mt-1 text-[12px] text-yellow-100"
                    >{errors.phoneNumber.message}</span>) : (<div></div>)
                }
            </div>

            {/* message */}
            <div className='flex flex-col gap-2'>
                <label htmlFor="message" className="lable-style">Message</label>
                <textarea 
                name="message" 
                id="message"
                cols="30"
                rows="7"
                placeholder='Enter your message here'
                {...register("message", {required: true})}
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                ></textarea>
                {
                    errors.message ?
                    (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your Message.
                        </span>
                    ) : (<div></div>)
                }
            </div>


            <button
                disabled={loading}
                type="submit"
                className={`w-full rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
                ${
                !loading &&
                "transition-all duration-200 hover:scale-95 hover:shadow-none"
                }  disabled:bg-richblack-500 sm:text-[16px] `}
            >
                Send Message
        </button>
        </div>
    </form>
  )
}

export default ContactUsForm