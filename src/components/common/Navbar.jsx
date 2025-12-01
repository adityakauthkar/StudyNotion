import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from 'react-router-dom';
import {NavbarLinks} from "../../data/navbar-links";
import { matchPath } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropdown from '../core/Auth/ProfileDropdown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {

    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=> state.profile);
    const {totalItems} = useSelector((state)=> state.cart); 
    const [loading, setLoading] = useState(false);

    const location = useLocation();


    const [subLinks, setSubLinks] = useState([]);

    const fetchSubLinks = async()=>{
        try {
            setLoading(true);
            const response = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("printing sublinks result", response);
            setSubLinks(response.data.data);
            setLoading(false);
            
        } catch (error) {
            console.log("Could not fetch the category list");
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchSubLinks();
    },[])

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }
  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : "bg-richblack-800"
      } transition-all duration-200 fixed top-0 w-full z-40`}>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '>

        {/* image */}
        <Link to={"/"}>
            <img src={logo} alt="logo" width={160} height={42} loading='lazy'/>
        </Link>

        {/* nav list */}
        <nav className="hidden md:block">
            <ul className='flex gap-x-6 text-richblack-25'>
                {
                    NavbarLinks.map((link, index)=>(
                         <li key={index}>
                            {
                            link?.title === "Catalog" ? (
                                <div className={`group relative flex cursor-pointer items-center gap-1 ${
                                        matchRoute("/catalog/:catalogName")
                                        ? "text-yellow-25"
                                        : "text-richblack-25"
                                    }`}>
                                    <p>{link.title}</p>
                                    <IoIosArrowDown />

                                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col gap-y-6 rounded-lg bg-richblack-5 p-8 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                         <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>

                                    
                                         {loading ? (
                                            <div>Loading...</div>
                                        ) : (
                                            subLinks.length > 0 ? (
                                                subLinks.map((subLink, index) => (
                                                    <Link to={`catalog/${subLink.name}`} key={index}>
                                                        <div className="flex items-center">
                                                            <p>{subLink.name}</p>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div>No categories available</div>
                                            )
                                        )}

                                    </div>

                                    
                                </div>

                            )
                            :(
                                <Link to={link?.path}>
                                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                        {link.title}
                                        
                                    </p>
                                </Link>
                            )
                        }
                        </li>
                    ))
                }
            </ul>
        </nav>

        {/* Login/Signup/Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
                {
                    user && user?.accountType != "Instructor" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100"  />
                            {
                                totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                         {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to="/login">
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Log in
                            </button>    
                        </Link>
                    )  
                }

                {
                    token === null && (
                        <Link to="/signup" >
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Sign Up
                            </button>
                        </Link>
                    ) 
                }
                {
                    token !== null && ( <ProfileDropdown />
                    )
                }
                
        </div>
                <button className="mr-4 md:hidden">
                <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                </button>
        </div>
    </div>
  )
}

export default Navbar