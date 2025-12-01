const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection")

exports.updateCourseProgress = async (req, res) => {
    console.log("inside update course progress", req.body, req.user);
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;
    console.log("courseId", courseId, "subSectionId", subSectionId, "userId", userId);

    if(!courseId || !subSectionId){
        return res.status(400).json({error: "Invalid request"});
    }

    if(!userId){
        return res.status(404).json({
            error: "User not found"
        })
    }

    try {
            // check if the subsection is valid or not
            console.log("inside try block");
            const subSection = await SubSection.findById(subSectionId);
            console.log("subSection", subSection);

            if(!subSection){
                return res.status(404).json({
                    error: "Invalid subsection"
                })
            }

            //check for old entry of mark as completed
            const courseProgress = await CourseProgress.findOne({
                courseID: courseId,
                userID: userId
            });
            console.log("courseProgress", courseProgress);

            if(!courseProgress){
                return res.status(404).json({
                    error: "Course progress not found"
                })
            }
            else{
                //check for recompleting the video of mark as completed
                if(courseProgress.completedVideos.includes(subSectionId)){
                    return res.status(400).json({
                        error: "Video already marked as completed"
                    })
                }
                console.log("course progress", )

                ///update the course progress
                courseProgress.completedVideos.push(subSectionId);
                console.log("course progress", courseProgress);
            }
           await courseProgress.save();

           return res.status(200).json({
                // success: true,
                data: courseProgress,
                message: "Video marked as completed"
            })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}