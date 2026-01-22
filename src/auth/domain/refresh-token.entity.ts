export class RefreshToken {
  constructor(
    public readonly id: string,
    public userId: string,
    public token: string,
    public expiresAt: Date,
    public createdAt: Date,
    public revokedAt: Date | null,
  ) {}
}
