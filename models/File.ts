import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema

interface Ifile extends Document{
    _id: string,
    filename: string,
    secure_url: string,
    local_url:string,
    sizeInBytes: string,
    format: string,
    processed_at?: null,
    is_processed: boolean,
    totalCount: number,
}

const fileSchema = new Schema<Ifile>({
    _id:{
        type: String,
        require: true
    },
    filename:{
        type: String,
        require: true
    },
    secure_url:{
        type: String,
        require: true
    },
    local_url:{
        type: String,
        require: true
    },
    format:{
        type: String,
        require: true
    },
    sizeInBytes:{
        type: String,
        require: true
    },
    processed_at:{
        type: Number,
        default: null,
        require: true
    },
    is_processed:{
        type: Boolean,
        default: false,
        require: true
    },
    totalCount:{
        type: Number,
        default: 0,
        require: true
    },
}, {
    timestamps: true
})

export default mongoose.model<Ifile>("File", fileSchema)