import React from 'react'

import Course_Card from './Course_Card'
import {Swiper, SwiperSlide} from 'swiper/react'
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import {Autoplay,FreeMode, Pagination} from "swiper/modules"

const CourseSlider = ({Courses}) => {
  console.log("we are here in the courseslider ccourses", Courses)
  return (
    <>
      {
        Courses?.length? (
          <Swiper
          modules={[FreeMode, Pagination, Autoplay]}
          slidesPerView={1}
          freeMode={true}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={200}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          breakpoints ={{
            1024: {slidesPerView: 3},
          }}
          className="max-h-[30rem]"
          >
            {
              Courses.map((course,index)=>(
              
                  <SwiperSlide key={index}>
                    <Course_Card Course={course} height={"h-[250px]"}></Course_Card>  
                  </SwiperSlide>
                
              ))
            }
              
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">No Course Found</p>
        )
      }
    </>
  )
}

export default CourseSlider



