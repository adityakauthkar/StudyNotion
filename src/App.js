import "./App.css";
import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import MyProfile from "./pages/MyProfile";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart"
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import Settings from "./components/core/Dashboard/Settings";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses"
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetailsSidebar from "./components/core/ViewCourse/VideoDetailsSidebar";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";


function App() {

  const user = useSelector((state) => state.profile.user)
  console.log("user", user)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/catalog/:categoryName" element={<Catalog></Catalog>}></Route>
        <Route path="/courses/:courseId" element={<CourseDetails></CourseDetails>}></Route>

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

    <Route 
    path="forgot-password"
    element={
      <OpenRoute>
        <ForgotPassword/>
      </OpenRoute>
    }></Route>

    <Route 
        path="verify-email"
        element={
          <OpenRoute>
            <VerifyEmail/>
          </OpenRoute>
    }></Route>

        <Route 
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }></Route>

          <Route
            path="about"
            element={
              <About></About>
            }
          ></Route>

          <Route path="contact" element={<Contact></Contact>}></Route>

          <Route 
          element={
            <PrivateRoute>
              <Dashboard></Dashboard>
            </PrivateRoute>
          }
          >

          <Route path="dashboard/my-profile"
          element = {<MyProfile></MyProfile>}>
          </Route>
          {/* completed styling still here */}

          

          <Route
          path="dashboard/settings"
          element={<Settings></Settings>}
          ></Route>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" 
                  element={<EnrolledCourses></EnrolledCourses>}
                  ></Route> 

                  <Route
                  path="dashboard/cart"
                  element={<Cart></Cart>}
                  ></Route>
              </>
            )
          }


{
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/add-course" 
                  element={<AddCourse></AddCourse>}
                  ></Route> 

                <Route path="dashboard/my-courses" 
                  element={<MyCourses></MyCourses>}></Route>

                <Route path="dashboard/edit-course/:courseId"
                  element={<EditCourse></EditCourse>}
                ></Route>

                <Route
                  path="dashboard/instructor"
                  element={<Instructor></Instructor>}
                ></Route>
              </>
            )
          }

          </Route>


          <Route
            element={
              <PrivateRoute>
                <ViewCourse></ViewCourse>
              </PrivateRoute>
            }
          > 
              {
                user?.accountType === ACCOUNT_TYPE.STUDENT && (
                  // view-course/6696e0ce4c4d2fc8aab91882/section/undefined/sub-section/undefined
                  <Route path="view-course/:courseId/section/:sectionId/subSection/:subSectionId"
                    element={<VideoDetails></VideoDetails>}
                  ></Route>
                )
              }

          </Route> 

          

          <Route path="*" element={<Error></Error>}></Route>
    
      </Routes> 
    </div>
  );
}

export default App;
