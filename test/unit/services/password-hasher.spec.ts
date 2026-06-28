import { PasswordHasher } from '../../../src/auth/application/services/password.service';

describe('PasswordHasher', () => {
  it('hash/compare', async () => {
    const hasher = new PasswordHasher();
    const h = await hasher.hash('Pass1234');
    await expect(hasher.compare('Pass1234', h)).resolves.toBe(true);
  });
});
