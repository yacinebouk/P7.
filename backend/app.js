import bodyparser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { json as _json, urlencoded } from 'express'

const app = express()
import { connect } from 'mongoose'
import { crossOriginResourcePolicy } from 'helmet'
import { join } from 'path'
import cors from 'cors'

//import du routeur utilisateur
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'

//import des middlewares
import { checkTokenUser, requireAuth } from './middlewares/auth.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

export const dirname = path.dirname(__filename)


app.use(bodyparser.json())
app.use(cookieParser())
app.use(_json())
app.use(urlencoded({ extended: true }))
app.use(crossOriginResourcePolicy({ policy: 'same-site' }))

//connexion au serveur mongoDB
connect(
  'mongodb+srv://yass:yacine59@cluster0.gtfnfom.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

// Vérification des utilisateurs
app.get('*', checkTokenUser)
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
})

app.use('/uploads', express.static(join(dirname, 'uploads')))

// Routes
app.use('/api/auth', userRoutes)
app.use('/api/post', postRoutes)

export default app