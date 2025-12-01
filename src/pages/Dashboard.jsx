// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Outlet } from 'react-router-dom';
// import SideBar from '../components/core/Dashboard/SideBar';

// const Dashboard = () => {
//     const {loading} = useSelector((state)=> state.auth);
//     const {profileLoading} = useSelector((state) => state.profile);

//     if(loading || profileLoading){
//         return <div className='mt-10'>Loading...</div>
//     }
//   return (
//     <div className='flex relative min-h-[calc(100vh-3.5rem)]'>
//         <SideBar></SideBar>
//         <div className='h-[calc(100vh-3.5rem)] overflow-auto '>
//             <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
//                 <Outlet></Outlet>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Dashboard



// Dashboard.js
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import SideBar from '../components/core/Dashboard/SideBar';

const Dashboard = () => {
    const {loading} = useSelector((state)=> state.auth);
    const {profileLoading} = useSelector((state) => state.profile);

    if (loading || profileLoading) {
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="Spinner"></div>
      </div>
    }

    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <SideBar />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
