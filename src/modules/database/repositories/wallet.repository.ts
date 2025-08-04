import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WalletEntity } from '../entities/wallet.entity';
import {
  CreateWalletDto,
  UpdateWalletDto,
} from 'src/modules/api/dtos/wallet.dto';

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
  constructor(private dataSource: DataSource) {
    super(WalletEntity, dataSource.createEntityManager());
  }

  async walletCreate(data: CreateWalletDto): Promise<WalletEntity> {
    const Wallet = this.create(data);
    return await this.save(Wallet);
  }

  async find(): Promise<WalletEntity[]> {
    return await this.find();
  }

  async findById(id: number): Promise<WalletEntity> {
    const Wallet = await this.findOne({ where: { id } });
    if (!Wallet)
      throw new NotFoundException('Wallet with id : ${id} not found');
    return Wallet;
  }

  async walletUpdate(id: number, data: UpdateWalletDto): Promise<WalletEntity> {
    const Wallet = await this.findById(id);
    Object.assign(Wallet, data);
    return await this.save(Wallet);
  }

  async walletDelete(id: number): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Wallet with id : ${id} not found');
    }
  }
}
