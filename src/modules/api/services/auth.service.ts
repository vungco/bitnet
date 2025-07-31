import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WalletRepository } from 'src/modules/database/repositories/wallet.repository';
import { CreateWalletDto } from '../dtos/wallet.dto';
import { WalletEntity } from 'src/modules/database/entities/wallet.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly jwtService: JwtService,
  ) {}

  async connect(data: CreateWalletDto): Promise<{
    access_token: string;
    items: WalletEntity;
  }> {
    let wallet = await this.walletRepository.findOne({
      where: { address: data.address },
    });

    if (!wallet) {
      wallet = await this.walletRepository.create(data);
    }
    const payload = { sub: wallet.id, address: wallet.address };

    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      items: wallet,
    };
  }

  async disconnect(): Promise<boolean> {
    return;
  }
}
