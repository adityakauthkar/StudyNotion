import React from 'react'
import { Link } from 'react-router-dom'
import GetAvgRating from '../../../utils/avgRating';
import RatingStars from '../../common/RatingStarts';
import { useEffect, useState } from 'react';


const Course_Card = ({Course, height}) => {
    console.log("course inside card", Course);
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=>{
        console.log("checking course", Course)
        const count = GetAvgRating(Course?.ratingAndReviews);
        setAvgReviewCount(count);

    },[Course])

  return (
    <div>
            
        <Link  to={`/courses/${Course._id}`} >
        <div className="">
          <div className="rounded-lg">
                    <img src={Course?.thumbnail}
                         alt="course thumnail"
                         className={`${height} w-full rounded-xl object-cover `}/>
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">{Course?.courseName}</p>
                    <p className="text-sm text-richblack-50">{Course?.instructor?.firstName} {Course?.instructor?.lastName}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">{avgReviewCount || 0}</span>
                        <RatingStars Review_Count={avgReviewCount}></RatingStars>
                        <span className="text-richblack-400">{Course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-xl text-richblack-5">₹ {Course?.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card