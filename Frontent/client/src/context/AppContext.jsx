import  {createContext, useEffect, useState} from 'react'
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'
import {useAuth,useUser} from "@clerk/clerk-react"
import axios from 'axios';
import { toast } from 'react-toastify';


export const AppContext=createContext();

export const AppContextProvider=(props)=>{

  const backendUrl=import.meta.env.VITE_BACKEND_URL
const currency=import.meta.env.VITE_CURRENCY
const navigate=useNavigate();

const {getToken}=useAuth();
const {isLoaded,user}=useUser()

const [allCourses,setAllCourses]=useState([]);
const [enrolledCourses,setEnrolledCourses]=useState([]);
const [isEducator,setIsEducator]=useState(false);
const [userData,setUserData]=useState(null)


//Fetch All COurses
const fetchAllCourses=async()=>{
try {
 const {data}= await axios.get(backendUrl+'/api/course/all');
 if(data.success){
  setAllCourses(data.courses);
 }else{
  toast.error(data.message);
 }

} catch (error) {
  toast.error(error.message);
}
}

//fetch user data
const fetchUserData=async()=>{

  if(user.publicMetadata.role==='educator'){
    setIsEducator(true);
  }
  try {
    const token=await getToken();
  console.log(token); 
   const {data}= await axios.get(backendUrl+'/api/user/data',{headers:{Authorization:`Bearer ${token}`}})
   if(data.success){
    setUserData(data.user)
   }
   else{
  toast.error(data.message);
   }
  } catch (error) {
  toast.error(error.message);
  }
}


//function to calculate average rating of coourse

const calculateRating=(course)=>{
   if (!Array.isArray(course.courseRatings) || course.courseRatings.length === 0) {
    return 0;
  }
  let totalRating=0;
  course.courseRatings.forEach(rating=>{
    totalRating+=rating.rating
  })
  return Math.floor(totalRating/course.courseRatings.length)
}

//function to calculate course chapter time
const calculateChapterTime=(chapter)=>{
  let time=0;
  chapter.chapterContent.map((lecture)=>{
    time+=lecture.lectureDuration;
  })
  return humanizeDuration(time*60*1000,{units:["h","m"]})
}

//function to calculate course duration
const calculateCourseDuration = (course) => {
  let time = 0;

  course.courseContent?.forEach((chapter) => {
    if (Array.isArray(chapter.chapterContent)) {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    }
  });

  return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
};


// function to calculate to No of lectures in the course

const calculateNoOfLecture = (course) => {
  let totalLectures = 0;

  course.courseContent?.forEach((chapter) => {
    if (Array.isArray(chapter.chapterContent)) {
      totalLectures += chapter.chapterContent.length;
    }
  });

  return totalLectures;
};


//fetch user Enrolled courses
const fetchUserEnrolledCourses=async()=>{
  try {
  const token=await getToken();
  const {data}=await axios.get(backendUrl+'/api/user/enrolled-courses',{headers:{
    Authorization:`Bearer ${token}`
  }})
  
  if(data.success){
    setEnrolledCourses(data.enrolledCourses.reverse())
  }else{
    toast.error("something went wrong");
  }
} catch (error) {
    toast.error(error.message);
}
}

useEffect(()=>{
  if(isLoaded && user){
    fetchAllCourses()
    fetchUserEnrolledCourses()
  }
},[isLoaded,user])


useEffect(()=>{
if(user){
  fetchUserData()
}
},[user])

const value={
currency,
allCourses,
navigate,
calculateRating,
isEducator,
setIsEducator,
calculateChapterTime,
calculateCourseDuration,
calculateNoOfLecture,
enrolledCourses,
setEnrolledCourses,
fetchUserEnrolledCourses,
backendUrl,
userData,
setUserData,
getToken,
fetchAllCourses,
}


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

