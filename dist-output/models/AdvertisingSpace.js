import mongoose, { Schema } from "mongoose";
const adSpaceSchema = new Schema({
    name: { type: String, enum: ["PrincipalSpace", "SecondarySpace", "TertiarySpace"], required: true },
    image: { type: String, required: true },
});
const AdSpaceModel = mongoose.model("adSpaces", adSpaceSchema);
export default AdSpaceModel;
