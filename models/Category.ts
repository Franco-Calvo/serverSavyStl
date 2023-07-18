import mongoose, { Model, Schema } from "mongoose";

export interface ICategory {
  name: string;
  _id?: string;
}

const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category: Model<ICategory> = mongoose.model("Categoria", categorySchema);

export default Category;
