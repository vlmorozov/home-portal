import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(@InjectRepository(UserOrmEntity) private repo: Repository<UserOrmEntity>) {}
  findByEmail(email: string) { return this.repo.findOne({ where: { email } }); }
  findByPhone(phone: string) { return this.repo.findOne({ where: { phone } }); }
  findById(id: string) { return this.repo.findOne({ where: { id } }); }
  async save(user: Partial<UserOrmEntity>) { return this.repo.save(user); }
}
