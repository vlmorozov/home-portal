import { LoginEmailUseCase } from '../../../src/auth/application/handlers/login-email.usecase';

describe('LoginEmailUseCase', () => {
  it('returns token if password ok', async () => {
    const users = {
      findByEmail: jest
        .fn()
        .mockResolvedValue({ id: 'u1', email: 'e', passwordHash: 'h' }),
    } as any;
    const hasher = { compare: jest.fn().mockResolvedValue(true) } as any;
    const tokens = { access: jest.fn().mockReturnValue('jwt') } as any;
    const uc = new LoginEmailUseCase(users, hasher, tokens);
    await expect(uc.execute({ email: 'e', password: 'p' })).resolves.toEqual({
      accessToken: 'jwt',
      userId: 'u1',
    });
  });
});
