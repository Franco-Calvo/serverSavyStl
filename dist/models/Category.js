import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});
const Category = mongoose.model("Categoria", categorySchema);
export default Category;
