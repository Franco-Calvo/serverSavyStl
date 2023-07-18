import mongoose, { Model, Schema } from "mongoose";

export interface IFile {
  name: string;
  description: string;
  image: string;
  fileModel: string;
  category: string;
  _id?: mongoose.Schema.Types.ObjectId;
}

const schema: Schema<IFile> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  fileModel: { type: String, required: true },
  category: { type: String, required: true },
});

const FileModel: Model<IFile> = mongoose.model("files", schema);

export default FileModel;
