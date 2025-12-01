const BASE_URL =  process.env.REACT_APP_BASE_URL;

export const endpoints = {
    SENDOTP_API: BASE_URL + "/user/sendotp",
    SIGNUP_API: BASE_URL + "/user/signup",
    LOGIN_API: BASE_URL + "/user/login",
    RESETPASSTOKEN_API: BASE_URL + "/user/resetpasswordtoken",
    RESETPASSWORD_API: BASE_URL + "/user/resetpassword",
  }
  

export const categories = {
    CATEGORIES_API: BASE_URL + '/course/showcategories',
}

export const contactusEndpoints = {
    CONTACTUS_API: BASE_URL + "/contact/contactus",
}

export const profileEndPoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getuser",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/getInstrucotrDashboard",
}


// SETTINGS PAGE API
export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updatedisplaypicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/update",
    CHANGE_PASSWORD_API: BASE_URL + "/user/changepassword",
    DELETE_PROFILE_API: BASE_URL + "/profile/delete",
  }

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/categorypagedetails",
}

//STUDENTS END POINTS
// payment/capturepayment
// /verifysignature
export const studentEndPoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturepayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifysignature",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}


export const courseEndpoints = {
    GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
    COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
    EDIT_COURSE_API: BASE_URL + "/course/editCourse",
    COURSE_CATEGORIES_API: BASE_URL + "/course/showcategories",
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    CREATE_SECTION_API: BASE_URL + "/course/addsection",
    CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
    UPDATE_SECTION_API: BASE_URL + "/course/updatesection",
    UPDATE_SUBSECTION_API: BASE_URL + "/course/updatesubsection",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
    DELETE_SECTION_API: BASE_URL + "/course/deletesection",
    DELETE_SUBSECTION_API: BASE_URL + "/course/deletesubsection",
    DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED:
      BASE_URL + "/course/getFullCourseDetails",
    LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
    CREATE_RATING_API: BASE_URL + "/course/createRating",

}

//rating and reveiws
export const ratingEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getratings",
}