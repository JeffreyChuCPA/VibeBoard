import express, { Request, Response, Router } from "express"

const router: Router = express.Router()

router.get('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params
  
  try {
    res.status(200).json({ message: `Fetching user with ID: ${uid}`})
  } catch (error) {
    res.status(400).json({ message: `Unable to fetch user with ID: ${uid}`, error: error})
  }

  //!implement logic to fetch and send user data
  // () => supabase.from("users").select(`*`).eq("id", uid).single().then(handle),
})

router.put('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params
  const updateData = req.body

  if (!updateData || Object.keys(updateData).length === 0) {
    res.status(400).json({ message: `No update data provided`})
  }

  try {
    res.status(200).json({ message: `Updated ${updateData} for user with ID: ${uid}`})
    
  } catch (error) {
    res.status(400).json({message: `Unable to update ${updateData} for user with ID: ${uid}`, error: error})    
  }


  //!implement logic to update and send user data
  // const response = await supabase
  //   .from("users")
  //   .update(data)
  //   .eq("id", uid)
  //   .then(handle);
})


export default router