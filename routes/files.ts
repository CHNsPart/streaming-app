import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import express from "express";
import multer from "multer";
import fs from "fs"
import File from "../models/File";
// import mongoose from "mongoose";

const router = express.Router();
// const File = mongoose.model('File');

const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

const d = new Date();
let year = d.getFullYear();
let month = months[d.getMonth()];
let day = d.getDate();

const checkDate = (d:any) => {
    if (d===month){
        return month
    }
    else {
        month = d
        return month
    }
}

checkDate(month)

var storage:multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    const path =  `uploads/${year}/${month}/${day}`
    cb(null, path)
    fs.mkdirSync(path, { recursive: true })
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, Date.now()+'.'+extension) //Appending .jpg
  }
})
const upload = multer({dest:'uploads/', storage:storage});

router.post("/local_upload", upload.single("myFile"), async(req, res, next)=>{
    if(!req.file){
            return res.status(400).json({ message: "No File was selected Maeeeen! 🥲" })
        }
        console.log(req.file)
    try {
        const {originalname, filename, size, mimetype} = req.file
        let local_url = `${process.env.LOCAL_URI}${year}/${month}/${day}/${filename}`
        let split_file = req.file.filename.split(".")
        let id = split_file[0]
        let secure_url = null
        let file = await File.create({
            _id:id,
            filename:originalname,
            sizeInBytes:size,
            secure_url:secure_url,
            local_url:local_url,
            format:mimetype,
            processed_at:null,
            is_processed:false,
            totalCount:0
        })
        res.status(200).json(file)
        console.log('==============GET-Files=============');
        console.log(file);
        console.log('====================================');
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
    next()
})

router.post("/upload", upload.single("myFile"), async(req,res,next)=>{
    try {
        if(!req.file){
            return res.status(400).json({ message: "No File was selected Maeeeen! 🥲" })
        }
        /* console.log(req.file) */
        let uploadedFile: UploadApiResponse

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{
                folder: "shareCHN",
                resource_type: "auto"
            })
        } catch (error:any) {
            console.log('====================================');
            console.log(error.message);
            console.log('====================================');
            return res.status(400).json({ message: "Cloudinary Error" })
        }

        const {originalname} = req.file
        const {secure_url, bytes, format} = uploadedFile
        //object /ID ==>
        let local_id = secure_url.slice(70,)
        // https://localhost:8000/api/files + /object ID ==>
        let local_url = (`https://localhost:8000/api/files${local_id}`)
        console.log(local_url)
        let file = await File.create({
            filename:originalname,
            sizeInBytes:bytes,
            secure_url:secure_url,
            local_url:local_url,
            format:format,
            processed_at:null,
            is_processed:false,
            totalCount:0
        })
        res.status(200).json(file)
        console.log('==============GET-Files=============');
        console.log(file);
        console.log('====================================');
    } catch (error:any) {
        console.log('====================================');
        console.log(error.message);
        console.log('====================================');
        res.status(500).json({ message: "Server Error 😔" })
    }
    next()
})

router.get("/", async (req,res)=>{
    File.find({}, (error:any, File:[])=>{
        if(error){
            console.log('====================================');
            console.log(error.message);
            console.log('====================================');
            res.status(400).json({ message: "Can not Find 😔" })
        }
        else {
            res.send(JSON.stringify(File))
        }
    })
})

router.get("/:id", (req, res)=>{
    let o_id = req.params.id
    File.findById(o_id as any, (error:any, File:[])=>{
        if(error){
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
        else {
            res.send(JSON.stringify(File))
        }
    })
})
/* {
    "is_processed":true
} */

router.patch("/:id", async (req, res)=>{
    try {
        const searched_file:any = await File.findById(req.params.id)
        searched_file.is_processed = true /* req.body.is_processed */
        searched_file.totalCount = req.body.totalCount
        const updated_file = await searched_file.save()
        res.json(updated_file)
    } catch (error) {
        res.status(404).send({ error: "File not found! 🥺" })
    }
})

export default router