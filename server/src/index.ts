import express, { Application, Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import routes from "./startup/routes";
import admin from 'firebase-admin'

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 8000
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'vibeboard-f4664'
})

app.use(cors())
app.use(express.json())
routes(app)

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running...')
})

if (process.env.NODE_ENV !== 'test')  {
  app.listen(PORT, () => console.log(`Server is live on http://localhost:${PORT}`))
}

export { app }