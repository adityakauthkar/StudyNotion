import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import {IoAddCircleOutline} from 'react-icons/io5'
import {MdNavigateNext} from 'react-icons/md'

const CourseBuilderForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null);
  const {course} = useSelector((state) => state.course);
  const {token} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async(data) => {
      console.log("inside onsubmit")
      setLoading(true);
      let result;
      console.log("data", data.sectionName);
      console.log("course", course._id)


      if(editSectionName){
        console.log("updatesection","iska dat", data , "editsectionname", editSectionName, "courseid", course._id, "token", token)

        //we are editing the section name
        result = await updateSection({
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course._id
        }, token
      );

      }
      else{
        console.log("createsection", "iske datas", data.sectionName, course._id)
        
        result = await createSection({
          sectionName: data.sectionName,
          courseId: course._id,

        }, token)
        console.log("result of create section", result);
      }
      //update values
      console.log("result", result)
      if(result){
        dispatch(setCourse(result));
        setEditSectionName(null);
        setValue("sectionName", "");
      }

      //loading false
      setLoading(false);
  }

  const cancelEdit = () => {
    setEditSectionName(null); 
    setValue("SectionName","");
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if(course?.courseContent?.length === 0){
      toast.error("Please add atleast one section");
      return;
    }

    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each section");
      return;
    }
    //if everything is good 
    dispatch(setStep(3));
  }


  const handleChangeEditSectionName = (sectionId, sectionName) =>{
    if(editSectionName === sectionId){
        cancelEdit();
        return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

        <form action=""  onSubmit={handleSubmit(onSubmit)} className="space-y-4 border border-richblack-700 p-6 rounded-md">
          <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section name <sup className="text-pink-200">*</sup>
            </label>
            <input type="text" 
              id='sectionName'
              placeholder="Add section name"
              {...register('sectionName', {required: true})}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.3)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            />

            {
              errors.sectionName && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Section name is required
                </span>
              )
            }
          </div>

          <div className="flex items-end gap-x-4">
            <IconBtn
              type="submit"
              text={editSectionName ? "Edit Section Name" : "Create Section"}
              outline = {true}
            >
                <IoAddCircleOutline size={20} className='text-yellow-50' />
            </IconBtn>
            {
              editSectionName && (
                <button
                  type='button'
                  onClick={cancelEdit}
                  className="text-sm text-richblack-300 underline"
                >
                  Cancel Edit
                </button>
              )
            }
          </div>
        </form>

        {
          course.courseContent.length > 0 && (
            <NestedView 
            handleChangeEditSectionName={handleChangeEditSectionName}
            ></NestedView>
          )
        }

        <div className="flex justify-end gap-x-3">
            <button
             onClick={goBack}
             className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
              Back
            </button>

            <IconBtn
              disabled={loading}
              text={"Next"}
              onClick={goToNext}
            >
              <MdNavigateNext />
            </IconBtn>
        </div>
    </div>
  )
}

export default CourseBuilderForm