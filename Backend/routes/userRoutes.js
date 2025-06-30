import express from "express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from "../controllers/userController.js";
import { use, useReducer } from "react";

const userRouter=express.Router()

userRouter.get('/data',getUserData);
userRouter.get('/enrolled-courses',userEnrolledCourses);
userRouter.post('/purchase',purchaseCourse);
useReducer.post('/update-course-progress',updateUserCourseProgress)
useReducer.post('/get-course-progress',getUserCourseProgress)
useReducer.post('/add-rating',addUserRating)


export default userRouter;