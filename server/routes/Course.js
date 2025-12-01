const express = require('express');
const router = express.Router();

const {
    createCourse,
    showAllCourse,
    getAllCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    getFullCourseDetails
    
    
} = require("../controllers/Courses");


//categories contollers import
const {
    createCategories,
    showAllCategories,
    categoryPageDetails
} = require("../controllers/Category");


//section controllers import
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section");


//sub-section controllers import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/SubSection");


//rating and review controllers import
const {
    createRating,
    averageRating,
    getAllRatingsAndReviews
} = require("../controllers/RatingAndReview");

//importing course progress controller
const {
    updateCourseProgress
} = require("../controllers/CourseProgress");

//importing middleware
const {auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth");

//********************************************************************* */
//                          Course Routes
//********************************************************************* */

//route for creating course
router.post("/createCourse", auth, isInstructor, createCourse);

//add section to course
router.post("/addsection", auth, isInstructor, createSection);

//update section
router.put("/updatesection", auth, isInstructor, updateSection);

//delete section
router.delete("/deletesection", auth, isInstructor, deleteSection);

//add subsection to section
router.post("/addsubsection", auth, isInstructor, createSubSection);

//update subsection
router.put("/updatesubsection", auth, isInstructor, updateSubSection);


//delete subsection
router.delete("/deletesubsection", auth, isInstructor, deleteSubSection);



//route for showing all courses
router.get("/showall", showAllCourse);

//route for getting all course details
router.post("/getCourseDetails",  getAllCourseDetails);

//route for edit course
router.post("/editCourse", auth, isInstructor, editCourse);

//route for getting all courses of instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

//route for delting course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)

//route for getting full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

//********************************************************************* */
//                         Rating and Review Routes
//********************************************************************* */

//route for creating rating and review
router.post("/createrating", auth, isStudent, createRating);


//route for getting all ratings and reviews
router.get("/getratings", getAllRatingsAndReviews);

//route for getting average rating
router.get("/averagerating", averageRating);



//******************************************************************** */
//                          Categories Routes
//******************************************************************** */


//route for creating categories
router.post("/createcategories", auth, isAdmin, createCategories);

//route for showing all categories
router.get("/showcategories", showAllCategories);

//route for getting category page details
router.post("/categorypagedetails", categoryPageDetails);

//******************************************************************** */

//                          Course Progress Routes
//******************************************************************** */

//route for updating course progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router; 

