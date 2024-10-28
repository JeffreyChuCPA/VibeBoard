import express, { Request, Response, Router } from "express";
import verifyToken from "../middleware/auth";

const router: Router = express.Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
  const { from, to, owner} = req.query
  const user = res.locals.user

  console.log(user);
  

  if (owner) {
    console.log(`Owner ID: ${owner}`);
    res.status(200).json({ message: `Fetching keyboard themes for owner ${owner}` })
  } else if (from && to) {
    console.log(`Keyboards from ${from} to ${to}`);
    res.status(200).json({ message: `Fetching keyboards from ${from} to ${to}`})
  } else {
    res.status(400).json({ message: `No valid filters provided`})
  }
  
  //!implement logic to fetch and send keyboard data based on ownerID
  //supabase
      //   .from("keyboard_themes")
      //   .select(
      //     "id, theme_name, description, keyboard_size, keyboard_layout, platform, image_path",
      //   )
      //   .eq("owner", owner_id)
      //   .then(handle),

  //!implement logic to fetch and send paginated keyboard data
   // supabase
    //   .from("keyboard_themes")
    //   .select(
    //     "id, theme_name, description, keyboard_size, keyboard_layout, platform, image_path",
    //   )
    //   .then(handle),
})

router.get('/:theme_ID', verifyToken, async (req: Request, res: Response) => {
  const { themeID } = req.params
  const withColors = req.query.withColors === 'true'

  console.log(`Keybord Theme ID: ${themeID}`);
  console.log(`withColors: ${withColors}`);

  if (!themeID) {
    res.status(400).json({ message: `Specific keyboard not identified`})
  }

  const responseMessage = `Fetching specific keyboard ${withColors ? 'with' : 'without'} color`

  res.status(200).json({ message: `${responseMessage}`})

  //!implement logic to fetch and send specific keyboard and the specific colors
  // supabase
      //   .from("keyboard_themes")
      //   .select(
      //     `id, theme_name, description, key_cap_color, keyboard_color, keyboard_shape, keyboard_size, keyboard_layout, platform, image_path, owner${
      //       withColors
      //         ? ", keyboard_theme_keys ( key_id, key_label_color )"
      //         : ""
      //     }`,
      //   )
      //   .eq("id", theme_id)
      //   .then(handle),
})

router.post('/add', verifyToken, async (req: Request, res: Response) => {
  const requiredFields: string[] = [
    'theme_name',
    'description',
    'keyboard_color',
    'key_cap_color',
    'keyboard_shape',
    'keyboard_size',
    'keyboard_layout',
    'platform',
    'owner',
    'image_path',
  ]

  const hasAllFields: boolean = requiredFields.every(field => req.body[field])

  if (!hasAllFields) {
    res.status(400).json({ message: `Unable to post keyboard`})
  }
  
  console.log('Posted keyboard')
  res.status(200).json({ message: `Posted keyboard`, id: crypto.randomUUID()})

  //!implement logic to post keyboard and to return an ID in response
  // supabase
  // .from("keyboard_themes")
  // .upsert(themeData, { onConflict: "theme_name" })
  // .select()
  // .then(handle);
})

router.post('/add/keyboard_theme_keys', verifyToken, async (req: Request, res: Response) => {
  const requiredFields =  [ 'key_id', 'key_label_color', 'theme_id' ]
  const hasAllFields = requiredFields.every(field => req.body[field])

  if (!hasAllFields) {
    res.status(400).json({ message: `Unable to post keyboard key data`})
  }

  const { theme_ID } = req.body
  res.status(200).json({ message: `Posted keyboard data with Theme ID: ${theme_ID}`})
})

router.delete('/:theme_ID', verifyToken, async (req: Request, res: Response) => {
  const id = req.params.theme_ID

  if (id) {
    console.log(`Deleted keyboard of ID: ${id}`);
    res.status(200).json({ message: `Deleted keyboard of ID: ${id}`})
  } else (
    res.status(400).json({ message: `Unable to delete keyboard`})
  )
})


export default router