import { createWriteStream } from "fs";
import stream from 'stream'
import util from 'util'
const pipeline = util.promisify(stream.pipeline)
import fs from 'fs'
import User from "../models/user.model.js";
import { uploadErrors } from "../middlewares/errors.js";
import { dirname } from "../app.js";

// upload de l'image de profil
export async function uploadPic(req, res) {
  const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
  };


  try {
    if (!MIME_TYPES) {
      throw Error("invalid file");
    }
    if (req.file.size > 500000) {
      throw Error("max size");
    }
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(400).json({ errors });
  }

  // chaque username étant unique, le nom du fichier sera retourné en tant que "username + jpg" peu importe le type de fichier choisi par l'utilisateur.
  // Pas de surstockage d'image car l'image précédente sera écrasée par la nouvelle ayant le même nom
  const fileName = req.body.name + ".jpg";
  console.log(dirname.replace('backend', 'frontend'))

  // création stockage des images en statique
  await pipeline(
    req.file.stream,
    // chemin où sont stockées les images
    createWriteStream(
      `${dirname.replace('backend', 'frontend')}/public/uploads/profil/${fileName}`
    )
  )

  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    next()
  } catch (err) {
    return res.status(500).send({ message: err });
  }
}
