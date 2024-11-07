import { Request, Response, NextFunction } from 'express';
import verifyToken from '../../middleware/auth';
import admin from 'firebase-admin';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnThis(),
  verifyIdToken: jest.fn()
}));

const mockVerifyIdToken = admin.auth().verifyIdToken as jest.Mock;

describe('verifyToken Middleware', () => {
  let req: Partial<Request> & { headers: { authorization: string } };
  let res: Partial<Response> & { locals: { user?: object } };
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: { authorization: '' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    }
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with 401 if no token is provided', async () => {
    req.headers.authorization = '';

    await verifyToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond with 401 if the token is invalid', async () => {
    req.headers.authorization = 'invalid-token';
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

    await verifyToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if the token is valid', async () => {
    req.headers.authorization = 'valid-token';
    const mockDecodedToken = { uid: 'test-user-id' };
    mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

    await verifyToken(req as Request, res as Response, next);

    expect(res.locals.user).toBe(mockDecodedToken);
    expect(next).toHaveBeenCalled();
  });
});
