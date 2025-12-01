import {React, useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import {IoIosArrowBack} from 'react-icons/io';
import {BsChevronDown} from 'react-icons/bs';

const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus , setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("")
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId, subSectionId} = useParams();
    console.log("sectionId", sectionId,"subsectionid", subSectionId);
    const [loading, setLoading] = useState(false);

    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state)=> state.viewCourse);
    console.log("printing data here", courseSectionData,"let's creating some spacing", courseEntireData, totalNoOfLectures, "checking completed videos", completedLectures?.length);


    useEffect(()=>{
        setLoading(true);
        (()=>{
            if(!courseSectionData.length){
                return;
            }
            const currentSectionIndex = courseSectionData.findIndex((section)=>{
                console.log("section", section)
              return  section._id === sectionId; 
            })
            console.log("coursesectionindex", currentSectionIndex)

            const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
                
                (data)=>{ console.log("dataof subsection", data);
                    return data._id === subSectionId
                }
            )
            console.log("currentsubsectionindex", currentSubsectionIndex)

            const activeSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubsectionIndex]?._id;
            console.log("activesubsectionid", activeSubSectionId)
            //set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            //set current subsection here
            setVideoBarActive(activeSubSectionId);
        })()
        setLoading(false);
    },[courseEntireData, courseSectionData, location.pathname, completedLectures])

  return (
    <div className='lg:-mt-4'>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            {/* for buttons and heading */}
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                {/* for buttons div */}
                <div className="flex w-full items-center justify-between ">
                    <div
                        onClick = {() => navigate("/dashboard/enrolled-courses")}
                        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                         title="back"
                    >
                        <IoIosArrowBack size={30} />
                    </div>

                    <div>
                        <IconBtn
                            text="Add Review"
                            customClasses="ml-auto"
                            onClick={() => {
                                // console.log("clicked on me", )
                               return setReviewModal(true)}}
                        ></IconBtn>
                    </div>
                </div>
                {/* for heading and title */}
                <div className="flex flex-col">
                        <p>
                            {courseEntireData?.courseName}
                        </p>
                        <p className="text-sm font-semibold text-richblack-500">
                            {completedLectures?.length}/{totalNoOfLectures}
                        </p>
                </div>
            </div>

            {/* for sections and subSections */}
            <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData?.map((section, index)=>(
                        console.log("section", section, activeStatus),
                        <div key={index}
                        className="mt-2 cursor-pointer text-sm text-richblack-5"
                            onClick={() => setActiveStatus(section?._id)}
                        >   
                                {/* section */}
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {section?.sectionName}
                                </div>
                                {/* add arrow icon here and handle rotate 180 degree logic */}
                                <div className="flex items-center gap-3">
                                <span
                                    className={`${
                                    activeStatus === section?.sectionName
                                        ? "rotate-0"
                                        : "rotate-180"
                                    } transition-all duration-500`}
                                >
                                    <BsChevronDown />
                                </span>
                                </div>
                            </div>

                                 {/* subSections */}
                            <div>
                                 {
                                    activeStatus === section?._id && (
                                        <div className="transition-[height] duration-500 ease-in-out">
                                            {
                                                section?.subSection?.map((topic, index)=>(
                                                    console.log("topic", topic),
                                                    <div 
                                                        className={`flex gap-3  px-5 py-2 ${
                                                            videoBarActive === topic._id
                                                            ? "bg-yellow-200 font-semibold text-richblack-800"
                                                            : "hover:bg-richblack-900"
                                                        } `}
                                                        key={index}
                                                        onClick = {() => {
                                                            navigate(
                                                                `/view-course/${courseEntireData?._id}/section/${section?._id}/subSection/${topic?._id}`
                                                            )

                                                            setVideoBarActive(topic?._id);
                                                        }}
                                                        >
                                                        <input type="checkbox"
                                                                checked = {completedLectures?.includes(topic?._id)}
                                                                // onChange = {() => {}}
                                                            />
                                                            <span>
                                                                {topic?.title}
                                                            </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                 }
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default VideoDetailsSidebar