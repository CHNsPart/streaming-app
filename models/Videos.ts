import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema

interface Ifile extends Document{
    id?: string,
    url: string,
    processed_at?: null,
    is_processed: boolean,
    totalCount: number,
}

const videosSchema = new Schema<Ifile>({
    id:{
        type: Schema.Types.ObjectId,
        require: true
    },
    url:{
        type: String,
        require: true
    },
    processed_at:{
        type: Number,
        require: true
    },
}, {
    timestamps: true
})

export default mongoose.model<Ifile>("Videos", videosSchema)