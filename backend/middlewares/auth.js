import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export function checkTokenUser(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err)
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Utilisateur inconnu !" });
    res.locals.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.send(200).json("Pas de token");
      } else {
        console.log("auth ok " + decodedToken.id);
        next();
      }
    });
  } else {
    console.log("Pas de token");
  }
}
