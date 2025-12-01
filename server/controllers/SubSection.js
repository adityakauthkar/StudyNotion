const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

//create subsection
exports.createSubSection = async(req, res) => {
    try {
        //fetch data from req body
        const {sectionId, title, description, timeDuration} = req.body;
        console.log("sectionId", sectionId, "title", title, "description", description, "timeDuration", timeDuration)
        //extract file/ video
        console.log("req.files", req.files)
        const video = req.files.videoFile;
        console.log("object", video);
        //validation //timeduration
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        //upload video to cloudinary
        const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        
        //create subsection
        const newSubsection = await SubSection.create(
        {
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadVideo.secure_url,
        }
        );
        //update section with this subsection id
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push: {
                    subSection: newSubsection._id
                }
            },
            {new: true},
        ).populate("subSection")
        //TODO:  log updated section here after populate query
        console.log("updated section", updatedSection);

        //return response
        return res.status(200).json({
            success: true,
            data: newSubsection,
            message: "SubSection is created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error, Please try again",
        })
    }
}


//HM: update subsection
exports.updateSubSection = async(req, res) => {
    try {
        //fetch data which want to update
        const {title, description, timeDuration, subSectionId} = req.body;
        console.log("title, ", title, "description", description, "timeDuration", timeDuration, "subSectionId", subSectionId);

        //extract video file as well
        const video = req.files.videoFile;

        //validate that data || !timeDuration
        if(!title || !description  || !subSectionId || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        //db call findbyidandupdate and update that data
        const uploadvideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log("uploadvideo", uploadvideo.secure_url, "subsectionid", subSectionId);
        const updatedsubsectionDetails = await SubSection.findByIdAndUpdate(
            {_id: subSectionId},
            {
                title: title,
                description: description,
                timeDuration: timeDuration,
                videoUrl: uploadvideo.secure_url,
            },
            {new: true},
        )
        //TODO: log updated subsection details here
        console.log("here");
        //return response
        return res.status(200).json({
            success: true,
            updatedsubsectionDetails,
            message: "Subsection is updated successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating subsection, please try agian",
        })
    }
};

//HM: delete subsection
exports.deleteSubSection  = async(req, res) => {
    try {
        //get subsectionid from param 
        // const {subsectionId} = req.params.id;
        const {subSectionId, sectionId} = req.body;
        console.log("subsection and section id", subSectionId, sectionId)
        //findbyidanddelete delete subsection
        await SubSection.findByIdAndDelete(
            {_id: subSectionId},
        )
        //TODO: do we need to delete the subsection id from section schema also
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull:{
                    subSection: subSectionId
                }
            }
        )

        const updatedSection = await Section.findById(sectionId).populate("subSection");

        //return response
        return res.status(200).json({
            success: true,
            data: updatedSection,
            message: "Subsection is deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting the subsection, Please try again",
        })
    }
}