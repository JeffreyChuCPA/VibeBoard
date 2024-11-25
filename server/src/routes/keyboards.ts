import express, { Request, Response, Router } from 'express';
import verifyToken from '../middleware/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { primaryColors, sizeEnumMapping } from '../util/helper';
import { KeyboardThemeKey } from '../util/types';

const prisma = new PrismaClient();

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.status(400).json({ message: 'Specific keyboard not identified' });
  return
});

router.delete('/', async (req: Request, res: Response) => {
  res.status(400).json({ message: 'Specific keyboard not identified' });
  return
});

router.get('/owner', verifyToken, async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!user.uid) {
    res.status(400).json({ message: `No owner ID provided` });
    return
  }

  try {
    const userKeyboards = await prisma.keyboard_themes.findMany({
      where: {
        owner: user.uid,
      },
      select: {
        id: true,
        theme_name: true,
        description: true,
        keyboard_size: true,
        keyboard_layout: true,
        platform: true,
        image_path: true,
      },
    });
  
    const result = userKeyboards.map((keyboard) => ({
      ...keyboard,
      image_path: keyboard.image_path
        ? `data:image/png;base64,${keyboard.image_path.toString('base64')}`
        : null,
    }));
  
    res.status(200).json({ result });
    
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    return
  }
});

router.get('/keyboards', async (req: Request, res: Response) => {
  const { from, to, search } = req.query;

  if (!search && (!from || !to)) {
    res.status(400).json({ message: `No valid filters provided` });
    return;
  }

  try {
    const skip = parseInt(from as string, 10)
    const take = parseInt(to as string, 10) - skip
    let publicKeyboards;
    
    const searchWords = search ? (search as string).split(' ') : []

    const searchColors: string[] = [];

    searchWords.forEach(word => {
      if (word && word as string in primaryColors) {
        searchColors.push(...primaryColors[word as keyof typeof primaryColors])
      }
    })

    //search through keyboard_themes_keys table for theme_ids that contain the certain searched color
    const themeIdsFromKeys = searchColors.length
      ? await prisma.keyboard_theme_keys.findMany({
        where: {
          OR: searchColors.map( color => ({
            key_label_color: {
              contains: color,
            },
          }))
        },
        select: {
          theme_id: true,
        }
      }) 
      : []

    const themeIds = [...new Set(themeIdsFromKeys.map(item => item.theme_id))] 

    //search through keyboard_themes table for paginated keyboards that contain the certain keyword in title, else query paginated keyboards
    if (search) {
      publicKeyboards = await prisma.keyboard_themes.findMany({
        where: {
          OR: [
            ...searchWords.map((word) => ({
              theme_name: {
                contains: word,
                mode: Prisma.QueryMode.insensitive
              },
            })),
            {
              id: {
                in: themeIds
              }
            }
          ],
        },
        skip: skip,
        take: take,
        select: {
          id: true,
          theme_name: true,
          description: true,
          keyboard_size: true,
          keyboard_layout: true,
          platform: true,
          image_path: true,
          owner: true,
          created_at: true,
        },
      });
    } else {
      publicKeyboards = await prisma.keyboard_themes.findMany({
        skip: skip,
        take: take,
        select: {
          id: true,
          theme_name: true,
          description: true,
          keyboard_size: true,
          keyboard_layout: true,
          platform: true,
          image_path: true,
          owner: true,
          created_at: true,
        },
      });
    }

    const result = publicKeyboards.map((keyboard) => ({
      ...keyboard,
      image_path: keyboard.image_path
        ? `data:image/png;base64,${keyboard.image_path.toString('base64')}`
        : null,
    }));
  
    res.status(200).json({ result });
    return;

  } catch (error) {
    console.error('Error occurred:', error)
    res.status(500).json({ message: 'Internal Server Error'})
    return
  }
});

router.get('/:theme_id', async (req: Request, res: Response) => {
  const { theme_id } = req.params;
  const withColors = req.query.withColors === 'true';

  console.log(`Keyboard Theme ID: ${theme_id}`);
  console.log(`withColors: ${withColors}`);

  try {
    const specificKeyboard = await prisma.keyboard_themes.findUnique({
      where: {
        id: theme_id,
      },
      select: {
        id: true,
        theme_name: true,
        description: true,
        key_cap_color: true,
        keyboard_color: true,
        keyboard_shape: true,
        keyboard_size: true,
        keyboard_layout: true,
        platform: true,
        image_path: true,
        owner: true,
        ...(withColors && {
          keyboard_theme_keys: {
            select: {
              key_id: true,
              key_label_color: true,
            },
          },
        }),
      },
    });
  
    if (!specificKeyboard) {
      res
        .status(404)
        .json({ message: `Keyboard theme with ID ${theme_id} not found` });
      return;
    }
  
    const result = {
      ...specificKeyboard,
      image_path: specificKeyboard.image_path
        ? `data:image/png;base64,${specificKeyboard.image_path.toString('base64')}`
        : null,
    };
  
    res.status(200).json({ result });
    return;
    
  } catch (error) {
    console.error('Error occurred:', error)
    res.status(500).json({ message: 'Internal Server Error'})
    return
  }
});

router.post('/add/keyboard_theme', async (req: Request, res: Response) => {
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
  ];

  const {
    theme_name,
    description,
    keyboard_color,
    key_cap_color,
    keyboard_shape,
    keyboard_size,
    keyboard_layout,
    platform,
    owner,
    image_path,
  } = req.body;

  const hasAllFields: boolean = requiredFields.every(
    (field) => req.body[field],
  );

  if (!hasAllFields) {
    res.status(400).json({ message: `Unable to post keyboard` });
    return;
  }

  const base64Image = image_path.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64Image, 'base64');

  try {
    const createdKeyboardTheme = await prisma.keyboard_themes.upsert({
      where: { theme_name: theme_name },
      update: {
        theme_name: theme_name,
        description: description,
        keyboard_color: keyboard_color,
        key_cap_color: key_cap_color,
        keyboard_shape: keyboard_shape,
        keyboard_size: sizeEnumMapping(keyboard_size),
        keyboard_layout: keyboard_layout,
        platform: platform,
        owner: owner,
        image_path: binaryData,
      },
      create: {
        theme_name: theme_name,
        description: description,
        keyboard_color: keyboard_color,
        key_cap_color: key_cap_color,
        keyboard_shape: keyboard_shape,
        keyboard_size: sizeEnumMapping(keyboard_size),
        keyboard_layout: keyboard_layout,
        platform: platform,
        owner: owner,
        image_path: binaryData,
      },
    });

    console.log('Posted keyboard');
    res.status(200).json({ id: createdKeyboardTheme.id });
    return;
  } catch (error) {
    console.error('Error creating keyboard theme:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
});

//request body passes an array of objects, with specific keys: 'key_id', 'key_label_color', 'theme_id'
router.post('/add/keyboard_theme_keys', async (req: Request, res: Response) => {
  const requiredFields = ['key_id', 'key_label_color', 'theme_id'];
  const body = req.body as KeyboardThemeKey[];

  const isValidRequest =
    Array.isArray(body) &&
    body.every((obj) => requiredFields.every((key) => key in obj));

  if (!isValidRequest) {
    res
      .status(400)
      .json({
        message: `Unable to post keyboard key data due to invalid format`,
      });
    return;
  }

  const { theme_id } = body[0];
  try {
    for (const data of body) {
      await prisma.keyboard_theme_keys.upsert({
        where: {
          theme_id_key_id: {
            theme_id: data.theme_id,
            key_id: data.key_id,
          },
        },
        update: {
          key_label_color: data.key_label_color,
        },
        create: {
          theme_id: data.theme_id,
          key_id: data.key_id,
          key_label_color: data.key_label_color,
        },
      });
    }

    res
      .status(200)
      .json({ message: `Posted keyboard data with Theme ID: ${theme_id}` });
    return;
  } catch (error) {
    console.error('Error creating keyboard theme keys:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
});

router.delete('/:theme_id', verifyToken, async (req: Request, res: Response) => {
  const { theme_id } = req.params;
  const user = res.locals.user;

  if (!user.uid) {
    res.status(400).json({ message: `No owner ID provided` });
    return
  }

  try {
    const deletedKeyboardTheme = await prisma.keyboard_themes.delete({
      where: {
        owner: user.uid,
        id: theme_id,
      },
    });
  
    await prisma.keyboard_theme_keys.deleteMany({
      where: {
        theme_id: theme_id
      }
    })
  
    console.log(`Deleted keyboard of ID: ${theme_id}`);
    res
      .status(200)
      .json({
        message: `Deleted keyboard of ID: ${theme_id}`,
        data: deletedKeyboardTheme,
      });
      return
  } catch (error) {
    console.error('Error deleting keyboard', error);
    res.status(500).json({ message: 'Internal Server Error: Unable to delete keyboard' });
    return;
  }
});

export default router;
