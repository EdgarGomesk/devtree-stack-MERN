import express from 'express'
import cors from 'cors'
import router from './router'
import 'dotenv/config'
import { connectDB } from './config/db' 
import { corsConfig } from './config/cors'

const app = express()

connectDB()

app.use(cors(corsConfig))

// middleware
app.use(express.json())

//Todas las rutas a acceder
app.use('/', router)

export default app 