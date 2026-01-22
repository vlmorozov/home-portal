export class OAuthAccount {
  constructor(
    public readonly id: string,
    public userId: string,
    public provider: string,
    public providerId: string,
    public createdAt: Date,
  ) {}
}
