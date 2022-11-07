import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    posterId: { type: String, required: true },
    message: { type: String, trim: true, maxLength: 1000 },
    picture: { type: String },
    likers: { type: [String], required: true },
  },
  { timestamps: true }
);

//export du schéma sous forme de modèle mongoose
export default model("Post", postSchema);
