import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from './apiconnector';
import { catalogData } from './apis';

const {CATALOGPAGEDATA_API} = catalogData;

const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading('Loading...')
  console.log("categoryId here", categoryId)
  let result = [];
  try {
      console.log("here we are", categoryId)
        const response = await apiConnector("POST", CATALOGPAGEDATA_API, {categoryId});

        if(!response?.data?.success){
            throw new Error("Could not fetch the Category page data");
        }

       result = await response.data.data;

  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR ......", error)
     toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId)
  return result
}

export default getCatalogPageData