import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import {clerkMiddleware} from '@clerk/express'
import conncetCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

// Initialize Express
const app=express();



//conncet to database
await connectDB()
await conncetCloudinary();

app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)


//Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())


// routes
app.get('/',(req,res)=>res.send("Api Working"))
app.post('/clerk',express.json(),clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)

//port
const PORT = process.env.PORT || 5000;

// Start the server
if(process.env.NODE_ENV!=="production"){

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

//Export server for vercel
export default app;