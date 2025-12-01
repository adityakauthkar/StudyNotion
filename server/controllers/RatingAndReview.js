const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { Mongoose } = require("mongoose");

//create rating 
exports.createRating = async(req, res) => {
    try {
        //get userid
        const userId = req.user.id;
        //fetch data from req body
        const {rating, review, courseId} = req.body;
        console.log("rating", rating, "review", review, "courseId", courseId);
        //check if user is enrolled or not
        const courseDetails = await Course.findOne({_id: courseId, 
                                    studentEnrolled: {$elemMatch: {$eq: userId}}});
        
        console.log("courseDetails", courseDetails)
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "User is not enrolled in the course",
            })
        }
        //check if user already  reviewd to that course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
        console.log("alreadyReviewed", alreadyReviewed);
        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "Course is already reviewed by the user"
            })
        }
        //create rating and review
        const createRatingReview = await RatingAndReview.create(
            {
                rating: rating,
                review: review,
                user: userId,
                course: courseId
            }
        )
        console.log("createRatingReview", createRatingReview);
        //update course with this rating and review
        const updateCourse = await Course.findByIdAndUpdate(
            {_id: courseId},
            {
                $push: {
                        ratingAndReviews: createRatingReview._id,
                }
            },
            {new: true},
        )
        console.log("updated course details", updateCourse);

        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and reviews are created successfully",
            createRatingReview,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured while creating ratings and reviews",
        })
    }
}


//get average rating

exports.averageRating = async(req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new Mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "rating"
                    }
                }
            }
        ])
        //return avg rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }
        //if No rating available
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no ratings given till now",
            averageRating: 0,
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Error occured in average Rating"
        })
    }
}

//get all ratings and reviews

exports.getAllRatingsAndReviews = async(req, res)=> {
    try {
        const allReview = await RatingAndReview.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path: "user",
                                    select: "firstName lastName email image"
                                })
                                .populate({
                                    path: "course",
                                    select: "courseName"
                                }).exec();

        return res.status(200).json({
            success: true,
            message: "All reviews are fetched successfully",
            data: allReview,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}