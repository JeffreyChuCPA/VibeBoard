import { Request, Response} from 'express';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import verifyToken from '../../middleware/auth';
import { app } from '../../index'

// Mock PrismaClient 
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    keyboard_themes: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn() 
    },
    keyboard_theme_keys: {
      upsert: jest.fn(),
      deleteMany: jest.fn()
    }
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prisma = new PrismaClient();

// Mocking middleware
jest.mock('../../middleware/auth', () => jest.fn((req: Request, res: Response, next: () => void) => {
  console.log('Mocked verifyToken called');
  res.locals.user = { uid: '12345'};
  next();
}));

describe('GET /owner', () => {

  afterEach(() => {
    jest.clearAllMocks();
    (verifyToken as jest.Mock).mockImplementation((req, res, next) => {
      res.locals.user = { uid: '12345' }; // Simulate a user without a UID
      next();
    });
  })

  afterAll( async () => {
    await prisma.$disconnect
  })

  it('should return 400 if no owner ID is provided', async () => {

    (verifyToken as jest.Mock).mockImplementation((req, res, next) => {
      res.locals.user = {}; 
      next();
    });

    const response = await request(app).get('/api/keyboard_themes/owner')
    
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe('No owner ID provided');
  });

  it('should return 200 and a list of keyboards when user has a valid uid', async () => {
    const fakeData = [
      {
        id: 1,
        theme_name: 'Dark Theme',
        description: 'A dark theme for keyboards',
        keyboard_size: 'Medium',
        keyboard_layout: 'QWERTY',
        platform: 'win',
        image_path: Buffer.from('dGVzdC1pbWFnZS10by1iYXNlNjQ=','base64'), // Mocking image as Buffer
      },
    ];

    (prisma.keyboard_themes.findMany as jest.Mock).mockResolvedValue(fakeData);

    const response = await request(app).get('/api/keyboard_themes/owner');

    expect(response.statusCode).toEqual(200);
    expect(response.body.result).toHaveLength(1); 
    expect(response.body.result[0].theme_name).toBe('Dark Theme');
    expect(response.body.result[0].image_path).toBe('data:image/png;base64,dGVzdC1pbWFnZS10by1iYXNlNjQ='); // Check value to be base64 string
  });

  it('should return 500 if there is an error in the database query', async () => {
    (prisma.keyboard_themes.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/keyboard_themes/owner');

    expect(response.statusCode).toEqual(500);
    expect(response.body.message).toBe('Internal Server Error');
  });
});

describe('GET /keyboards', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should return 400 if there is no from or to provided as query', async () => {

    const response = await request(app).get('/api/keyboard_themes/keyboards').query({})

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toBe('No valid filters provided')
  })

  it('should return 500 if there is an error in the database query', async () => {
    (prisma.keyboard_themes.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).get('/api/keyboard_themes/keyboards').query({ from: 0, to: 0 })

    expect(response.statusCode).toEqual(500);
    expect(response.body.message).toBe('Internal Server Error')
  })

  it('should return 200 and a list of keyboards', async () => {
    const fakeData = [
      {
        id: 1,
        theme_name: 'Dark Theme',
        description: 'A dark theme for keyboards',
        keyboard_size: 'Medium',
        keyboard_layout: 'QWERTY',
        platform: 'win',
        image_path: Buffer.from('dGVzdC1pbWFnZS10by1iYXNlNjQ=','base64'), // Mocking image as Buffer
      },
    ];

    (prisma.keyboard_themes.findMany as jest.Mock).mockResolvedValue(fakeData)

    const response = await request(app).get('/api/keyboard_themes/keyboards').query({ from: 0, to: 0 })

    expect(response.statusCode).toEqual(200);
    expect(response.body.result).toHaveLength(1); 
    expect(response.body.result[0].theme_name).toBe('Dark Theme');
    expect(response.body.result[0].image_path).toBe('data:image/png;base64,dGVzdC1pbWFnZS10by1iYXNlNjQ='); // Check value to be base64 string
  })
}) 

describe('GET /', () => {
  it('should return 400 when root endpoint is called', async () => {
    const response = await request(app).get(`/api/keyboard_themes`)

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toBe('Specific keyboard not identified')
  })
})

describe('GET /:theme_id', () => {
  const mockTheme_id = '12345'

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should return 404 if given id is invalid', async () => {
    (prisma.keyboard_themes.findUnique as jest.Mock).mockResolvedValue(null)

    const response = await request(app).get(`/api/keyboard_themes/${mockTheme_id}`)

    expect(response.statusCode).toEqual(404)
    expect(response.body.message).toBe(`Keyboard theme with ID ${mockTheme_id} not found`)
  })

  it('should return 500 if there is an error with the database query', async () => {
    (prisma.keyboard_themes.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).get(`/api/keyboard_themes/${mockTheme_id}`)

    expect(response.statusCode).toEqual(500)
    expect(response.body.message).toBe('Internal Server Error')
  })

  it('should return 200 and keyboard theme data for a valid theme_id', async () => {
    (prisma.keyboard_themes.findUnique as jest.Mock).mockResolvedValue({
      id: mockTheme_id,
      theme_name: 'test',
      description: 'test theme',
      key_cap_color: 'light',
      keyboard_color: 'black',
      keyboard_shape: 'angular',
      keyboard_size: '65_keys',
      keyboard_layout: 'QWERTY',
      platform: 'win',
      image_path: Buffer.from('dGVzdC1pbWFnZS10by1iYXNlNjQ=','base64'), // Simulate image data as a Buffer
      owner: 'user123',
      keyboard_theme_keys: [
        { key_id: '1', key_label_color: 'red-500' },
        { key_id: '2', key_label_color: 'cyan-500' },
      ],
    })

    const response = await request(app).get(`/api/keyboard_themes/${mockTheme_id}?withColors=true`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.result).toMatchObject({
      id: mockTheme_id,
      theme_name: 'test',
      description: 'test theme',
      key_cap_color: 'light',
      keyboard_color: 'black',
      keyboard_shape: 'angular',
      keyboard_size: '65_keys',
      keyboard_layout: 'QWERTY',
      platform: 'win',
      owner: 'user123',
      keyboard_theme_keys: [
        { key_id: '1', key_label_color: 'red-500' },
        { key_id: '2', key_label_color: 'cyan-500' },
      ],
      image_path: expect.stringMatching('data:image/png;base64,dGVzdC1pbWFnZS10by1iYXNlNjQ=')
    })
  })

})

describe('POST /add/keyboard_theme', () => {
  const fakeData = {
    theme_name: 'test',
    description: 'test theme',
    keyboard_color: 'black',
    key_cap_color: 'light',
    keyboard_shape: 'angular',
    keyboard_size: '65_keys',
    keyboard_layout: 'QWERTY',
    platform: 'win',
    owner: 'user123',
    image_path: 'data:image/png;base64,dGVzdC1pbWFnZS10by1iYXNlNjQ='
  }

  it('should return 400 if not all fields are in response body', async () => {
    const response = await request(app).post('/api/keyboard_themes/add/keyboard_theme').send({})

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toBe('Unable to post keyboard')
  })

  it('should return 500 if there is an error with the database query', async () => {
    (prisma.keyboard_themes.upsert as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).post('/api/keyboard_themes/add/keyboard_theme').send(fakeData)

    expect(response.statusCode).toEqual(500)
    expect(response.body.message).toBe('Internal Server Error')
  })

  it('should return 200 and the keyboard id if payload has all the required fields', async () => {
    (prisma.keyboard_themes.upsert as jest.Mock).mockResolvedValue({
      id: '12345',
      theme_name: 'test',
      description: 'test theme',
      keyboard_color: 'black',
      key_cap_color: 'light',
      keyboard_shape: 'angular',
      keyboard_size: '65_keys',
      keyboard_layout: 'QWERTY',
      platform: 'win',
      owner: 'user123',
      image_path: Buffer.from('dGVzdC1pbWFnZS10by1iYXNlNjQ=', 'base64')
    })
    
    const response = await request(app).post('/api/keyboard_themes/add/keyboard_theme').send(fakeData)

    expect(response.statusCode).toEqual(200)
    expect(response.body.id).toEqual('12345')
  })
})

describe('POST /add/keyboard_theme_keys', () => {
  const fakeData = [
    {
      theme_id: '123',
      key_id: '1',
      key_label_color: 'red-500'
    },
    {
      theme_id: '123',
      key_id: '2',
      key_label_color: 'cyan-500'
    },
    {
      theme_id: '123',
      key_id: '3',
      key_label_color: 'lime-500'
    }
  ]

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should return 400 if payload is not a valid request (array of KeyboardThemeKey objs)', async () => {
    const response = await request(app).post('/api/keyboard_themes/add/keyboard_theme_keys').send({})

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toBe('Unable to post keyboard key data due to invalid format')
  })

  it('should return 500 if there is an error with the database query', async () => {
    (prisma.keyboard_theme_keys.upsert as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).post('/api/keyboard_themes/add/keyboard_theme_keys').send(fakeData)

    expect(response.statusCode).toEqual(500)
    expect(response.body.message).toBe('Internal Server Error')
  })

  it('should return 200 if payload is a valid request (array of KeyboardThemeKey objs)', async () => {
    const { theme_id } = fakeData[0];

    (prisma.keyboard_theme_keys.upsert as jest.Mock).mockResolvedValue(true)
    
    const response = await request(app).post('/api/keyboard_themes/add/keyboard_theme_keys').send(fakeData)

    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toBe(`Posted keyboard data with Theme ID: ${theme_id}`)
  })
})

describe('DELETE /', () => {
  it('should return 400 when root endpoint is called', async () => {
    const response = await request(app).delete(`/api/keyboard_themes/`)

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toBe('Specific keyboard not identified')
  })
})

describe('DELETE /:theme_id', () => {
  const mockTheme_id = '12345'
  const fakeData = {
    id: mockTheme_id,
    theme_name: 'test',
    description: 'test theme',
    keyboard_color: 'black',
    key_cap_color: 'light',
    keyboard_shape: 'angular',
    keyboard_size: '65_keys',
    keyboard_layout: 'QWERTY',
    platform: 'win',
    owner: 'user123',
    image_path: 'test-image-data'
  }

  afterEach(() => {
    jest.clearAllMocks();
    (verifyToken as jest.Mock).mockImplementation((req, res, next) => {
      res.locals.user = { uid: '12345' }
      next();
    });
  })

  it('should return 400 if no owner ID is provided', async () => {

    (verifyToken as jest.Mock).mockImplementation((req, res, next) => {
      res.locals.user = {}; 
      next();
    });

    const response = await request(app).delete(`/api/keyboard_themes/${mockTheme_id}`)
    
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe('No owner ID provided');
  });

  it('should return 500 if there is an error with the database query for keyboard_themes', async () => {
    (prisma.keyboard_themes.delete as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).delete(`/api/keyboard_themes/${mockTheme_id}`)

    expect(response.statusCode).toEqual(500)
    expect(response.body.message).toBe('Internal Server Error: Unable to delete keyboard')
  })

  it('should return 500 if there is an error with the database query for keyboard_theme_keys', async () => {
    (prisma.keyboard_theme_keys.deleteMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).delete(`/api/keyboard_themes/${mockTheme_id}`)

    expect(response.statusCode).toEqual(500)
    expect(response.body.message).toBe('Internal Server Error: Unable to delete keyboard')
  })

  it('should return 200 for a valid theme_id', async () => {
    (prisma.keyboard_themes.delete as jest.Mock).mockResolvedValue(fakeData);
    (prisma.keyboard_theme_keys.deleteMany as jest.Mock).mockResolvedValue(true);

    const response = await request(app).delete(`/api/keyboard_themes/${mockTheme_id}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toBe(`Deleted keyboard of ID: ${mockTheme_id}`)
    expect(response.body.data).toMatchObject(fakeData)
  })
})


