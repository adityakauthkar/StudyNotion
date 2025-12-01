const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection")


exports.createSection = async(req, res)=> {
    try {
        //data fetch
        const {sectionName, courseId} = req.body;
        console.log("section", sectionName, courseId);

        //data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create section
        const newSection = await  Section.create({sectionName});
        console.log("newSection", newSection);

        //update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true}
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();
        console.log("updatedCourseDetails", updatedCourseDetails);
        //HM : use populate in such a way that replace sections and 
        //subsections both in the updatedCoursesDetails

        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while creating section",
        })
    }
}

//update section
exports.updateSection = async(req, res)=>{
    try {
        //data input
        const {sectionName, sectionId,  courseId} = req.body;
        console.log("sectionName", sectionName, "sectionId", sectionId)

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing the properties",
            })
        }
        //data update
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new: true}
        )
        console.log("updatedSection", updatedSection)

        //
        const courses = await Course.findById(courseId)
                            .populate({
                                path:"courseContent",
                                populate:{
                                    path:"subSection"
                                }
                            }).exec();
        //return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while updating section"
        })
    }
}


//delete section
exports.deleteSection = async(req, res) => {
    try {
        // res.send("delete section")
      //get id => assuming that we are sending id in params
      //HM req.params ke sath test karana
      const {sectionId, courseId} = req.body;
      console.log("sectionid cou;seid", sectionId, courseId);
      
      //TODO: do we need to delete the id from course schema??
      await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
        //use findbyidanddelete
       const section = await Section.findById(sectionId);
       console.log(sectionId, courseId);
       if(!section) {
           return res.status(404).json({
               success:false,
               message:"Section not Found",
           })
       }
      //return res  
       
      await SubSection.deleteMany({_id: {$in: section.subSection}});

      await Section.findByIdAndDelete(sectionId);

      //find course for sending response
      const updatedCourse = await Course.findById(courseId)
                            .populate({
                                path: "courseContent",
                                populate:{
                                    path: "subSection"
                                }
                            }).exec()
      
      console.log("her we are")
      return res.status(200).json({
        success: true,
        data:updatedCourse,
        message: "Section is deleted successfully"
      })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while deleting section, Please try again", 
        })
    }
}