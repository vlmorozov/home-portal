import { PasswordHasher } from '../../../src/application/services/password-hasher';

describe('PasswordHasher', () => {
  it('hash/compare', async () => {
    const hasher = new PasswordHasher();
    const h = await hasher.hash('Pass1234');
    await expect(hasher.compare('Pass1234', h)).resolves.toBe(true);
  });
});
