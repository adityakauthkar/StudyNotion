import React from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import {useState} from 'react'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import getCatalogPageData from '../services/pageAndComponentData'
import {useEffect} from 'react'
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Course_Card  from '../components/core/Catalog/Course_Card'

const Catalog = () => {

  const {categoryName} = useParams();
  // console.log("categoryName", categoryName)
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [active, setActive] = useState(1)
  const [loading, setLoading] = useState(false);

  //fetch all the catagories
  useEffect(() => {

      const getCategoryDetails = async () => {
        setLoading(true);
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        // console.log("res?.data?.data", res.data.data)
        const categoryData = res?.data?.data || [];
        // console.log("categoryName", res.data.data[1].name.split(" ").join("-"), "    ", categoryName.split(" ").join("-"))
        const transformedCategoryName =  categoryName.split(" ").join("-").toLowerCase();
        const filteredCategory = await categoryData.filter(
          ct => ct.name.split(" ").join("-").toLowerCase() === transformedCategoryName
        );
        if (filteredCategory.length > 0) {
          console.log("category got ", filteredCategory[0]._id)
          setCategoryId(filteredCategory[0]._id);
        } else {
          console.error(`Category "${categoryName}" not found.`);
        }
        setLoading(false);
        // setCatagoryId(category_Id);
      }
      getCategoryDetails();
      
  },[categoryName])


  // let response;
  useEffect(() => {
    if (!categoryId) return; // Ensure categoryId is not empty
    const getCategoryPageDetails = async() => {
            setLoading(true);
      try {
        console.log("catagoryId", categoryId)
        const response = await getCatalogPageData(categoryId);
        console.log("printing res", response);
        if(response?.success === false){
          console.log("error in fetching the data");
          return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
              <div>{response.message}</div>
              <h1>error in fetching the data</h1>
            </div>
          )
        }
        
        setCatalogPageData(response);

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    getCategoryPageDetails();
  }, [categoryId])

  if(loading){
    return (
      <div className='Spinner'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }

  return (
    <div className=" box-content  ">
          <div className=" px-20 mx-auto bg-richblack-800 lg:w-full flex min-h-[260px]  flex-col justify-center gap-4  ">
            <p className="text-sm text-richblack-300">
              {`Home / Catalog / `}
              <span className="text-yellow-25 ">
                {catalogPageData?.selectedCategory?.name || "Loading..."}
              </span>
          </p>
          <p className="text-4xl text-richblack-5">
            {catalogPageData?.selectedCategory?.name || "Loading..."}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.selectedCategory?.description || "Loading..."}
          </p>
        </div>

        <div>
          {/* section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent text-white">
            <div className="section_heading text-4xl">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Popular
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)} 
              >
                New
              </p>
            </div>
            <CourseSlider Courses = {catalogPageData?.selectedCategory?.course}></CourseSlider>
          </div>

          {/* section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent text-white">
            <div className="section_heading">
              Top Courses in {catalogPageData?.selectedCategory?.name}
              </div>
             <div className="py-8">
                 <CourseSlider  Courses = {catalogPageData?.differentCategory?.course}></CourseSlider>
             </div>
          </div>

          {/* section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent text-white">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {
                  
                  catalogPageData?.mostSellingCouses?.map((course, index) =>
                      // console.log("course", catalogPageData.mostSellingCouses.map((course)=>console.log("coursesss",course)))
                      (
                        // <div>this is map</div>
                      <Course_Card key={index} Course = {course} height={"h-[350px]"}></Course_Card>
                    ))
                }
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
    </div>
  )
}

export default Catalog