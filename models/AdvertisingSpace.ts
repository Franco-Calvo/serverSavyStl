import mongoose, { Model, Schema } from "mongoose";

export interface IAdSpace {
  name: "PrincipalSpace" | "SecondarySpace" | "TertiarySpace";
  image: string;
  _id?: mongoose.Schema.Types.ObjectId;
}

const adSpaceSchema: Schema<IAdSpace> = new Schema({
  name: { type: String, enum: ["PrincipalSpace", "SecondarySpace", "TertiarySpace"], required: true },
  image: { type: String, required: true },
});

const AdSpaceModel: Model<IAdSpace> = mongoose.model("adSpaces", adSpaceSchema);

export default AdSpaceModel;