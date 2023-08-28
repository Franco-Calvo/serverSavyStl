import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    fileModel: { type: String, required: true },
    category: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["public", "private"],
        default: "public",
    },
});
const FileModel = mongoose.model("files", schema);
export default FileModel;
