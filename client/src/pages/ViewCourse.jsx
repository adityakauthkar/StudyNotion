import React from 'react'
import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures, updateCompletedLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import '../App.css'

const ViewCourse = () => {

    const [reviewModal, setReviewModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const {courseId} = useParams();
    console.log("courseid from params",courseId);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    console.log("reviewmodal", reviewModal)

    useEffect(()=>{
        setLoading(true);
        const setcourseSpecificData = async() => {
            
            const courseData = await getFullDetailsOfCourse(courseId, token);
            console.log("courseData", courseData);
            dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
            dispatch(setEntireCourseData(courseData?.courseDetails));
            dispatch(setCompletedLectures(courseData?.completedVideos));
            let lectures = 0;
            
            courseData?.courseDetails?.courseContent?.forEach((section)=> {
                lectures += section.subSection.length;
            })
            dispatch(setTotalNoOfLectures(lectures));
            
        }
        setcourseSpecificData();
        setLoading(false);
    },[courseId, token, dispatch])

     if(loading){
        return (
            <div className='Spinner'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }
  return (
    <div className="lg:mt-[70px]">
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal}></VideoDetailsSidebar>

            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                  <div className="mx-6">
                <Outlet></Outlet>
            </div>
            </div>
            {  
            reviewModal && (<CourseReviewModal setReviewModal={setReviewModal}></CourseReviewModal>)
              }
        </div>

        
    </div>
  )
}

export default ViewCourse