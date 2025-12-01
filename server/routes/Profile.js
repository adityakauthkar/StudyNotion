const express = require("express");
const router = express.Router();

const {auth, isInstructor} = require("../middlewares/auth");
const {
    deleteUser,
    updateProfile,
    getUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard

} = require("../controllers/Profile");

//**********************   ************************************************* */
//                          Profile Routes
//***************************************************************************** */

//route for updating profile
router.put("/update", auth, updateProfile);

//route for deleting user
router.delete("/delete",auth, deleteUser);

//route for getting user details
router.get("/getuser", auth, getUserDetails);

//route for updatedisplaypicture
router.put("/updatedisplaypicture", auth, updateDisplayPicture);

//get enrolled courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

//get instructor dashboard
router.get("/getInstrucotrDashboard", auth, isInstructor, instructorDashboard);


//exporting the router
module.exports = router;