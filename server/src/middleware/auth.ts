import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin'

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization || ''

  if (!idToken) {
    res.status(401).json({ error: 'Unauthorized: No token provided'})
    return
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    res.locals.user = decodedToken
    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}

export default verifyToken