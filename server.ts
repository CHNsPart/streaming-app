import express  from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db";
import fileRoute from "./routes/files"
import videos from "./routes/videos"
import path from 'path';
import { v2 as cloudinary } from "cloudinary"

/* Environment Section */
const app = express()
dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLUDINARY_API_CLOUD,
    api_key: process.env.CLUDINARY_API_KEY,
    api_secret: process.env.CLUDINARY_API_SECRET,
    secure:true
})

/* app.set('uploads', path.join(__dirname, 'uploads')); */
/* app.use(express.static(__dirname + 'uploads/')); */
app.use(express.static(path.join(__dirname, 'uploads')));
/* app.use(express.static("uploads")); */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/', express.static(__dirname));
app.use("/api/files", fileRoute)
app.use("/videos", videos)

/* Database Connection */
connectDB()

/* Variables */
const PORT = process.env.PORT

/* App Listening Port */
app.listen(PORT, 
    () => console.log(`Server is listening on ${PORT}`)
)