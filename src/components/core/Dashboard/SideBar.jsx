import React from 'react'
// import { sidebarLinks} from "../../../data/dashboard-links";
import {sidebarLinks} from "../../../data/dashboard-links"
// import  {logout} from "../../../services/operations/authAPI"
import { useSelector } from 'react-redux';
import SideBarLink from './SideBarLink';
import { useDispatch  } from 'react-redux';
import { VscSignOut } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConformationModal from "../../common/ConfirmationModa"
import { logout } from '../../../services/operations/authAPI';

const SideBar = ({modalData}) => {
    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [confrimationModal, setConfirmationModal] = useState(null);
    const navigate = useNavigate();


    if(profileLoading || authLoading){
        return (
          <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
          <div className="spinner"></div>
        </div>
        )
    }

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 mt-4">
        <div className="flex flex-col">
              {
                sidebarLinks.map((link) => {
                  if(link.type && user?.accountType !== link.type){
                    return null;
                  }

                  return (
                    <SideBarLink 
                      key={link.id} 
                      link={link}
                      iconName={link.icon}
                    ></SideBarLink>
                  )
                })
              }
          </div>


          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
          <div className="flex flex-col">
                <SideBarLink
                link={{name:"Settings", path:"/dashboard/settings"}}
                iconName="VscSettingsGear"
                >

                </SideBarLink>

                <button
                onClick={()=> setConfirmationModal({
                    text1:"Are you sure ?",
                    text2: "You will be logged out",
                    btn1Text: "Logout",
                    btn2Text: "Cancel",
                    btn1Handler: () => dispatch(logout(navigate)),
                  
                    btn2Handler: () => setConfirmationModal(null)
                })}
                className="px-8 py-2 text-sm font-medium text-richblack-300"
                >

                  <div className='flex items-center gap-x-2'>
                      <VscSignOut className='text-lg'></VscSignOut>
                      <span>Logout</span>
                  </div>

                </button>
          </div>

        </div>

        {confrimationModal && ( 
            <ConformationModal modalData={confrimationModal}></ConformationModal>
        )}
    </>
  )
}

export default SideBar