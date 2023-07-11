import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: false },
  description: { type: String, required: false },
  image: { type: String, required: false },
  fileModel: { type: String, required: false },
  category: { type: String, required: false },
});

const FileModel = mongoose.model("files", schema);

export default FileModel;
