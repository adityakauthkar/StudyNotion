import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import {FaShareSquare} from 'react-icons/fa'

const CourseDetailsCard = ({course, setConfirmationModal, handleBuyCourse}) => {
    console.log("checking upcoming courses", course)
    // console.log("course",course, "type", typeof(course?.price));
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

  
         const enrolledIds = course?.studentEnrolled?.map(student => student._id);

         const isUserEnrolled = user && enrolledIds?.includes(user._id);
        //  console.log("isuserEnrolled", isuser)

    console.log("user", user, "token", token, "inside here courses", course);

    const {
        thumbnail: ThumbnailImage,
        price: currentPrice
    } = course

    const handleAddToCart = () => {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are an Instructor, you can't buy a course");
            return;
        }

        if(token){
            console.log("")
            //token hai matlab logged in hai
            dispatch(addToCart(course));
            navigate("/dashboard/cart")
            return;
        }
        //ya fir logged in hi nahi hai
        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please login to add to cart",
            btn1text: "Login",
            btn2text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    };

    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link C opied to Clipboard")
    };

  return (
        <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
            <img 
                src={ThumbnailImage} 
                alt="Course Thumbnail" 
                className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
            />
            <div className="px-4">
                <div className="space-x-3 pb-4 text-3xl font-semibold">
                    Rs. {currentPrice}
                </div>
                <div className="flex flex-col gap-4">
                    <button
                        className="yellowButton"
                        onClick={user && isUserEnrolled ? () => navigate("/dashboard/enrolled-courses") : handleBuyCourse}
                    >
                        {user && isUserEnrolled ? "Go to Course" : "Buy Course"}
                    </button>
                    {!isUserEnrolled && (
                        <button className="blackButton" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    )}
                </div>
                <div className="pb-3 pt-6 text-center text-sm text-richblack-25">
                    30-Day Money-Back Guarantee
                </div>
                <div>
                    <p className="my-2 text-xl font-semibold">
                        This Course Includes:
                    </p>
                    <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                        {course?.instructions?.map((item, index) => (
                            <p key={index} className="flex gap-2">
                                <span>{item}</span>
                            </p>
                        ))}
                    </div>
                </div>
                <div className="text-center">
                    <button
                        className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
                        onClick={handleShare}
                    >
                        <FaShareSquare size={15} /> Share
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CourseDetailsCard