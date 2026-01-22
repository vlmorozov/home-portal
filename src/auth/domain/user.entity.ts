export type UserId = string;
export class User {
  constructor(
    public readonly id: UserId,
    public username: string,
    public email: string,
    public phone: string | null,
    public passwordHash: string | null,
    public emailVerified: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
