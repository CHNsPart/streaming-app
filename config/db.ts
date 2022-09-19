import mongoose from "mongoose";

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log('====================================');
    } catch (error:any) {
        console.log('====================================');
        console.log("Connection Error ", error.message);
        console.log('====================================');
    }
    const connection = mongoose.connection
    if(connection.readyState >= 1) {
        console.log("connected to database")
        console.log('====================================')
        return
    } 
    connection.on("error", ()=> {
        console.log('====================================');
        console.log("connection failed");
        console.log('====================================');
    })
 }

 export default connectDB