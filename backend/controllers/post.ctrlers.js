import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadErrors } from "../middlewares/errors.js";
import mangoose from "mongoose";
import { createWriteStream, existsSync, unlinkSync, unlink } from "fs";
import stream from 'stream'
import util from 'util'
const pipeline = util.promisify(stream.pipeline)
import { dirname } from "../app.js";

// liste des posts avec tri du plus récent au plus ancient
export function readPost(req, res) {
  Post.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Pas de data : " + err);
  }).sort({ createdAt: -1 });
}

// création de posts
export async function createPost(req, res) {
  let fileName;
  // contrôle de l'image à uploader
  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      )
        throw Error("invalid file");

      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(400).json({ errors });
    }
    // Façon dont seront nommées les images en format jpg
    fileName = req.body.posterId + Date.now() + ".jpg";

    // création stockage des images en statique
    await pipeline(
      req.file.stream,
      // chemin où sont stockées les images
      createWriteStream(
        `${dirname.replace('backend', 'frontend')}/public/uploads/posts/${fileName}`
      )
    );
  }
  // le modèle post est incrémenté
  const newPost = new Post({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    likers: [],
  });

  // enregistrement du post dans la base de données
  newPost
    .save()
    .then(() => res.status(201).json({ newPost }))
    .catch((error) => res.status(400).json({ error }));
}

// modification des posts
export async function updatePost(req, res) {
  if (!mangoose.isValidObjectId(req.params.id) || User.admin === 0) {
    return res.status(400).send("ID non connu : " + req.params.id);
  } else {
    const updatedPost = {};
    if (req.body.message && req.body.message !== "null") {
      updatedPost.message = req.body.message;
    }
    if (req.file) {
      // suppression de l'image qui est mise à jour
      Post.findOne({ _id: req.params.id }).then((post) => {
        // suppression de l'image statique originale du post
        const fileName = post.picture.split("./uploads/posts/")[1];
        if (
          existsSync`${dirname.replace('backend', 'frontend')}/public/uploads/posts/${fileName}`
        ) {
          unlinkSync(
            `${dirname.replace('backend', 'frontend')}/public/uploads/posts/${fileName}`
          ),
            (err) => {
              if (err) throw err;
              console.log("Image supprimée !");
            };
        }
      });

      try {
        if (
          req.file.detectedMimeType != "image/jpg" &&
          req.file.detectedMimeType != "image/png" &&
          req.file.detectedMimeType != "image/jpeg"
        )
          throw Error("invalid file");

        if (req.file.size > 500000) throw Error("max size");
      } catch (err) {
        const errors = uploadErrors(err);
        return res.status(400).json({ errors });
      }

      // Nommage de l'image en format jpg
      let newFileName = Date.now() + "_" + req.file.originalName;
      // création de l'image en statique
      await pipeline(
        req.file.stream,
        // chemin où sont stockées les images
        createWriteStream(
          `${dirname.replace('backend', 'frontend')}/public/uploads/posts/${fileName}`
        )
      );

      updatedPost.picture = `./uploads/posts/${newFileName}`;
    }
    // mise à jour des nouvelles données dans MongoDB
    Post.findByIdAndUpdate(
      req.params.id,
      { $set: updatedPost },
      { new: true },
      (err, docs) => {
        if (!err) {
          res.send(docs);
        } else {
          const errors = uploadErrors(err);
          return res.status(400).json({ errors });
        }
      }
    );
  }
}

// suppression des posts
export function deletePost(req, res) {
  if (!mangoose.isValidObjectId(req.params.id) || User.admin === 0)
    return res.status(400).send("ID inconnu : " + req.params.id);

  Post.findOne({ _id: req.params.id }).then((post) => {
    // suppression de l'image statique
    const fileName = post.picture.split("./uploads/posts/")[1];
    unlink(
      `${dirname.replace('backend', 'frontend')}/public/uploads/posts/${fileName}`,
      () => {
        // suppression du post dans MongoDB
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    );
  });
}

// ajout de likes
export async function likePost(req, res) {
  if (!mangoose.isValidObjectId(req.params.id))
    return res.status(400).send("Id inconnu : " + req.params.id);

  try {
    /* Ajout de l'id utilisateur au tableau likers du post */
    Post.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    /* Ajout de l'id du post au tableau likes de l'utilisateur */
    User.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
}

// retrait de likes
export async function unlikePost(req, res) {
  if (!mangoose.isValidObjectId(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    /* Retrait de l'id utilisateur au tableau likers du post */
    Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    /* Retrait de l'id du post au tableau likes de l'utilisateur */
    User.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
}
