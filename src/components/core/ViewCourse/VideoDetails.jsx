import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {useRef, useState, useEffect} from 'react'
import {updateCompletedLectures} from "../../../slices/viewCourseSlice"
import { Player } from 'video-react';
import 'video-react/dist/video-react.css'; 
import { FaRegCirclePlay } from "react-icons/fa6";
import IconBtn from '../../common/IconBtn';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import {BigPlayButton} from 'video-react';
import "../../../App.css"
import Hls from 'hls.js';

const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  console.log("courseid", courseId, "sectionid", sectionId, "subsectionid", subSectionId);
  const {token} = useSelector((state)=> state.auth);
  const {courseEntireData, courseSectionData, completedLectures} = useSelector((state)=> state.viewCourse);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState("")
  const [hlsUrl, setHlsUrl] = useState("");

  useEffect(() => {
    console.log("Completed lectures updated", completedLectures);
  }, [completedLectures]);
  
  useEffect(() => {
    console.log("useEffect triggered");
    // existing code
}, [courseSectionData, courseEntireData, location.pathname]);
useEffect(() => {
  console.log("videoData state updated", videoData);
}, [videoData]);


  useEffect(()=>{
    
    const setVideoSpecificDetails = async() => {
      setLoading(true);
      console.log("courseSectiondata", courseSectionData)
      if(!courseSectionData.length){
        return;
      }

      if(!courseId || !sectionId || !subSectionId){
        navigate("/dashboard/enrolled-courses");
      }else{
        //let's assume all of them are present
        const filteredData = courseSectionData?.filter((section) => {
          console.log("logging section details here", section);
          return section._id === sectionId
        })
        console.log("filtered datq", filteredData)

        if(filteredData.length > 0){
          const filterVideoData = await filteredData?.[0].subSection?.filter((subSection) => {
            console.log("logging subsection details here", subSection);
            return subSection._id === subSectionId;

          })
             console.log("filteredd video data", filterVideoData)
        }
        console.log("courseentire data", courseEntireData)
        setPreviewSource(courseEntireData?.thumbnail);

        // setVideoData(filterVideoData[0]);
        // setVideoEnded(false);
        if (filteredData.length > 0) {
          const filterVideoData = filteredData[0].subSection.filter((subSection) => subSection._id === subSectionId);
          if (filterVideoData.length > 0) {
            setVideoData(filterVideoData[0]);
            setVideoEnded(false);
            setHlsUrl(filterVideoData[0].videoUrl); // Assuming videoUrl is the HLS URL
          }
        }

      }
    }

    setVideoSpecificDetails();
    setLoading(false);
  },[courseSectionData, courseEntireData, completedLectures, sectionId, subSectionId, location.pathname])

  const isFirstVideo = () => {
      const currentSectionIndex =  courseSectionData.findIndex(
        (section) => section._id === sectionId
      )
      console.log("currentsectionindexxxx", currentSectionIndex);

      const currentSubsectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
        (data) => data._id === subSectionId
      )
      console.log("currentsubsectionindexxxxx", currentSectionIndex);

      if(currentSectionIndex === 0 && currentSubsectionIndex === 0){
        return true;
      }else{
        return false;
      }
  }

  const isLastVideo = () => {
      const currentSectionIndex = courseSectionData?.findIndex(
        (section)=> section?._id === sectionId
      )

      const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection?.length;

      const currentSubsectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
        (data)=> data?._id === subSectionId
      )

      if(currentSectionIndex === courseSectionData.length - 1 && currentSubsectionIndex === noOfSubSections - 1){
        return true;
      }
      else{
        return false;
      }
  }

  const goToNextVideo = () => {
      const currentSectionIndex = courseSectionData?.findIndex(
        (section)=> section?._id === sectionId
      )

      const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection?.length;

      const currentSubsectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
        (data)=> data?._id === subSectionId
      )

      if(currentSubsectionIndex !== noOfSubSections-1){
        //same section ki next video me jao
        const nextSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubsectionIndex + 1]._id;
        console.log("next subsection id", nextSubSectionId);
        // next video pr navigate karo
        navigate(`/view-course/${courseId}/section/${sectionId}/subSection/${nextSubSectionId}`)
      }
      else{
        //different section ki first video me jao
        const nextSection = courseSectionData[currentSectionIndex + 1]._id;
        console.log("next section", nextSection);

        const nextSubSection = courseSectionData[currentSectionIndex + 1]?.subSection?.[0]?._id;
        console.log("next subsection", nextSubSection);
        
        //next video pe jao
        navigate(`/view-course/${courseId}/section/${nextSection}/subSection/${nextSubSection}`)
      }
  }

  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
        (section) => section?._id === sectionId
    );
    console.log("current section index for previous data", currentSectionIndex);

    const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection?.length;
    console.log("no of subsection", noOfSubSections);

    const currentSubsectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
        (data) => data?._id === subSectionId
    );
    console.log("current subsection index", currentSubsectionIndex);

    if (currentSubsectionIndex !== 0) {
        const prevSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection[currentSubsectionIndex - 1]?._id;
        console.log("prev subsection id", prevSubSectionId);
        navigate(`/view-course/${courseId}/section/${sectionId}/subSection/${prevSubSectionId}`);
    } else {
        const prevSectionId = courseSectionData[currentSectionIndex - 1]?._id;
        console.log("prev section id", prevSectionId);

        const subSectionLength = courseSectionData[currentSectionIndex - 1]?.subSection?.length;
        console.log("subsection length", subSectionLength);
        console.log("data of subsection", courseSectionData[currentSectionIndex - 1]?.subSection?.[subSectionLength - 1]);

        const prevSubSectionId = courseSectionData[currentSectionIndex - 1]?.subSection?.[subSectionLength - 1]?._id;
        console.log("prev subsection id", prevSubSectionId);

        console.log("navigating to prev video", `/view-course/${courseId}/section/${prevSectionId}/subSection/${prevSubSectionId}`);
        navigate(`/view-course/${courseId}/section/${prevSectionId}/subSection/${prevSubSectionId}`);
    }
}

  const handleLectureCompletion = async() => {
    //writing dummy code
    setLoading(true);

    const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
    console.log("logging this res", res?.completedVideos?.length);
    const len = res?.completedVideos?.length
    console.log("logging this res", res?.completedVideos?.[len-1]);
    const latesId = res?.completedVideos?.[len-1]
    //  state update
    if(res){
      dispatch(updateCompletedLectures(latesId));
    } 
    setLoading(false);
  }
  

  if(loading){
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="Spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData ? (
          <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
        ): (
          <Player
              ref = {playerRef}
              aspectRation = "16:9"
              autoPlay = {true}
              // src={hlsUrl}
              // playing={true}
              controls={true}
              playInline
              onEnded = {() => setVideoEnded(true)}
              src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />

            {
              videoEnded && (
                <div style={{
                      backgroundImage:
                        "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                    }}
                    className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">
                  {
                    !completedLectures.includes(subSectionId) && (
                      <IconBtn
                        disabled={loading}
                        customClasses="text-xl max-w-max px-4 mx-auto"
                        onClick={handleLectureCompletion}
                        text={!loading ? "Mark as Completed" : "Loading"}
                      ></IconBtn>
                    )
                  }

                  <IconBtn
                    disabled={loading}
                    onClick={() => {
                      console.log("clicked on replay");
                      if(playerRef?.current){
                        playerRef?.current?.seek(0);
                        setVideoEnded(false);
                        playerRef?.current?.play();
                      }
                    }}
                    text="Replay"
                    customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                  ></IconBtn>

                  <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                    {!isFirstVideo() && (
                      <button 
                        disabled={loading}
                        onClick={goToPreviousVideo}
                        className="blackButton"
                      >
                        Prev
                      </button>
                    )}
                    {
                      !isLastVideo() && (
                        <button 
                        disabled={loading}
                        onClick={goToNextVideo}
                        className="blackButton"
                      >
                        Next
                      </button>
                      )
                    }
                  </div>
                </div>
              )
            }
          </Player>
        )
      }
      <h1 className="mt-4 text-3xl font-semibold">
        {
           videoData?.title
        }
      </h1>
      <p className="pt-2 pb-6">
        {
          videoData?.description
        }
      </p>
    </div>
  )
}

export default VideoDetails