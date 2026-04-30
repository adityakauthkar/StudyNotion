import {React,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';
// import { setConfirmationModal } from '../../../../slices/confirmationModalSlice';

const RenderTotalAmount = () => {

    const {total} = useSelector((state)=> state.cart);
    console.log("total", total);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const {cart} = useSelector((state)=> state.cart);
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBuyCourse = () => {
        const courseIds = cart.map((course) => course._id);
        console.log("Bought these courses", courseIds);

        //TODO: api integrate => payment gateway tak leke jayegi
        if(token){
          buyCourse(token, [courseIds], user, navigate, dispatch);
          return;
      }

      //otherwise logged in nahi ho
      setConfirmationModal({
          text1: "you are not Logged in",
          text2: "Please login to purchase the course",
          btn1Text: "Login",
          btn2Text: "Cancel",
          btn1Handler: () => navigate("/login"),
          btn2Handler: () => setConfirmationModal(null)
      })
         
    }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>

        <IconBtn
            text="Buy Now"
            onClick={handleBuyCourse}
            customClasses={"w-full justify-center"}
        ></IconBtn>
    </div>
  )
}

export default RenderTotalAmount