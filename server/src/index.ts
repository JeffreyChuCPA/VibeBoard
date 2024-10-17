import express, { Application, Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running...')
})

app.listen(PORT, () => console.log(`Server is live on http://localhost:${PORT}`))