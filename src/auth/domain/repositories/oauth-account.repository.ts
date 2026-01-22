import { OAuthAccount } from '../oauth-account.entity';
export interface OAuthAccountRepository {
  findByProviderId(provider: string, providerId: string): Promise<OAuthAccount | null>;
  link(account: OAuthAccount | Partial<OAuthAccount>): Promise<OAuthAccount>;
}
