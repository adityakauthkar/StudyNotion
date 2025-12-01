import {React, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
// import {ReactStars} from "react-rating-stars-component"
import ReactStars from "react-rating-stars-component";
import IconBtn from "../../common/IconBtn"
import { createRating } from '../../../services/operations/courseDetailsAPI';


const CourseReviewModal = ({setReviewModal}) => {
    console.log("inside review boss..................", )

    const {user} = useSelector((state)=> state.profile);
    const {token} = useSelector((state)=> state.auth);
    const {courseEntireData} = useSelector((state)=> state.viewCourse)
    console.log("user", user, "token", token, "coursedata", courseEntireData);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors}
    } =  useForm();


    useEffect(()=> {
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    },[])



    const ratingChanged = (newRating) => {
        console.log("newRating", newRating);
        setValue("courseRating", newRating);
    }


    const onSubmit = async(data) => {
        console.log("data", data);
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience,
            },
            token
        );
        setReviewModal(false);
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* modal header */}
            <div>
                <p>Add Review</p>
                <button
                    onClick={() => setReviewModal(false)}
                >
                    Close
                </button>
            </div>

            {/* modal body */}
            <div>
                <div>
                    <img src={user?.image} alt="User Image"
                        className="aspect-square w-[50px] rounded-full object-cover"
                    />
                    <div>
                        <p>
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p>
                            Posting Publicly
                        </p>
                    </div>
                </div>


                <form action=""
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 flex flex-col items-center"
                >
                    
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={28}
                        activeColor="#ffd700"
                    ></ReactStars>

                    <div>
                        <label htmlFor="courseExperience">
                            Add Your Experience*
                        </label>
                        <textarea name="" id="courseExperience"
                            placeholder = "Add Your Experience here"
                            {...register("courseExperience", {required: true})}
                            className = "form-style min-h-[130px] w-full"
                        ></textarea>
                        {
                            errors.courseExperience && (
                                <span>
                                    Please add your experience
                                </span>
                            )
                        }
                    </div>

                    {/* Cancel and Save button */}
                    <div>
                        <button
                            onClick={() => setReviewModal(false)}
                        >
                            Cancel
                        </button>
                        <IconBtn
                            text="Save"
                        ></IconBtn>
                    </div>

                </form>
            </div>

        </div>
    </div>
  )
}

export default CourseReviewModal