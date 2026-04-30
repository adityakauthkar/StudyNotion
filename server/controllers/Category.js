const Category = require("../models/Category");


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//create Category
exports.createCategories = async(req, res) =>{
    try {
        const {name, description} = req.body;

        if(!name && !description){
            return res.status(400).json({
                success: false,
                message: "All the fields are required",
            })
        }

        const CategorysData = await Category.create({
            name: name,
            description: description,
        });

        console.log("Categorys info: ",CategorysData);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


//get all Category=> showAllCategorys

exports.showAllCategories = async(req, res) => {
    try {

        const allCategories = await Category.find({}, {name: true, description: true});

        return res.status(200).json({
            success: true,
            data: allCategories,
            message: "All Categorys are returned successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}






exports.categoryPageDetails = async(req, res) => {
    try {
        //ger category id
        // console.log("req.body", req.body);

        const {categoryId} = req.body;
        console.log("categoryId", categoryId)
        const _id = categoryId;
        console.log("_id", _id);
        //get courses for that category id
        const selectedCategory = await Category.findById(_id)
                                        .populate({
                                            path: "course",
                                            $match: {status: "Published"},
                                            populate: "ratingAndReviews",
                                            populate: {
                                                path: "instructor"
                                            }
                                        })
        //validation
        console.log("selected category", selectedCategory);
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "category not found",
            })
        }

        if(selectedCategory.course.length === 0){
            console.log("No courses found for the selected category");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category",
            })
        }


        console.log("here", selectedCategory.course.length);
        //get courses for different categories
        const categoriesExceptSelected = await Category.find({
                    _id: {
                        $ne: categoryId
                    }
        })
        console.log("categoriesExceptSelected", categoriesExceptSelected);
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        ).populate({
            path: "course",
            $match: {status: "Published"},
        })
        .exec()
        console.log("differentCategory", differentCategory);
        //get top selling courses across all categories
        const allCategories = await Category.find()
                            .populate({
                                path: "course",
                                $match: {status: "Published"},
                                populate: {
                                    path: "instructor"
                                }
                            }).exec();

        console.log("allCategories", allCategories);
        const allCourses = allCategories.flatMap((category) => category.course);
        console.log("allCourses", allCourses);
        const mostSellingCouses = allCourses.sort((a,b) =>b.sold - a.sold).slice(0,10);
        console.log("mostSellingCouses", mostSellingCouses);

        
        //get top 10 selling courses
        //HM :  T
        //return res
        return res.status(200).json({
            success: true,
            message: "Category details are fetched successfully",
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCouses
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}





//category details page
// exports.categoryPageDetails = async(req, res) => {
//     try {
//         const {categoryId} = req.body;

//         const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

//         console.log("selected category", selectedCategory);

//         if(!selectedCategory){
//             res.status(404).json({
//                 success: false,
//                 message: "Category not found",
//             })
//         }

//         if(selectedCategory.courses.length === 0){
//             console.log("No courses found for the selected category");
//             res.status(404).json({
//                 success: false,
//                 message: "No courses found for the selected category",
//             })
//         }

//         const selectedCourse = selectedCategory.courses;

//         //get courses for other categories
//         const categoriesExceptSelected = await Category.findById({
//             id: {$ne: categoryId}
//         }).populate("courses");

//         let differentCourses = []
//         for(const category of categoriesExceptSelected){
//             differentCourses.push(...category.courses);
//         }

//         //get top selling courses across all categories
//         const allCategoriesCourses = await Category.find().populate("courses");
//         const allCourses = allCategoriesCourses.flatMap((category) => {
//             category.course;
//         })
//         const mostSellingCouses = allCourses
//                                 .sort((a, b)=> b.sold - a.sold)
//                                 .slice(0, 10);

//         return res.status(200).json({
//             success:true,
//             selectedCourse: selectedCourse,
//             differentCourses: differentCourses,
//             mostSellingCouses: mostSellingCouses,
//             message: "All category details are fetched successfully",
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error occured while fetching category details",
//         })
//     }
// }