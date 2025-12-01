const Course = require("../models/Course");
//const Category = require("../models/Category")
const User = require("../models/User");
const Categorys = require("../models/Category");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

//create course handler
exports.createCourse = async(req, res) => {
    try {
        //fetch data 
        console.log("req ki body", req.body);
        const {courseName, courseDescription, whatWillYouLearn, price, tags, Category,instructions} = req.body;

        //get thumbnail Image
        const thumbnail = req.files.thumbnailImage;
 
        //validation
        console.log("courseName", courseName, "courseDescription", courseDescription, "whatWillYouLearn", whatWillYouLearn, "price", price, "tag", tags, "Category", Category, "thumbnail", thumbnail);
        if(!courseName || !courseDescription || !whatWillYouLearn || !price
            || !tags  || !Category || !thumbnail || !instructions){
                return res.status(401).json({
                    success: false,
                    message: "Fill all the details carefully",
                })
        
        }
        //check for is it instructor
        const userId = req.user.id;
        console.log("object", userId);
        const instructorDetails = await User.findById(userId);
        console.log("instructor details", instructorDetails);
        //TODO : check that userId and instructordetails id same or different

        if(!instructorDetails){
            return res.status(402).json({
                success: false,
                message: "Instructor details are Incorrect",
            })
        }

        //check given tag is valid or not
        console.log("tag", tags);
        console.log("Category", Category);

        const tagDetails = await Categorys.findById(Category);
        if(!tagDetails){
            return res.status(400).json({
                success: false,
                message: "Tag details are Incorrect",
            })
        }
        console.log("tagDetails", tagDetails);
        //upload image to cloudinary
        
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
        
        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatWillYouLearn: whatWillYouLearn,
            price,
            tags: tags,
            category: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
            instructions: instructions
        });
        //add the new course to the user schema of Instructor
        const addCourseToUser = await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id
                }
            },
            {new: true},
        )
        //update tag schema
        const addCourseToTag = await Categorys.findByIdAndUpdate(
            {_id: tagDetails._id},
            {
                $push:{
                    course: newCourse._id,
                }
            }
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
            userData: addCourseToTag,
            categoryData: tagDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while creating new course",
        })
    }
}

//getAll courses handler

exports.showAllCourse = async(req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true,
        }).populate("Instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses are fetched successfully",
            data: allCourses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while fetching all courses"
        })
        
    }
}

//get Course details

exports.getAllCourseDetails = async(req, res) => {
    try {
        //get course id from req ki body 
        const {courseId} = req.body;

        //now validate that courseid
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course is not available",
            })
        }
        //now fetch all the course details
        const courseDetails = await Course.findById(
            {_id: courseId}
        ).populate({
            path: "instructor",
            populate: {
                path: "additionDetails"
            }
        }).populate("ratingAndReviews")
        .populate("category")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .populate("studentEnrolled").exec();

        //now validate that courseDetails
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Course details are not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: courseDetails,
            message: "Course details are fetched successfully",
            
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

exports.editCourse = async(req, res) => {
    try {
        const {courseId} = req.body;
        const updates = req.body;
        console.log("courseId", courseId, "updates", updates);
        const course = await Course.findById(courseId);
        console.log("course", course)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            })
        }

        //if thumbnail image found then update it
        // if(req.files.thumbnail){
        //     const thumbnail = req.files.thumbnailImage;
        //     const thumbnailimage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        //     course.thumbnail = thumbnail.secure_url;
        // }

        //update only the fields that are present in req.body
        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                if(key === "tag" || key === "instructions"){
                    course[key] = JSON.parse(updates[key]);
                }else{
                    course[key] = updates[key];
                }
            }
        }
        console.log("before save");
        await course.save();
        console.log("after save")
        const _id = updates.courseId
        const updatedCourse = await Course.findById({
            _id
        })
        .populate({
            path: "instructor",
            populate: {
                path: "additionDetails",
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        }).exec();
        // console.log("updatedCourse", updatedCourse);

        res.status(200).json({
            success: true,
            data: updatedCourse,
            message: "Course updated successfully",
        })
    } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}


exports.getCourseDetails = async(req, res) =>{
    try {
        const {courseId} = req.body;
        const courseDetails =  await Course.findById(courseId)
                                .populate({
                                    path: "instructor",
                                    populate: {
                                        path: "additionDetails"
                                    }
                                })
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                    path: "courseContent",
                                    populate: {
                                        path: "subSection",
                                        select: "videofile"
                                    },
                                })
                                .exec();
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            })
        }


        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
        })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
        success: true,
        data: {
            courseDetails,
            totalDuration,
        },
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }
}


exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      console.log("courseId", courseId)
      console.log("userId", userId)
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
        console.log("courseDetails : ", courseDetails)
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userID: userId,
      })
      if(courseProgressCount){
        console.log("courseProgressCount : ", courseProgressCount)
  
      console.log("courseProgressCount : ", courseProgressCount.completedVideos.length)
      }
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      // console.log("coursedeatils : ", courseDetails)
      courseDetails.courseContent.forEach((content) => {
        console.log("content : ", content)
        content.subSection.forEach((subSection) => {
          console.log("subSection : ", subSection)
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
          console.log("timeduration", totalDurationInSeconds);
        })
      })
      // console.log("here i", totalDurationInSeconds)
      // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
      // console.log("totalDuration : ", totalDuration)
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          // totalDuration,
          completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
          // completedVideos: courseProgressCount?.completedVideos
          //   ? courseProgressCount?.completedVideos
          //   : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
      console.log("instructorId", instructorId)
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
        message: "instructor courses retrieved successfully"
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }