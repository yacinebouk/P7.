// Imports
import { hash as _hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto-js'
import User from '../models/user.model.js'
import { signupErrors, loginErrors } from '../middlewares/errors.js'
import * as dotenv from 'dotenv';

dotenv.config();



// Création du token encrypté pour une durée de 12h
const maxAge = 12 * 60 * 60 * 1000
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: maxAge,
  })
}

// Enregistrement des utilisateurs
export function signup(req, res) {
  //Chiffrage de l'adresse email
  const emailCryptoJs = crypto.HmacSHA256(req.body.email, 'yassinep7email')
    .toString()
  // Hachage de l'adresse email
  _hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
        username: req.body.username,
      })
      // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(() => {
          res.status(201).json({ message: 'Utilisateur créé !' })
        })
        .catch((err) => {
          const errors = signupErrors(err)
          res.status(400).json({ errors })
        })
    })
    .catch((err) => res.status(500).json({ err }))
}

// Connexion des utilisateurs
export function login(req, res) {
  //Chiffrage de l'adresse email
  const emailCryptoJs = crypto.HmacSHA256(req.body.email, 'yassinep7email')
    .toString()
  // Recherche de l'utilisateur dans la base de données
  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      //si utilisateur non trouvé dans la base de données
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé !' })
      }
      // Si utilisateur trouvé:
      // Comparaison du mot de passe envoyé avec celui hashé dans la base de données
      compare(req.body.password, user.password)
        .then((valid) => {
          // si le mot de passe ne correspond pas
          if (!valid) {
            return res
              .status(401)
              .json({ message: 'Mot de passe incorrect !' })
          }

          // Si le mot de passe correspond
          const token = createToken(user._id)
          // Création d'un cookie contenant le token lisible uniquement par le serveur
          res.cookie('jwt', token, { httpOnly: true, maxAge })
          res.status(201).json({
            userId: user._id,
            token,
          })
        })
        .catch((err) => {
          const errors = loginErrors(err)
          console.log(err)
          res.status(400).json({ errors })
        })
    })
    .catch((err) => res.status(500).json({ err }))
}

// Déconnection des utilisateurs
export function logout(req, res) {
  // Le cookie créé lors de la connection est retiré en 1ms et renvoie l'utilisateur vers la page d'accueil
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}
