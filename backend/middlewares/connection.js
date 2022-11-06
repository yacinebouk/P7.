// import de la dépendance express-rate-limit afin de limiter le nombre de tentatives de connections possibles
import { rateLimit } from "express-rate-limit";

// configuration du nombre de tentatives possibles avant d'être bloqué
const maxAttemps = rateLimit({
  // temps d'attente
  windowMs: 1 * 60 * 1000,
  // tentatives limitées à 3 avant d'être bloqué
  max: 33363,
  message: "Votre compte a été bloqué, veuillez réessayer dans 1 minutes.",
});
export default maxAttemps