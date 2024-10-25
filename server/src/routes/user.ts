import express, { Request, Response, Router } from "express"

const router: Router = express.Router()

router.get('/:uid', async (req: Request, res: Response) => {
  const uid = req.params.uid

  console.log(`User with ID: ${uid}`);
  
  if (uid) {
    res.status(200).json({ message: `Fetching user with ID: ${uid}`})
  } else {
    res.status(400).json({ message: `Unable to fetch user with ID: ${uid}`})
  }

  //!implement logic to fetch and send user data
  // () => supabase.from("users").select(`*`).eq("id", uid).single().then(handle),
})

router.put('/:uid', async (req: Request, res: Response) => {
  const uid = req.params.uid
  const data = req.body

  if (uid && data) {
    res.status(200).json({ message: `Updated ${data} for user with ID: ${uid}`})
  } else {
    res.status(400).json({message: `Unable to update ${data} for user with ID: ${uid}`})
  }

  //!implement logic to update and send user data
  // const response = await supabase
  //   .from("users")
  //   .update(data)
  //   .eq("id", uid)
  //   .then(handle);
})


export default router