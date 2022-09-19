/* import  mongoose  from 'mongoose'; */
import express from "express";
import File from '../models/File';

const router = express.Router()

router.get("/", async (req,res)=>{
    res.send(JSON.stringify( await File.find()))
})
export default router