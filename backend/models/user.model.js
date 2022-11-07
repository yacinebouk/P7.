import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    picture: { type: String, default: "./uploads/profil/defaultImg.jpg" },
    likes: { type: [String] },
    admin: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//utilisation de mongoose-unique-validator au schéma avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

//export du schéma sous forme de modèle mongoose
export default model("User", userSchema);
