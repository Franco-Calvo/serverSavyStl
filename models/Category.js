import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model('Categoria', categorySchema )

export default Category;

