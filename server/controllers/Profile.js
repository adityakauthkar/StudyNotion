const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress")
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");
require("dotenv").config();

exports.updateProfile = async(req, res) => {
    try {//TODO: how to schedule the req in such a way that account of user to be deleted after 5 days
        //cron job


        // console.log("here baby")
        //get data 
        const {dateOfBirth="", about="", gender, contactNumber, firstName, lastName} = req.body;
        console.log("req.body", req.body);
        // return;

        //get userId
        const id =  req.user.id;
        //validation
        if(!gender || !contactNumber || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        //find profile
        console.log("id", id);
        uid = JSON.stringify(id);
        console.log("id", uid);
        
        const userdetails = await User.findById(id).populate("additionDetails").exec();
        console.log("userdetails", userdetails);
        console.log("profileid", userdetails.additionDetails._id);
        const profileId = userdetails.additionDetails._id;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        profileDetails.about = about;
        let data;
        if(firstName || lastName){
           data=  await User.findByIdAndUpdate({_id: id}, {firstName, lastName}).populate("additionDetails");
          console.log("kkk",data);
        }
        await profileDetails.save();
        
        console.log("here updated profiel", profileDetails)
        //return response
        return res.status(200).json({
            success: true,
            profileDetails: data,
            message: "Profile is updated successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating profile",
        })
    }
}


exports.deleteUser = async(req, res) => {
    try {
        //get id 
        // console.log("object", req.user);
        const id = req.user.id;

        // validate id
        console.log("id", id);
        const userdetails = await User.findById(id);
        if(!userdetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        // delete profile
        // console.log("object", userdetails.additionDetails);
        await Profile.findByIdAndDelete({_id: userdetails.additionDetails});
        //TODO: unroll user from all enrolled users

        //delete user
        await User.findByIdAndDelete({_id: id});
        //return response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured while deleting user",
        })
    }
}


//getuser handler
exports.getUserDetails = async(req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validate that get user details
        const userdetails = await User.findById(id).populate("additionDetails").exec();

        if(!userdetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        //return response
        return res.status(200).json({
            success: true,
            userdetails,
            message: "User details fetched successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while fetching user data, Please try again",
        })   
    }
}

//update displaypicture
exports.updateDisplayPicture = async(req, res) => {
    try {
        //get id
        const id = req.user.id;

        //validate id
        const userdetails = await User.findById(id);

        if(!userdetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        
        
        //update image
        console.log('req.files', req.files)
        const image = req.files.image;
        console.log("image", image);
        //upload image to cloudinary
        const result = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
        console.log("result", result.url)
        //update image url in db
        const profileDetails = await User.findByIdAndUpdate({_id: id}, 
            {image: result.secure_url}, {new: true});

        //return response
        return res.status(200).json({
            success: true,
            profileDetails,
            message: "Profile picture updated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
//get enrolled courses

exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      console.log("userid", userId)
      let userDetails = await User.findOne({
		_id: userId,
	  }).populate(
        {
            path: 'courses',
        populate: {
          path: 'courseContent',
          populate: {
            path: 'subSection'
          }
        }
        }
      )
		.exec()
        console.log("userdetails", userDetails)

        // Explicitly log courseContent and its subSection
        // userDetails.courses.forEach(course => {
        //     console.log(`Course: ${course.courseName}`);
        //     course.courseContent.forEach(content => {
        //       console.log(`  Course Content ID: ${content._id}`);
        //       content.subSection.forEach(sub => {
        //         console.log(`    SubSection Title: ${sub.title}`);
        //         console.log(`    SubSection Duration: ${sub.timeDuration}`);
        //       });
        //     });
        //   });



      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }

      userDetails = userDetails.toObject();
    //   console.log("userdetails", userDetails)
      var subSectionLength = 0;
      console.log("length ", userDetails?.courses?.length)
      for(var i = 0; i < userDetails?.courses?.length; i++){
        let totalDurationInSeconds = 0;
        subSectionLength = 0;
        console.log("content ki length", userDetails?.courses[i]?.courseContent?.length)
        for(var j = 0; j<userDetails.courses[i].courseContent.length; j++){
            // totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
            // userDetails.courses[i].totalDuration = convertSecondsToDuration(
            //     totalDurationInSeconds
            // )
            console.log("totaldureations", totalDurationInSeconds)
              subSectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length;
            console.log("subSectionLength", subSectionLength)
        }

        let progressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
		    userID: userId,
        })


        progressCount = progressCount?.completedVideos.length || 0;
        console.log("progressCount", progressCount)

        if (subSectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage = Math.round(
              (progressCount / subSectionLength) * 100 * multiplier
            ) / multiplier;
            
              
            console.log("progressPercentage", userDetails.courses[i].progressPercentage)
          }
      }
      console.log("progress percentage", userDetails.courses)
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
        message: "success"
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async(req, res) => {
    try {

        const courseDetails = await Course.find({instructor: req.user.id});

        const courseData = courseDetails.map((course)=> {
            const totalStudentsEnrolled = course.studentEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            //create new object with a additional field
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription : course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated
            };

            return courseDataWithStats;
        })

        return res.status(200).json({
            success:true,
            course: courseData,
            message: "Courses fetched successfully"
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}