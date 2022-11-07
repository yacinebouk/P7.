import validator from "validator";

//vérification de l'adresse email rentrée
const email = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    return res
      .status(400)
      .json({
        message: `L'adresse email ${req.body.email} n'est pas valide !`,
      });
  } else {
    next();
  }
};
export default email