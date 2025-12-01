import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import IconBtn from '../../common/IconBtn';
// import { setCourse } from '../../../slices/courseSlice';
import { useState } from 'react';
import CoursesTable from './InstructorCourses/CoursesTable';
import {VscAdd} from 'react-icons/vsc'
import "../../../App.css"

const MyCourses = () => {
    const {token} = useSelector((state)=> state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const result = await fetchInstructorCourses(token);
                if(result){
                        setCourses(result);
                }
            } catch (error) {
                console.log("unable to fetch courses");
            }
            setLoading(false);
        }
        fetchCourses();
    }, [])
    
    if(loading){
        return (
            <div className='Spinner mx-auto mt-20'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }

  return (
    <div className="mt-[70px]">
        <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
            <IconBtn text="Add Course"
            onClick={()=>navigate("/dashboard/add-course")}
            >
                <VscAdd />
            </IconBtn>
        </div>
        {courses && <CoursesTable courses = {courses} setCourses = {setCourses}></CoursesTable>}
    </div>
  )
}

export default MyCourses