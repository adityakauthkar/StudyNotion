import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import {useState, useEffect} from "react"
import RenderSteps from '../AddCourse/RenderSteps';
// import {  getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';

const EditCourse = () => {
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const populateCourseDetails = async() => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            console.log("result", result);

            if(result){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.courseDetails));
            }

            setLoading(false);
        }
        populateCourseDetails();
    }, [])


    if(loading){
        return <p>Loading...</p>
    }

  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Course
        </h1>
        <div className="mx-auto max-w-[600px]">
            {
                course ? (<RenderSteps></RenderSteps>) : 
                (
                    <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                        Course not found
                    </p>
                )
            }
        </div>
    </div>
  )
}

export default EditCourse