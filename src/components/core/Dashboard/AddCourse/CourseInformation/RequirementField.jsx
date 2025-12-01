import React from 'react'
import { useEffect, useState } from 'react'


const RequirementField = ({
    name, label, register, errors, setValue, getValues
}) => {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

    useEffect(() => {
        register(name, 
            {required: true, 
                validate: value => value.length > 0
            });
    }, []);

    useEffect(() => {
        setValue(name, requirementList);
    }, [requirementList]);

    const handleAddRequirement = () => {
        if(requirement) {
            setRequirementList([...requirementList, requirement]);
            // setValue(name, [...requirementList, requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement = (index) => {
        const updateRequirementList = [...requirementList];
        updateRequirementList.splice(index, 1);
        setRequirementList(updateRequirementList);
        // setValue(name, list);
    }
  return (
    <div className="flex flex-col space-y-2">
    <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup></label>
        <div>
            <input type="text" 
                id={name}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            />

            <button 
                type="button" 
                onClick={handleAddRequirement}
                className="font-semibold text-yellow-50"
            >
                Add
            </button>
        </div>


        {
            requirementList.length > 0 && (
                <ul className="mt-2 list-inside list-disc">
                    {
                        requirementList.map((requirement, index) => (
                            <li key={index}
                            className="flex items-center text-richblack-5"
                            >
                                <span>{requirement}</span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveRequirement(index)}
                                    className="ml-2 text-xs text-pure-greys-300 "
                                >
                                    Clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }

        {
            errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                {label} is required
                </span>
            )
        }
    </div>
  )
}

export default RequirementField