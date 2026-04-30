import React, { useDebugValue, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2'
import RequirementField from './RequirementField';
import IconBtn from '../../../../common/IconBtn'
import { COURSE_STATUS } from '../../../../../utils/constants';
import toast from 'react-hot-toast';
import { setCourse } from '../../../../../slices/courseSlice';
import { setStep } from '../../../../../slices/courseSlice';
import Upload from '../CourseBuilder/Upload';
import ChipInput from './ChipInput';
import {MdNavigateNext} from 'react-icons/md'

const CourseInformationForm = () => {
  const {step} = useSelector((state) => state.course);
  
  const {token} = useSelector((state)=> state.auth);
  useEffect(()=>{
    setStep(3);
    console.log(step)
  },[token])
  // console.log("token", token)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
 
  console.log("step", step)
  const {course, editCourse} = useSelector((state) => state.course);
  // console.log("course", course, "editCourse", editCourse)
  // const {step, setStep} = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(()=>{
        // console.log("inside useeffect")

          const getCategories = async() => {
                    setLoading(true);
                    const categories = await fetchCourseCategories();
                    
                    console.log("here")
                      console.log("categories", categories)
                      if(categories){
                        setCourseCategories(categories);
                      }
                      setLoading(false);
            }


      if(editCourse){
        console.log("course", editCourse)
        setValue('courseTitle', course.courseName);
        setValue('courseShortDesc', course.courseDescription)
        setValue('coursePrice', course.price);
        setValue('courseTags', course.tag);
        setValue('courseBenifits', course.whatWillYouLearn);
        setValue('courseCategory', course.category);
        setValue('courseThumbnail', course.thumbnail);
        setValue('courseRequirements', course.instructions);
      }
      // setLoading(false);
    
    getCategories();

    }, [] )//end of useeffect

  const isFormUpdated = () => {
        console.log("here in the updated form")
            const currentValues = getValues();
            console.log("currentValues", currentValues)
               if(currentValues.courseTitle !== course.name ||
                  currentValues.courseShortDesc !== course.description ||
                  currentValues.coursePrice !== course.price ||
                  currentValues.courseTags !== course.tags ||
                  currentValues.courseBenifits !== course.whatWillYouLearn ||
                  currentValues.courseCategory !== course.category ||
                  currentValues.courseThumbnail !== course.thumbnail ||
                  currentValues.courseRequirements.toString() !== course.instructions.toString() ){
                  return true;

              }
            else{
              console.log("inside here in the else")
              return false;
            }
    }


  const onsubmit = async (data) => {
  console.log("Form data", data);
  setLoading(true);

  try {
    const formData = new FormData();

    if(editCourse) {
      // Edit mode: only send changed fields
      formData.append("courseId", course._id);

      if(data.courseTitle !== course.courseName) {
        formData.append("courseName", data.courseTitle);
      }
      if(data.courseShortDesc !== course.courseDescription) {
        formData.append("courseDescription", data.courseShortDesc);
      }
      if(data.coursePrice !== course.price) {
        formData.append("price", data.coursePrice);
      }
      if(JSON.stringify(data.courseTags.map(tag => tag.value)) !== JSON.stringify(course.tags)) {
        formData.append("tags", JSON.stringify(data.courseTags.map(tag => tag.value)));
      }
      if(data.courseBenefits !== course.whatWillYouLearn) {
        formData.append("whatWillYouLearn", data.courseBenefits);
      }
      if(data.courseCategory !== course.category._id) {
        formData.append("Category", data.courseCategory);
      }
      if(data.thumbnailImage && data.thumbnailImage !== course.thumbnail) {
        formData.append("thumbnailImage", data.thumbnailImage); // File object
      }
      if(JSON.stringify(data.courseRequirements) !== JSON.stringify(course.instructions)) {
        formData.append("instructions", JSON.stringify(data.courseRequirements));
      }

      // If no fields changed
      if(formData.entries().next().done) {
        toast.error("No changes made to the form");
        setLoading(false);
        return;
      }

      const response = await editCourseDetails(formData, token);
      if(response) {
        dispatch(setCourse(response));
        dispatch(setStep(2));
      }
    } else {
      // Create mode: send all fields
      formData.append("courseName", data.courseTitle);
      formData.append("courseDescription", data.courseShortDesc);
      formData.append("price", data.coursePrice);
      formData.append("Category", data.courseCategory);
      formData.append("whatWillYouLearn", data.courseBenefits);
      formData.append("instructions", JSON.stringify(data.courseRequirements));
      formData.append("thumbnailImage", data.thumbnailImage); // File object
      formData.append("tags", JSON.stringify(data.courseTags.map(tag => tag.value)));
      formData.append("status", COURSE_STATUS.DRAFT);

      const result = await addCourseDetails(formData, token);
      if(result) {
        dispatch(setCourse(result));
        dispatch(setStep(2));
      }
    }
  } catch (error) {
    console.log("Form submit error", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form
    onSubmit={handleSubmit(onsubmit)}
    className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title<sup className="text-pink-200"> *</sup></label>
          <input type="text" 
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle", {required: true})} 
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"/>
          {
            errors.courseTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course title is required
              </span>
            )
          }
      </div>
          

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
            Course Short Description <sup className="text-pink-200">*</sup></label>
        <textarea name="" id="courseShortDesc"
          placeholder='Enter Description'
          {...register("courseShortDesc", {required: true})}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full min-h-[140px] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
         
        >
          {
            errors.courseShortDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Description is required
              </span>
            )
          }
        </textarea>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup></label>
          
        <div className="relative">
          <HiOutlineCurrencyRupee
            className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400"
          />
          <input
            type="text"
            id="coursePrice"
            placeholder="Enter Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: /^[0-9]*$/,
            })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pl-10 text-richblack-5"
          />
        </div>

        {
          errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
          )
        }
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup></label>
        <select name="" id="courseCategory"
          defaultValue=""
          {...register("courseCategory", {required: true})}  
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        >
          <option value="" disabled className="text-richblack-5">Choose a Category</option>
          { 
            !loading && courseCategories.map((category, index) => (
              <option key={index} value={category._id}>
                {category?.name}</option>
            ))
          }
            
          
        </select>

        {
          errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
          )
        }
      </div>

      {/* create a custom component for handling tags input */}
      <ChipInput
        label = "Tags"
        name = "courseTags"
        placeholder = "Enter tags and press enter"
        register = {register}
        errors = {errors}
        setValue = {setValue}
        getValues = {getValues}
      ></ChipInput>

      {/* create a component for uploading and showing preview of media */}
      <Upload
        label = "Course Thumbnail"
        name = "thumbnailImage"
        register = {register}
        errors = {errors}
        setValue = {setValue}
        getValues = {getValues}
      ></Upload>

      {/* Benifits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup></label>
        <textarea name="" id="courseBenefits"
          placeholder='Enter Benefits of the course'
          {...register("courseBenefits", {required: true})}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full min-h-[150px] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        ></textarea>
        {
          errors.courseBenefits && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
          )
        }
      </div>


      <RequirementField
        name = "courseRequirements"
        label = "Requirements/Instructions"
        register = {register}
        errors = {errors}
        setValue = {setValue}
        getValues = {getValues} 
      ></RequirementField>

      <div>
      {/* {console.log(editCourse)} */}
        { 
          editCourse && (
            <button 
              onClick={()=> dispatch(setStep(2))}
            type="submit" className='bg-richblack-100 text-white p-2 rounded-md'>
              Continue Without Saving
            </button>
          )
        }
      </div>

      <IconBtn disabled={loading}

        text = {!editCourse ? "Next" : "Save Changes"}
      >
        <MdNavigateNext />
      </IconBtn>

    </form>
  )
}

export default CourseInformationForm

