import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import { WalletEntity } from '../entities/wallet.entity';
import {
  CreateWalletDto,
  UpdateWalletDto,
} from 'src/modules/api/dtos/wallet.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WalletService {
  constructor(private readonly WalletRepository: WalletRepository) {}

  // 🟢 Tạo Wallet mới
  async create(data: CreateWalletDto): Promise<WalletEntity> {
    return await this.WalletRepository.walletCreate(data);
  }

  // 🔵 Lấy tất cả Wallet
  async find(): Promise<WalletEntity[]> {
    return await this.WalletRepository.find();
  }

  // 🔵 Lấy 1 Wallet theo ID
  async findById(id: number): Promise<WalletEntity> {
    return await this.WalletRepository.findById(id);
  }

  // 🟡 Cập nhật Wallet
  async update(id: number, data: UpdateWalletDto): Promise<WalletEntity> {
    return await this.WalletRepository.walletUpdate(id, data);
  }

  // 🔴 Xóa Wallet
  async delete(id: number): Promise<void> {
    return await this.WalletRepository.walletDelete(id);
  }
}
