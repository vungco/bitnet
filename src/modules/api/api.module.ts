import { Module } from '@nestjs/common';
import { WalletController } from './controller/wallet.controller';
import { TransactionController } from './controller/transaction.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../database';
import { Erc20Service } from './services/erc20.service';
import { WalletExternalService } from './services/walletExternal.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [WalletController, TransactionController, AuthController],
  providers: [WalletExternalService, Erc20Service, AuthService],
})
export class ApiModule {}
