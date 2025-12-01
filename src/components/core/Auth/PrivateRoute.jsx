import React, { Children } from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({children}) => {

  const token = useSelector((state) => state.auth.token)
  console.log("token",token)
  if(token !== null){
    return children;
  }
  else{
    return <Navigate to='/login'></Navigate>
  }
}

export default PrivateRoute